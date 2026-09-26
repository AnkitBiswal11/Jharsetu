<div align="center">

# JharSetu (झार-सेतु)
### Rural Infrastructure Telemetry & Quad-Helix Capstone Innovation Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Type_System-TypeScript_5.6-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Groq LPU](https://img.shields.io/badge/AI_Engine-Groq_LPU_Llama_3.3_70B-F05A28.svg)](https://groq.com)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet.js_EPSG:4326-199900.svg?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![NEP 2020](https://img.shields.io/badge/Compliance-NEP_2020_NHEQF_Level_7-blue.svg)](https://www.education.gov.in/nep)
[![CSR Compliance](https://img.shields.io/badge/Governance-Companies_Act_Sched_VII-green.svg)](https://www.mca.gov.in)

<p align="center">
  <b>A zero-barrier civic intake and capstone orchestration pipeline transforming grassroots distress into audited engineering interventions, university academic credits, and milestone-governed CSR investments.</b>
</p>

[System Architecture](#-system-architecture) •
[Key Differentiators](#-key-differentiators) •
[Tech Stack](#-technology-stack) •
[Prerequisites](#-prerequisites) •
[Quickstart](#-quickstart) •
[API Specification](#-api-specification) •
[Statutory Frameworks](#-statutory--policy-frameworks)

---

</div>

## 📌 Executive Overview

Rural engineering capstones in higher education institutions (HEIs) historically suffer from synthetic problem definitions, low operational viability, and duplicated prior art. Concurrently, grassroots rural distress signals in indigenous belts fail to penetrate centralized grievance desks due to digital literacy, language barriers, and connectivity bottlenecks.

**JharSetu (झार-सेतु)** establishes a verifiable **Quad-Helix engagement bridge** linking:
1. **Grassroots Rural Citizens:** Ingesting distress signals via zero-internet 2G SMS and vernacular IVR telephony in regional dialects (Sadri, Khortha, rural Hindi).
2. **Artificial Intelligence Layer:** Utilizing Groq LPU inference (~380ms latency) to normalize informal spoken complaints into structured, academic-grade IEEE capstone dossiers.
3. **Higher Education Institutions (HEIs):** Connecting student engineering teams and faculty mentors to real-world community challenges, backed by automated InPASS patent novelty auditing and direct 6.0 NEP 2020 DigiLocker/ABC credit issuance.
4. **Corporate CSR & State Governance:** Enforcing dual-key cryptographic escrow under Section 135 / Schedule VII of the Companies Act 2013, ensuring capital releases only upon simultaneous field sign-off from the Block Development Officer (BDO) and technical validation from the Academic Mentor.

---

## 🏗️ System Architecture
[ Grassroots Telephony ]
│ • 2G SMS Shortcode (56161)
│ • Dialect IVR Audio (Sadri / Khortha / Hindi)
│ • Web Field Audits (Geotagged EXIF Media)
▼
[ Zero-Barrier Ingestion Gateway ]
│ • Audio normalization & GSM frame capture
▼
[ Sub-Second Groq LPU AI Triage (~380ms) ]
│ • Open-weights Llama 3.3 70B inference
│ • Normalizes dialect audio ➔ IEEE Capstone Specification
│ • Metadata extraction: Severity, Root Metrics, Tech Domain Taxonomy
▼
[ Cadastral GIS Telemetry & Spatial Matrix ]
│ • Survey of India 24-District GeoJSON (EPSG:4326)
│ • Anti-overlap micro-jitter live radar pin cluster
│ • Bidirectional deep-link routing into the Challenge Bank
▼
[ Academic R&D & InPASS Prior-Art Screening ]
│ • Student teams claim verified challenges
│ • Indian Patent Office (InPASS) & WIPO IPC novelty audit
│ • Mandatory BDO administrative ground verification gate
▼
[ NEP 2020 Accreditation & Dual-Key Escrow Execution ]
│ • 6.0 Experiential Credits minted to DigiLocker / Academic Bank of Credits (ABC)
│ • Companies Act 2013 (Sched. VII) Escrow Custody
│ • Fund tranche release: BDO Admin Key + Faculty Mentor Tech Key

---

## ⚡ Key Differentiators

| Core Feature | Traditional Grievance / Project Systems | **JharSetu Architecture** |
| :--- | :--- | :--- |
| **Ingestion Surface** | Heavy Android apps / English portals | **2G SMS (`56161`) & Vernacular Audio IVR** |
| **Linguistic Reach** | Standard English / formal Hindi text | **Spoken Sadri, Khortha, and Rural Hindi** |
| **Triage Speed** | Days/weeks of manual administrative routing | **Sub-second (~380ms) via Groq LPU** |
| **Academic Purpose** | Synthetic / disconnected "toy" simulations | **Validated grassroots community engineering** |
| **Prior-Art Verification**| None (rampant code/patent duplication) | **Automated InPASS (IPO) & WIPO IPC checks** |
| **Credit Certification** | Manual paperwork / subjective assessment | **Automated 6.0 NEP 2020 DigiLocker / ABC Minting** |
| **CSR Capital Audit** | Unconditional lump-sum disbursements | **Dual-Key Escrow (BDO + Faculty concurrent sign-off)** |

---

## 🛠️ Technology Stack

### Frontend Application Layer
- **Framework:** React 19 (Strict Mode, Hooks-only architecture)
- **Language:** TypeScript 5.6+ with rigid interfaces
- **Build Engine:** Vite
- **Routing:** TanStack Router (deep-linked URL query contracts)
- **UI Components:** Tailwind CSS, Radix UI Primitives, Lucide React
- **Geospatial Engine:** Leaflet.js with custom WGS84 GeoJSON multi-polygons & ArcGIS satellite tile layers
- **Analytics Visualization:** Recharts reactive telemetry suite

### Backend Services & AI Core
- **Framework:** FastAPI 0.115+ (Python 3.12, ASGI asynchronous event loop)
- **Server:** Uvicorn with auto-reload process workers
- **Data Contracts:** Pydantic v2 data models & validation
- **Hardware Acceleration:** Groq Language Processing Unit (LPU)
- **LLM Engine:** Llama 3.3 70B Versatile
- **Telemetry Gateway:** RESTful endpoints with mock fallbacks for network resilience

### Storage, Auth & Governance
- **Database:** Supabase PostgreSQL / Cloud SQL pool
- **Identity & RBAC:** Supabase Auth with JWT bearer contracts
- **Object Storage:** Supabase Storage with 300-second cryptographically signed URLs
- **Cryptographic Trust:** SHA-256 certificate hashing for DigiLocker credential validation

---

## 📋 Prerequisites

Ensure the following runtimes are installed on your workstation:
- **Node.js:** `v20.x` or higher
- **npm:** `v10.x` or higher
- **Python:** `v3.12.x`
- **Git:** Latest release

---

## 🚀 Quickstart

Run both backend and frontend services simultaneously in two terminals.

### 1. Repository Setup
```bash
git clone [https://github.com/](https://github.com/)<your-org>/jharsetu.git
cd jharsetu

2. Backend Initialization (Terminal 1)
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Linux / macOS:
# source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Launch FastAPI ASGI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Backend verification: Access the OpenAPI documentation at http://localhost:8000/docs.

3. Frontend Initialization (Terminal 2)
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Launch Vite development server
npm run dev
Frontend verification: Access the dashboard at http://localhost:5173.

🔐 Environment Configuration
Backend (backend/.env)
# Core Configuration
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173

# AI Inference Pipeline
GROQ_API_KEY=gsk_your_groq_lpu_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Cloud Storage & Governance
SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SIGNED_URL_EXPIRY_SECONDS=300

# Telephony Mock / Gateway Config
SMS_GATEWAY_SHORTCODE=56161
SMS_GATEWAY_WEBHOOK_SECRET=your_telephony_secret

Frontend (frontend/.env.local)
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
VITE_SUPABASE_ANON_KEY=your_anon_public_key

📡 API Specification
Core Telemetry & Triage Endpoints
1. Ingest Citizen Grievance (SMS / Voice Ingestion)
POST /api/v1/grievance/ingest
Content-Type: application/json

{
  "source_channel": "IVR_VOICE",
  "phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "raw_transcript": "हमर गांव कर चपाकल ले लाल पानी बहय, पिए से पेट दरद होवेला...",
  "detected_dialect": "Sadri",
  "cadastral_district": "Ranchi",
  "latitude": 23.3441,
  "longitude": 85.3096
}

2. Sub-Second AI Triage Pipeline
POST /api/v1/triage/normalize
Content-Type: application/json

{
  "raw_text": "हमर गांव कर चपाकल ले लाल पानी बहय...",
  "dialect": "Sadri"
}
Response (200 OK - ~380ms Latency):

{
  "status": "TRIAGED",
  "inference_latency_ms": 378,
  "ieee_problem_statement": "Autonomous Field-Scale Fluoride and Iron Filtration Unit for Rural Groundwater Supplies",
  "technical_domain": "Hydrology & Environmental Remediation",
  "urgency_rank": "HIGH",
  "target_kpi": "Reduce fluoride/iron ppm to WHO potable standards without continuous grid power",
  "inpass_novelty_score": 0.87,
  "mapped_ipc_classes": ["C02F 1/00", "B01D 35/00"]
}

3. Dual-Key Escrow Milestone Authorization
POST /api/v1/escrow/authorize-release
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "project_id": "JH-2026-CAP-0482",
  "milestone_index": 2,
  "tranche_amount_inr": 150000,
  "bdo_admin_key_hash": "a4f8...c1e9",
  "faculty_mentor_key_hash": "f2d3...e8a2",
  "field_inspection_media_ref": "supabase://audit-media/inspection_milestone_2.mp4"
}

🏛️ Statutory & Policy Frameworks
JharSetu is designed to fulfill statutory and institutional compliance mandates:

National Education Policy (NEP) 2020: Directly conforms to UGC/AICTE community engagement standards (NHEQF Level 7). Capstone defense automatically mints 6.0 Experiential Learning Credits to the national Academic Bank of Credits (ABC) / DigiLocker ecosystem.

Companies Act 2013 (Section 135 / Schedule VII): Provides complete statutory escrow custody for Corporate Social Responsibility (CSR) allocations toward university technology incubators, rural infrastructure, and clean water engineering.

Intellectual Property India (CGPDTM): Connects to the Indian Patent Advanced Search System (InPASS) to ensure student engineering outputs are checked against prior art and WIPO International Patent Classification (IPC) standards.

Survey of India Cadastral Geospatial Norms: Incorporates standardized WGS84 GeoJSON multi-polygons across all 24 administrative districts of Jharkhand.

👥 Authors & Acknowledgments
Team: [Your Registered Team Name]

Event: Smart India Hackathon (SIH) 2026

Problem Statement: Rural Infrastructure Telemetry, Vernacular Civic Ingestion & Capstone R&D Escrow

📄 License
This repository is distributed under the terms of the MIT License.
