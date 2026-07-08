import os
import time
import json
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import fitz

# Load environment variables from API.env
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "API.env"))

app = Flask(__name__)
CORS(app)

# Initialize the OpenAI client pointing to the Featherless API
client = OpenAI(
    base_url="https://api.featherless.ai/v1",
    api_key=os.getenv("FEATHERLESS_API_KEY")
)

# Semaphore to limit concurrent AI requests (Plan for 72B models usually has lower concurrency)
_ai_semaphore = threading.Semaphore(2)

# Retry wrapper to handle 429 concurrency and 502/504 timeout errors
def call_ai(messages, temperature=0.1, max_retries=3):
    for attempt in range(max_retries):
        try:
            _ai_semaphore.acquire()
            try:
                return client.chat.completions.create(
                    model="Qwen/Qwen2.5-72B-Instruct",
                    messages=messages,
                    temperature=temperature,
                    timeout=120
                )
            finally:
                _ai_semaphore.release()
        except Exception as e:
            err_str = str(e)
            # Retry on rate limits (429) or gateway timeouts (502/504)
            retryable = any(code in err_str for code in ["429", "502", "504"]) or "concurrency" in err_str.lower()
            
            if retryable and attempt < max_retries - 1:
                wait = min(5 + (2 ** (attempt + 1)), 10)
                print(f"AI Provider error (transient), retrying in {wait}s (attempt {attempt+1}/{max_retries}). Error: {'Timeout' if '504' in err_str else 'Rate Limit' if '429' in err_str else err_str[:60]}")
                time.sleep(wait)
            else:
                print(f"AI Call failed after {attempt+1} attempt(s): {err_str[:100]}")
                raise

@app.route("/")
def home():
    return "Backend running"

@app.route("/extract-pdf", methods=["POST"])
def extract_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    print(f"Starting extraction for: {file.filename}", flush=True)
    try:
        file_bytes = file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        num_pages = len(doc)
        print(f"Total pages: {num_pages}", flush=True)
        
        # Limit to 200 pages to avoid extreme hangs, usually enough for forensic reports
        pages_to_read = min(num_pages, 200)
        
        for i in range(pages_to_read):
            if i % 10 == 0:
                print(f"Extracting page {i+1}/{pages_to_read}...", flush=True)
            page = doc[i]
            extracted = page.get_text()
            if extracted:
                text += extracted + "\n"
        
        if num_pages > 200:
            text += "\n\n...[TEXT TRUNCATED AFTER 200 PAGES FOR PERFORMANCE]..."
            print("PDF truncated after 200 pages.", flush=True)
                
        print(f"Extraction complete. Total characters: {len(text)}", flush=True)
        return jsonify({"message": "PDF extracted successfully", "text": text.strip()})
    except Exception as e:
        print(f"Extraction error: {str(e)}", flush=True)
        return jsonify({"error": str(e)}), 500

@app.route("/analyze-full", methods=["POST"])
def analyze_full():
    data = request.json
    evidence = data.get("evidence") or data.get("report")
    if not evidence: 
        return jsonify({"error": "No evidence provided"}), 400
    evidence = evidence[:15000]

    master_prompt = """You are an AI Forensic Master Engine. 
Analyze the evidence and return a SINGLE JSON object with these EXACT keys:
1. 'autopsy': {
    "confidence": number, "probable_cause": string, "probable_cause_confidence": string, "probable_cause_desc": string, 
    "injury_patterns": string[], "medical_observations": string[], "suspicious_indicators": string[], 
    "time_of_death": string, "time_of_death_date": string, "postmortem_interval": string, 
    "blood_alcohol": string, "body_temp": string, "rigor_mortis": string, "livor_mortis": string, "summary": string
   }
2. 'report': {
    "panel1": {"case_id": string, "date": string, "location": string, "unit": string},
    "panel2": {"name": string, "age": string, "gender": string, "height": string, "weight": string, "id_status": string},
    "panel3": {"discovery": string, "notified": string, "circumstances": string},
    "panel4": {"environment": string, "blood": string, "footprints": string, "cctv": string, "missing": string},
    "panel5": {"statements": string, "sounds": string, "suspect": string, "timeline": string},
    "panel6": {"window": string, "body_temp": string, "witness_timeline": string, "cctv_recon": string},
    "panel7": {"injuries": string, "clothing": string, "defensive": string, "struggle": string},
    "panel8": {"head": string, "lungs": string, "heart": string, "organs": string},
    "panel9": {"testing_status": string, "pending_analysis": string},
    "panel10": {"altercation": string, "additional": string, "weapon": string},
    "panel11": {"cctv_analysis": string, "witness_corr": string, "hidden_pred": string},
    "panel12": {"conf_time": number, "conf_cause": number, "conf_align": number},
    "panel13": {"interpretation": string, "surveillance": string, "findings": string},
    "panel14": {"sequence": string, "foul_play": string, "motive": string},
    "panel15": {"cause_status": string, "inv_status": string, "foul_assessment": string},
    "panel16": {"status": string, "id_pending": string, "tox_pending": string},
    "panel17": {"comments": string, "limitations": string, "legal": string}
   }
3. 'risk': {
    "overall_risk_score": number, "confidence": number, 
    "victim_profile": {"age": string, "notes": string[], "risk_level": string},
    "suspect_profile": {"age": string, "notes": string[], "risk_level": string},
    "indicators": [{"label": string, "level": number, "color": "red"|"orange"|"yellow"}],
    "location_risk": {"name": string, "access_risk": string, "surveillance_risk": string},
    "anatomical_injuries": [{"id": string, "type": string, "location": string, "potential_weapon": string, "top": string, "left": string, "color": string}],
    "threat_vectors": [{"type": string, "severity": number}]
   }
4. 'correlation': {"nodes": [{"id": string, "label": string, "color": string}], "connections": [{"from": string, "to": string, "strength": "critical"|"high"|"medium"}]}
5. 'insights': [{"type": "critical"|"warning"|"info", "title": string, "description": string}]
6. 'heatmap': {"points": [{"x": number, "y": number, "severity": "critical"|"warning"|"info", "label": string}], "summary": string}
7. 'anomalies': [{"id": string, "title": string, "src": string, "desc": string, "sev": "CRITICAL"|"HIGH"|"MEDIUM", "sig": number}]
8. 'patterns': {"wound": {"title": string, "conf": number, "details": string[]}, "behavioral": [{"title": string, "sev": string, "conf": number}]}
9. 'timeline': {
    "summary": string, 
    "events": [{"time": string, "title": string, "description": string, "severity": "standard"|"warning"|"critical", "confidence": number, "type": "observed"|"predicted"|"gap"}],
    "ai_predictions": [{"title": string, "description": string, "confidence": number, "basis": string}],
    "ai_insights": [{"type": "critical"|"warning"|"info", "title": string, "description": string}]
   }

Rules:
- Return ONLY valid JSON. 
- Use "Pending" or 0 for missing data.
- Ensure 'timeline' has at least 5 events covering the whole range.
- Be concise. Focus on forensic accuracy."""

    try:
        response = call_ai(
            messages=[{"role": "system", "content": master_prompt}, {"role": "user", "content": f"Evidence:\n{evidence}"}],
            temperature=0.1
        )
        raw = response.choices[0].message.content.strip()
        if raw.startswith("```json"): 
            raw = raw[7:]
        elif raw.startswith("```"): 
            raw = raw[3:]
        if raw.endswith("```"): 
            raw = raw[:-3]
        
        parsed = json.loads(raw.strip())
        return jsonify(parsed)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
