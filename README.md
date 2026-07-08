# Invictus - Forensic Analysis & Investigation Dashboard

Invictus is a web-based dashboard designed to assist forensic investigators in analyzing, correlating, and visualizing evidence. The system parses raw documents (such as PDF autopsy reports), extracts key physiological indicators, overlays wound locations anatomically, establishes timelines, and highlights inconsistencies.

## Architecture

- **Frontend:** A React application bundled with Vite, styled using Tailwind CSS and Radix UI components. Graphs and visual charts are rendered using Recharts.
- **Backend:** A Flask service that processes PDF text extraction and orchestrates structured JSON generation via Featherless API (running Qwen-2.5-72B).

## Prerequisites

- **Node.js** (v18+)
- **Python** (3.8+)
- **Featherless.ai API Key** (or another OpenAI-compatible key)

## Setup

### Backend Setup

1. From the project root, install the Python requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a configuration file named `backend/API.env` based on `backend/API.env.example`:
   ```bash
   cp backend/API.env.example backend/API.env
   ```

3. Open `backend/API.env` and insert your API key:
   ```env
   FEATHERLESS_API_KEY=your_actual_api_key_here
   ```

4. Start the server:
   ```bash
   python backend/app.py
   ```
   The API will listen at `http://127.0.0.1:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   The site will load at `http://localhost:5173`.
