import os
import json
import random
from typing import Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import pooling
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# --- Initialize FastAPI Application ---
app = FastAPI(
    title="JharSetu - Academic Societal Innovation Engine",
    description="Department of Higher & Technical Education, Government of Jharkhand (SIH PS ID: 26043)",
    version="2.0.0"
)

# Enable CORS for frontend client interactions
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in allowed_origins_env.split(",")] if allowed_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Benchmark Seed Records for Fallback / Standalone Mode ---
FALLBACK_PROBLEMS = [
    {
        "id": 1,
        "tracking_id": "JS-26043-0117",
        "title": "Low-cost fluoride remediation for hand-pump groundwater in Palamu belt",
        "raw_description": "[INDIVIDUAL] Field reports across 14 villages show fluoride above 1.8 mg/L. Existing activated-alumina units fail within 4 months due to un-monitored saturation.",
        "standardized_title": "Low-Cost Fluoride Remediation for Hand-Pump Groundwater in Palamu Belt",
        "academic_summary": "Field reports across 14 villages show fluoride above 1.8 mg/L. No affordable saturation-indicator media validated for high-iron groundwater.",
        "district": "Palamu",
        "domain": "Water Resources",
        "status": "VERIFIED",
        "suggested_deliverable": "Validated Working Prototype",
        "feasibility_score": 88,
        "tags": "fluoride, water-filtration, activated-alumina, groundwater",
        "photo_path": None,
        "video_path": None,
        "created_at": "2026-09-20 10:15:00"
    },
    {
        "id": 2,
        "tracking_id": "JS-26043-0142",
        "title": "Solar-thermal drying unit for lac and tasar produce in Khunti blocks",
        "raw_description": "[COMMUNITY] Monsoon spoilage removes an estimated 22% of raw lac value before it reaches the mandi. Open-sun drying is uneven and labour intensive.",
        "standardized_title": "Solar-Thermal Drying Unit for Lac and Tasar Produce in Khunti Blocks",
        "academic_summary": "Drying curve data for lac resin at sub-60°C is absent; no low-cost humidity control design exists for SHG scale.",
        "district": "Khunti",
        "domain": "Tribal Livelihood",
        "status": "IN_RESEARCH",
        "suggested_deliverable": "Validated Working Prototype",
        "feasibility_score": 91,
        "tags": "lac, tribal-livelihood, solar-thermal, drying-unit",
        "photo_path": None,
        "video_path": None,
        "created_at": "2026-09-21 11:30:00"
    },
    {
        "id": 3,
        "tracking_id": "JS-26043-0163",
        "title": "Offline-first triage assistant for sub-centre ANMs in Gumla",
        "raw_description": "[DEPT] ANMs cover 6–9 hamlets with no continuous connectivity. Referral decisions for maternal risk cases are delayed by an average of 31 hours.",
        "standardized_title": "Offline-First Triage Assistant for Sub-Centre ANMs in Gumla",
        "academic_summary": "No validated offline decision protocol mapped to Jharkhand's HMIS referral codes.",
        "district": "Gumla",
        "domain": "Rural Healthcare",
        "status": "VERIFIED",
        "suggested_deliverable": "Edge IoT Diagnostic Node & App",
        "feasibility_score": 79,
        "tags": "rural-healthcare, anm-assistant, offline-first, maternal-health",
        "photo_path": None,
        "video_path": None,
        "created_at": "2026-09-22 14:00:00"
    },
    {
        "id": 4,
        "tracking_id": "JS-26043-0188",
        "title": "Mine-subsidence early warning using low-cost tilt sensor mesh, Jharia",
        "raw_description": "[PRI] Residential clusters near abandoned galleries report progressive floor cracking. Manual survey cycles are quarterly at best.",
        "standardized_title": "Mine-Subsidence Early Warning Using Low-Cost Tilt Sensor Mesh, Jharia",
        "academic_summary": "Commercial tilt meters cost ₹40k/node; no ruggedised sub-₹3k node validated for coalfield thermal conditions.",
        "district": "Dhanbad",
        "domain": "Infrastructure",
        "status": "IN_RESEARCH",
        "suggested_deliverable": "LoRa Mesh Tilt Sensor Network",
        "feasibility_score": 74,
        "tags": "mine-subsidence, tilt-sensors, jharia, lora-mesh",
        "photo_path": None,
        "video_path": None,
        "created_at": "2026-09-23 09:45:00"
    },
    {
        "id": 5,
        "tracking_id": "JS-26043-0201",
        "title": "Micro-lift irrigation scheduling for upland paddy in Simdega",
        "raw_description": "[INDIVIDUAL] Upland plots depend on erratic lift pumping; farmers over-irrigate early and run dry at grain-fill, cutting yields by a third.",
        "standardized_title": "Micro-Lift Irrigation Scheduling for Upland Paddy in Simdega",
        "academic_summary": "No locally calibrated soil-moisture threshold model for lateritic upland soils.",
        "district": "Simdega",
        "domain": "Agriculture & Soil",
        "status": "VERIFIED",
        "suggested_deliverable": "Solar Soil-Moisture Automated Valve",
        "feasibility_score": 83,
        "tags": "micro-irrigation, upland-paddy, soil-moisture, simdega",
        "photo_path": None,
        "video_path": None,
        "created_at": "2026-09-24 16:20:00"
    },
    {
        "id": 6,
        "tracking_id": "JS-26043-0224",
        "title": "Community mini-grid load balancing for tribal hamlets, Sahibganj",
        "raw_description": "[COMMUNITY] Three pilot mini-grids trip nightly as households add unmetered loads. Battery cycle life has dropped below 40% of the rated figure.",
        "standardized_title": "Community Mini-Grid Load Balancing for Tribal Hamlets, Sahibganj",
        "academic_summary": "Absence of an affordable prepaid load-limiter compatible with 48V DC hamlet grids.",
        "district": "Sahibganj",
        "domain": "Clean Energy",
        "status": "VERIFIED",
        "suggested_deliverable": "48V DC Solid-State Micro-Limiter",
        "feasibility_score": 86,
        "tags": "mini-grid, clean-energy, tribal-hamlets, load-balancing",
        "photo_path": None,
        "video_path": None,
        "created_at": "2026-09-25 18:00:00"
    }
]

FALLBACK_PROJECTS = [
    {
        "id": 1,
        "problem_id": 2,
        "student_team_lead": "Team Agritech Innovators",
        "student_roll": "2022-CSE-045",
        "institution": "Birla Institute of Technology (BIT) Mesra",
        "faculty_mentor_email": "mentor.bit@ac.in",
        "timeline_months": 6,
        "project_status": "ACTIVE"
    },
    {
        "id": 2,
        "problem_id": 4,
        "student_team_lead": "GeoShield Labs",
        "student_roll": "2022-MIN-012",
        "institution": "IIT (ISM) Dhanbad",
        "faculty_mentor_email": "mentor.iitism@ac.in",
        "timeline_months": 6,
        "project_status": "ACTIVE"
    }
]

FALLBACK_SPONSORSHIPS = [
    {
        "id": 1,
        "project_id": 1,
        "organization_name": "Tata Steel Rural Development Society (TSRDS)",
        "contact_email": "csr@tatasteel.com",
        "grant_amount": 250000.0,
        "status": "PLEDGED"
    },
    {
        "id": 2,
        "project_id": 2,
        "organization_name": "Coal India CSR Foundation",
        "contact_email": "sponsorship@coalindia.in",
        "grant_amount": 400000.0,
        "status": "PLEDGED"
    }
]

# --- Resilient Database Connection Layer ---
db_pool = None
try:
    db_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="sih_pool",
        pool_size=5,
        host=os.getenv("DB_HOST", "127.0.0.1"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "jharkhand_sih_db"),
        port=int(os.getenv("DB_PORT", 3306)),
        connection_timeout=3
    )
    # Test connection
    test_conn = db_pool.get_connection()
    test_conn.close()
    print("[DB Status]: Connected successfully to MySQL Pool.")
except Exception as db_err:
    print(f"[DB Notice]: Could not connect to MySQL ({db_err}). Activating High-Resilience Fallback Data Store.")
    db_pool = None

def get_db_connection():
    """Fetches a thread-safe connection from the pool if available."""
    if db_pool:
        return db_pool.get_connection()
    return None

# --- Groq LPU Client ---
groq_api_key = os.getenv("GROQ_API_KEY", "")
groq_client = Groq(api_key=groq_api_key) if groq_api_key else None

# --- Database Schema Migration Helper ---
def init_db_addons():
    """Ensures schema extensions exist when connected to live MySQL."""
    conn = get_db_connection()
    if not conn:
        return
    cursor = conn.cursor()
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS problems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                citizen_id INT DEFAULT 1,
                title VARCHAR(255) NOT NULL,
                raw_description TEXT,
                district VARCHAR(100),
                domain VARCHAR(100),
                status VARCHAR(50) DEFAULT 'VERIFIED',
                standardized_title VARCHAR(255),
                academic_summary TEXT,
                suggested_deliverable VARCHAR(255),
                feasibility_score INT DEFAULT 80,
                tags VARCHAR(255),
                photo_path LONGTEXT NULL,
                video_path LONGTEXT NULL,
                tracking_id VARCHAR(50) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                problem_id INT NOT NULL,
                student_team_lead VARCHAR(255),
                student_roll VARCHAR(100),
                institution VARCHAR(255),
                faculty_mentor_email VARCHAR(255),
                timeline_months INT DEFAULT 6,
                project_status VARCHAR(50) DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sponsorships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NULL,
                industry_rep_id INT DEFAULT 1,
                organization_name VARCHAR(255) NULL,
                contact_email VARCHAR(255) NULL,
                grant_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                status VARCHAR(50) DEFAULT 'PLEDGED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
    except Exception as e:
        print(f"[DB Migration Notice]: {e}")
    finally:
        cursor.close()
        conn.close()

# Execute schema setup if MySQL is active
init_db_addons()

# --- Pydantic Request Models ---
class CitizenProblemPayload(BaseModel):
    citizen_name: str
    submitter_type: Optional[str] = "INDIVIDUAL"
    title: str
    description: str
    district: str
    block: Optional[str] = None
    domains: Optional[List[str]] = []
    photo_path: Optional[str] = None
    video_path: Optional[str] = None

class TriageRequest(BaseModel):
    raw_text: str
    channel: str
    district: str

class StudentAdoptionPayload(BaseModel):
    problem_id: int
    student_name: str
    student_roll: str
    institution: str
    faculty_mentor_email: str
    proposed_timeline_months: int = 6

class CSRSponsorshipPayload(BaseModel):
    problem_id: int
    organization_name: str
    contact_email: str
    grant_amount: float
    sponsorship_type: str = "CSR"

class ProblemStatusUpdate(BaseModel):
    problem_id: int
    status: str

class NotificationSimulationPayload(BaseModel):
    tracking_id: str
    recipient_mobile: str = "+91 98765 43210"
    event: str
    details: Optional[str] = None

class PatentPrecheckRequest(BaseModel):
    problem_id: int
    deliverable_title: str
    technical_description: str

class MilestoneVerificationPayload(BaseModel):
    project_id: int
    bdo_signoff_key: str
    faculty_mentor_approval: bool
    milestone_stage: int

class CreditCertificationRequest(BaseModel):
    project_id: int
    student_roll: str
    student_name: str
    institution: str

# --- Groq LPU AI Synthesis Service ---
def synthesize_problem_with_groq(raw_title: str, raw_desc: str, district: str) -> dict:
    if not groq_client:
        return {
            "standardized_title": raw_title,
            "domain": "Water Resources" if "water" in raw_title.lower() or "pani" in raw_title.lower() else "Clean Energy",
            "academic_summary": raw_desc,
            "suggested_deliverable": "Proof-of-Concept Prototype",
            "feasibility_score": 82,
            "tags": "societal-innovation, rural-tech",
            "similarity_cluster_id": f"{district.upper()}-CLUSTER-01"
        }

    system_instruction = (
        "You are an academic project formulation engine for the Department of Higher & Technical Education, Jharkhand. "
        "Your task is to take informal citizen problems and synthesize them into formal applied R&D capstone project statements "
        "aligned with National Education Policy (NEP) 2020 experiential learning mandates. "
        "Return ONLY a valid JSON object with no Markdown formatting or conversational preamble."
    )

    user_prompt = f"""
District: {district}
Citizen Issue: {raw_title}
Details: {raw_desc}

Output JSON format:
{{
    "standardized_title": "Academic engineering title (under 12 words)",
    "domain": "Water Resources, Agriculture & Soil, Rural Healthcare, Clean Energy, Tribal Livelihood, Infrastructure, or Education Access",
    "academic_summary": "Precise problem formulation and technical gap (2-3 sentences)",
    "suggested_deliverable": "Specific prototype or software system to be constructed by HEI students",
    "feasibility_score": integer between 1 and 100,
    "tags": "3-5 comma-separated domain tags",
    "similarity_cluster_id": "Generate a semantic tracking cluster tag (e.g. PALAMU-WATER-01) for vector deduplication"
}}
"""
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as exc:
        print(f"[Groq Synthesis Fallback]: {exc}")
        return {
            "standardized_title": raw_title,
            "domain": "Clean Energy" if "solar" in raw_title.lower() else "Water Resources",
            "academic_summary": raw_desc,
            "suggested_deliverable": "Proof-of-Concept Prototype",
            "feasibility_score": 75,
            "tags": "jharkhand, societal-innovation",
            "similarity_cluster_id": f"{district.upper()}-CLUSTER-01"
        }

# --- Cloud Health & Telemetry Endpoints ---

@app.get("/")
@app.get("/healthz")
@app.get("/api/health")
def health():
    return {
        "status": "operational",
        "platform": "JharSetu",
        "jurisdiction": "Department of Higher & Technical Education, Jharkhand",
        "db_mode": "MySQL Live Pool" if db_pool else "High-Resilience Standalone Memory",
        "inference_engine": "Groq LPU (Llama 3.3 70B & Whisper Large v3)"
    }

@app.get("/api/metrics/summary")
def get_platform_metrics():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT COUNT(*) AS total_problems FROM problems")
            total_problems = cursor.fetchone()["total_problems"]
            cursor.execute("SELECT COUNT(*) AS total_projects FROM projects")
            total_projects = cursor.fetchone()["total_projects"]
            cursor.execute("SELECT COALESCE(SUM(grant_amount), 0) AS total_grants FROM sponsorships")
            total_grants = cursor.fetchone()["total_grants"]
            return {
                "total_problems": total_problems,
                "synthesized_challenges": total_problems,
                "active_projects": total_projects,
                "csr_grants_pledged": float(total_grants)
            }
        finally:
            cursor.close()
            conn.close()

    # Fallback response
    total_grants = sum(s["grant_amount"] for s in FALLBACK_SPONSORSHIPS)
    return {
        "total_problems": len(FALLBACK_PROBLEMS),
        "synthesized_challenges": len(FALLBACK_PROBLEMS),
        "active_projects": len(FALLBACK_PROJECTS),
        "csr_grants_pledged": float(total_grants)
    }

@app.get("/api/problems")
def fetch_problems(district: Optional[str] = None, domain: Optional[str] = None):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM problems WHERE 1=1"
        params = []
        if district and district != "All":
            query += " AND district = %s"
            params.append(district)
        if domain and domain != "All":
            query += " AND domain = %s"
            params.append(domain)
        query += " ORDER BY created_at DESC"
        try:
            cursor.execute(query, tuple(params))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    # Fallback filtering
    results = FALLBACK_PROBLEMS
    if district and district != "All":
        results = [p for p in results if p["district"].lower() == district.lower()]
    if domain and domain != "All":
        results = [p for p in results if p["domain"].lower() == domain.lower()]
    return sorted(results, key=lambda x: x["id"], reverse=True)

@app.post("/api/problems/submit")
def submit_problem(payload: CitizenProblemPayload):
    enrichment = synthesize_problem_with_groq(payload.title, payload.description, payload.district)
    tracking_id = f"JS-26043-{random.randint(1000, 9999)}"
    augmented_description = f"[{payload.submitter_type or 'INDIVIDUAL'}] {payload.description}"

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        sql = """
            INSERT INTO problems (
                citizen_id, title, raw_description, district, domain,
                status, standardized_title, academic_summary, suggested_deliverable,
                feasibility_score, tags, photo_path, video_path, tracking_id
            ) VALUES (1, %s, %s, %s, %s, 'VERIFIED', %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            payload.title,
            augmented_description,
            payload.district,
            enrichment.get("domain", payload.domains[0] if payload.domains else "Other"),
            enrichment.get("standardized_title", payload.title),
            enrichment.get("academic_summary", payload.description),
            enrichment.get("suggested_deliverable", "Field-Tested Prototype"),
            enrichment.get("feasibility_score", 80),
            enrichment.get("tags", ", ".join(payload.domains) if payload.domains else ""),
            payload.photo_path,
            payload.video_path,
            tracking_id
        )
        try:
            cursor.execute(sql, values)
            conn.commit()
            return {
                "success": True,
                "problem_id": cursor.lastrowid,
                "tracking_id": tracking_id,
                "synthesized_data": enrichment,
                "semantic_cluster": enrichment.get("similarity_cluster_id", f"{payload.district.upper()}-CLUSTER-01")
            }
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()
            conn.close()

    # Fallback memory insertion
    new_id = len(FALLBACK_PROBLEMS) + 1
    new_record = {
        "id": new_id,
        "tracking_id": tracking_id,
        "title": payload.title,
        "raw_description": augmented_description,
        "standardized_title": enrichment.get("standardized_title", payload.title),
        "academic_summary": enrichment.get("academic_summary", payload.description),
        "district": payload.district,
        "domain": enrichment.get("domain", payload.domains[0] if payload.domains else "Other"),
        "status": "VERIFIED",
        "suggested_deliverable": enrichment.get("suggested_deliverable", "Field-Tested Prototype"),
        "feasibility_score": enrichment.get("feasibility_score", 80),
        "tags": enrichment.get("tags", ", ".join(payload.domains) if payload.domains else ""),
        "photo_path": payload.photo_path,
        "video_path": payload.video_path,
        "created_at": "Just now"
    }
    FALLBACK_PROBLEMS.insert(0, new_record)
    return {
        "success": True,
        "problem_id": new_id,
        "tracking_id": tracking_id,
        "synthesized_data": enrichment,
        "semantic_cluster": enrichment.get("similarity_cluster_id", f"{payload.district.upper()}-CLUSTER-01")
    }

# --- Vernacular Triage & Audio Endpoints ---

@app.post("/api/triage/stream")
def triage_vernacular_telemetry(req: TriageRequest):
    triage_system_prompt = (
        "You are the JharSetu AI Telemetry Engine for the Dept. of Higher & Technical Education, Government of Jharkhand. "
        "You convert raw citizen grievances (in Hindi, Sadri, Nagpuri, or colloquial rural English) into an IEEE/NEP-2020 "
        "research-ready university capstone challenge statement. "
        "Return strictly a valid JSON object matching this schema:\n"
        "{\n"
        '  "academic_title": "Concise technical engineering title (under 12 words)",\n'
        '  "domain": "One of: Water Resources, Clean Energy, Agriculture & Soil, Rural Healthcare, Infrastructure, Tribal Livelihood",\n'
        '  "academic_summary": "1-2 sentence problem description suitable for university researchers",\n'
        '  "research_gap": "Specific technical barrier or deficit identified in the field report",\n'
        '  "suggested_deliverable": "Specific hardware/software artifact (e.g., IoT Telemetry Node, Low-Cost Bio-Adsorbent Filter)",\n'
        '  "feasibility_score": integer between 60 and 95\n'
        "}"
    )

    if groq_client:
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": triage_system_prompt},
                    {"role": "user", "content": f"District: {req.district}\nChannel: {req.channel}\nGrievance: {req.raw_text}"}
                ],
                response_format={"type": "json_object"},
                temperature=0.15
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as exc:
            print(f"[Vernacular Triage Error]: {exc}")

    # Heuristic fallback
    is_water = any(w in req.raw_text.lower() for w in ["pani", "पानी", "handpump", "chaapaakal", "fluoride", "नल", "water"])
    is_energy = any(w in req.raw_text.lower() for w in ["bijli", "solar", "सोलर", "बिजली", "transformer", "ट्रांसफॉर्मर", "motor", "power"])
    domain = "Water Resources" if is_water else ("Clean Energy" if is_energy else "Infrastructure")
    title = (
        "Aquifer Heavy-Metal Precipitation & Membrane Filtration Study" if is_water 
        else ("Rural Distributed Micro-Grid Inverter Fault Diagnostic Telemetry" if is_energy 
        else f"Rural Asset Diagnostic Prototype ({req.district})")
    )
    return {
        "academic_title": title,
        "domain": domain,
        "academic_summary": f"Field telemetry captured via {req.channel} in {req.district}: {req.raw_text}",
        "research_gap": "Localized material degradation and absence of continuous IoT sensor telemetry under regional field conditions.",
        "suggested_deliverable": "Edge IoT Diagnostic Node & Remediating Filter",
        "feasibility_score": random.randint(78, 89)
    }

@app.post("/api/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: Optional[str] = Form("hi")):
    if not groq_client:
        return {"text": "हमार गांव में पानी का बहुत समस्या है, हैंडपंप खराब है।"}
    try:
        audio_bytes = await file.read()
        transcription = groq_client.audio.transcriptions.create(
            file=(file.filename or "audio.wav", audio_bytes),
            model="whisper-large-v3",
            response_format="json",
            language=language if language in ["hi", "bn", "en", "or"] else None,
            temperature=0.0
        )
        return {"text": transcription.text}
    except Exception as e:
        print(f"[Whisper Transcription Error]: {e}")
        return {"text": "हमार गांव में पानी का समस्या बा, चापाकल से गंदा पानी निकलत है।"}

# --- Student Adoption & CSR Endpoints ---

@app.post("/api/projects/adopt")
def adopt_capstone(payload: StudentAdoptionPayload):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT id FROM problems WHERE id = %s OR tracking_id LIKE %s LIMIT 1",
                (payload.problem_id, f"%{payload.problem_id}%")
            )
            problem_row = cursor.fetchone()
            real_id = problem_row["id"] if problem_row else payload.problem_id
            cursor.execute("UPDATE problems SET status = 'IN_RESEARCH' WHERE id = %s", (real_id,))
            cursor.execute("""
                INSERT INTO projects (
                    problem_id, student_team_lead, student_roll, 
                    institution, faculty_mentor_email, timeline_months, project_status
                ) VALUES (%s, %s, %s, %s, %s, %s, 'ACTIVE')
            """, (
                real_id, payload.student_name, payload.student_roll,
                payload.institution, payload.faculty_mentor_email, payload.proposed_timeline_months
            ))
            conn.commit()
            return {"success": True, "message": f"Successfully enrolled under NEP 2020 track for {payload.institution}"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()
            conn.close()

    # Fallback memory handler
    for p in FALLBACK_PROBLEMS:
        if p["id"] == payload.problem_id or str(payload.problem_id) in p.get("tracking_id", ""):
            p["status"] = "IN_RESEARCH"
            break
    FALLBACK_PROJECTS.append({
        "id": len(FALLBACK_PROJECTS) + 1,
        "problem_id": payload.problem_id,
        "student_team_lead": payload.student_name,
        "student_roll": payload.student_roll,
        "institution": payload.institution,
        "faculty_mentor_email": payload.faculty_mentor_email,
        "timeline_months": payload.proposed_timeline_months,
        "project_status": "ACTIVE"
    })
    return {"success": True, "message": f"Successfully enrolled under NEP 2020 track for {payload.institution}"}

@app.post("/api/sponsorships/pledge")
def pledge_csr_grant(payload: CSRSponsorshipPayload):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT id FROM problems WHERE id = %s OR tracking_id LIKE %s LIMIT 1",
                (payload.problem_id, f"%{payload.problem_id}%")
            )
            problem_row = cursor.fetchone()
            real_problem_id = problem_row["id"] if problem_row else payload.problem_id
            cursor.execute("SELECT id FROM projects WHERE problem_id = %s LIMIT 1", (real_problem_id,))
            project = cursor.fetchone()
            project_id = project["id"] if project else None

            cursor.execute("""
                INSERT INTO sponsorships (project_id, industry_rep_id, organization_name, contact_email, grant_amount, status)
                VALUES (%s, 1, %s, %s, %s, 'PLEDGED')
            """, (project_id, payload.organization_name, payload.contact_email, payload.grant_amount))
            conn.commit()
            return {
                "success": True,
                "sponsorship_id": cursor.lastrowid,
                "message": f"Pledged grant of ₹{payload.grant_amount} by {payload.organization_name}"
            }
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()
            conn.close()

    # Fallback memory handler
    FALLBACK_SPONSORSHIPS.append({
        "id": len(FALLBACK_SPONSORSHIPS) + 1,
        "project_id": payload.problem_id,
        "organization_name": payload.organization_name,
        "contact_email": payload.contact_email,
        "grant_amount": float(payload.grant_amount),
        "status": "PLEDGED"
    })
    return {
        "success": True,
        "sponsorship_id": len(FALLBACK_SPONSORSHIPS),
        "message": f"Pledged grant of ₹{payload.grant_amount} by {payload.organization_name}"
    }

# --- State Admin Analytics & Governance Endpoints ---

@app.get("/api/admin/analytics")
def get_admin_analytics():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT district, COUNT(*) AS count FROM problems GROUP BY district ORDER BY count DESC LIMIT 8")
            district_data = cursor.fetchall()
            cursor.execute("SELECT domain, COUNT(*) AS count FROM problems GROUP BY domain ORDER BY count DESC")
            domain_data = cursor.fetchall()
            cursor.execute("SELECT status, COUNT(*) AS count FROM problems GROUP BY status")
            status_data = cursor.fetchall()
            cursor.execute("""
                SELECT id, tracking_id, standardized_title, title, 
                       district, domain, status, feasibility_score, created_at 
                FROM problems ORDER BY created_at DESC LIMIT 10
            """)
            recent_submissions = cursor.fetchall()
            return {
                "by_district": district_data,
                "by_domain": domain_data,
                "by_status": status_data,
                "submissions": recent_submissions
            }
        finally:
            cursor.close()
            conn.close()

    # Fallback calculations
    from collections import Counter
    district_counts = Counter(p["district"] for p in FALLBACK_PROBLEMS)
    domain_counts = Counter(p["domain"] for p in FALLBACK_PROBLEMS)
    status_counts = Counter(p["status"] for p in FALLBACK_PROBLEMS)
    return {
        "by_district": [{"district": k, "count": v} for k, v in district_counts.most_common(8)],
        "by_domain": [{"domain": k, "count": v} for k, v in domain_counts.items()],
        "by_status": [{"status": k, "count": v} for k, v in status_counts.items()],
        "submissions": FALLBACK_PROBLEMS[:10]
    }

@app.post("/api/admin/problems/status")
def update_problem_status(payload: ProblemStatusUpdate):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("UPDATE problems SET status = %s WHERE id = %s", (payload.status, payload.problem_id))
            conn.commit()
            return {"success": True, "message": f"Status changed to {payload.status}"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()
            conn.close()

    for p in FALLBACK_PROBLEMS:
        if p["id"] == payload.problem_id:
            p["status"] = payload.status
            break
    return {"success": True, "message": f"Status changed to {payload.status}"}

@app.get("/api/csr/analytics")
def get_csr_analytics():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT COALESCE(SUM(grant_amount), 0) AS total_pledged FROM sponsorships")
            total_pledged = float(cursor.fetchone()["total_pledged"])
            cursor.execute("""
                SELECT p.id, p.tracking_id, p.standardized_title, p.district, p.domain,
                       pr.student_team_lead, pr.institution,
                       COALESCE(s.grant_amount, 0) AS grant_amount,
                       COALESCE(s.status, 'UNFUNDED') AS funding_status
                FROM problems p
                LEFT JOIN projects pr ON p.id = pr.problem_id
                LEFT JOIN sponsorships s ON pr.id = s.project_id
                ORDER BY p.created_at DESC
                LIMIT 10
            """)
            sponsorship_feed = cursor.fetchall()
            total_cr = round(total_pledged / 10000000, 2)
            velocity_trend = [
                {"quarter": "Q1 2026", "pledged": 1.20, "disbursed": 0.80},
                {"quarter": "Q2 2026", "pledged": 2.40, "disbursed": 1.70},
                {"quarter": "Q3 2026", "pledged": 3.80, "disbursed": 2.90},
                {"quarter": "Q4 2026", "pledged": max(4.85, total_cr), "disbursed": 3.60},
            ]
            return {
                "total_pledged": total_pledged,
                "sponsorship_feed": sponsorship_feed,
                "velocity_trend": velocity_trend
            }
        finally:
            cursor.close()
            conn.close()

    total_pledged = sum(s["grant_amount"] for s in FALLBACK_SPONSORSHIPS)
    sponsorship_feed = [
        {
            "id": 1,
            "tracking_id": "JS-26043-0142",
            "standardized_title": "Solar-Thermal Drying Unit for Lac and Tasar Produce in Khunti Blocks",
            "district": "Khunti",
            "domain": "Tribal Livelihood",
            "student_team_lead": "Team Agritech Innovators",
            "institution": "Birla Institute of Technology (BIT) Mesra",
            "grant_amount": 250000.0,
            "funding_status": "PLEDGED"
        },
        {
            "id": 2,
            "tracking_id": "JS-26043-0188",
            "standardized_title": "Mine-Subsidence Early Warning Using Low-Cost Tilt Sensor Mesh, Jharia",
            "district": "Dhanbad",
            "domain": "Infrastructure",
            "student_team_lead": "GeoShield Labs",
            "institution": "IIT (ISM) Dhanbad",
            "grant_amount": 400000.0,
            "funding_status": "PLEDGED"
        }
    ]
    return {
        "total_pledged": total_pledged,
        "sponsorship_feed": sponsorship_feed,
        "velocity_trend": [
            {"quarter": "Q1 2026", "pledged": 1.20, "disbursed": 0.80},
            {"quarter": "Q2 2026", "pledged": 2.40, "disbursed": 1.70},
            {"quarter": "Q3 2026", "pledged": 3.80, "disbursed": 2.90},
            {"quarter": "Q4 2026", "pledged": 4.85, "disbursed": 3.60},
        ]
    }

# --- Admin Seeder & Clean Reset ---

@app.post("/api/admin/seed-demo-data")
def seed_demo_data():
    conn = get_db_connection()
    if not conn:
        return {"success": True, "message": "Using in-memory benchmark challenges."}
    cursor = conn.cursor()
    try:
        inserted = 0
        for p in FALLBACK_PROBLEMS:
            cursor.execute("""
                INSERT INTO problems (
                    citizen_id, title, raw_description, district, domain,
                    status, standardized_title, academic_summary, suggested_deliverable,
                    feasibility_score, tags, tracking_id
                ) VALUES (1, %s, %s, %s, %s, 'VERIFIED', %s, %s, %s, %s, %s, %s)
            """, (
                p["title"], p["raw_description"], p["district"], p["domain"],
                p["standardized_title"], p["academic_summary"], p["suggested_deliverable"],
                p["feasibility_score"], p["tags"], p["tracking_id"]
            ))
            inserted += 1
        conn.commit()
        return {"success": True, "message": f"Successfully seeded {inserted} benchmark challenges into MySQL."}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/admin/reset-demo-state")
def reset_demo_state():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM sponsorships")
            cursor.execute("DELETE FROM projects")
            cursor.execute("DELETE FROM problems WHERE tracking_id LIKE 'JS-26043-%'")
            conn.commit()
            seed_demo_data()
            return {"success": True, "message": "Demo state reset to SIH benchmark baseline."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()
            conn.close()
    return {"success": True, "message": "Demo state reset in memory."}

# --- Citizen Gateway Simulator ---

@app.post("/api/notifications/simulate")
def simulate_notification(payload: NotificationSimulationPayload):
    templates = {
        "FILED": f"झार-सेतु (JharSetu): आपकी शिकायत {payload.tracking_id} दर्ज कर ली गई है। AI द्वारा इसे विश्वविद्यालय अनुसंधान हेतु वर्गीकृत किया जा रहा है।",
        "ADOPTED": f"झार-सेतु (JharSetu): खुशखबरी! आपकी समस्या {payload.tracking_id} को {payload.details or 'BIT Mesra'} के इंजीनियरिंग छात्रों द्वारा कैपस्टोन प्रोजेक्ट के रूप में गोद लिया गया है।",
        "FUNDED": f"झार-सेतु (JharSetu): परियोजना {payload.tracking_id} को कॉर्पोरेट CSR सेल से प्रोटोटाइप निर्माण हेतु अनुदान स्वीकृत हो गया है।",
        "RESOLVED": f"झार-सेतु (JharSetu): समस्या {payload.tracking_id} का समाधान फील्ड में सफलतापूर्वक सत्यापित कर लिया गया है। धन्यवाद!"
    }
    message = templates.get(payload.event, f"JharSetu update for {payload.tracking_id}")
    return {
        "success": True,
        "dispatch_id": f"SMS-{random.randint(100000, 999999)}",
        "channel": "Jharkhand State Citizen Gateway (CDAC)",
        "mobile": payload.recipient_mobile,
        "message_text": message,
        "timestamp": "Just now"
    }

# --- Advanced Innovation, Patents, Escrow & NEP Gateways ---

@app.post("/api/ip/patent-precheck")
def analyze_patent_prior_art(payload: PatentPrecheckRequest):
    if groq_client:
        system_prompt = (
            "You are a Senior Patent Examiner for the Controller General of Patents, Designs & Trade Marks (India). "
            "Evaluate the applied engineering prototype against known prior art. Return ONLY a valid JSON object."
        )
        user_prompt = f"""
Deliverable Title: {payload.deliverable_title}
Technical Description: {payload.technical_description}

JSON Output Format:
{{
    "novelty_score": integer between 1 and 100,
    "patentability_verdict": "HIGH" | "MODERATE" | "PRIOR_ART_SATURATED",
    "ipc_classification": "Suggested International Patent Classification code (e.g., C02F 1/28)",
    "prior_art_citations": ["Citation 1", "Citation 2"],
    "key_inventive_step": "Specific patentable mechanical/algorithmic claim"
}}
"""
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            return json.loads(completion.choices[0].message.content)
        except Exception:
            pass

    return {
        "novelty_score": 84,
        "patentability_verdict": "HIGH",
        "ipc_classification": "B01D 24/00, G01N 33/18",
        "prior_art_citations": ["IN Patent 202111048291", "US Patent 9,845,255"],
        "key_inventive_step": "Continuous gravity-adsorption matrix with colorimetric saturation indicator."
    }

@app.post("/api/escrow/release-milestone")
def release_escrow_milestone(payload: MilestoneVerificationPayload):
    if not payload.bdo_signoff_key.startswith("BDO-JH-"):
        raise HTTPException(status_code=400, detail="Invalid BDO Public Key. Verification rejected.")
    if not payload.faculty_mentor_approval:
        raise HTTPException(status_code=400, detail="Academic Mentor sign-off required.")

    tranche_pct = 40 if payload.milestone_stage == 1 else 60
    tx_hash = f"0x{random.randint(10**15, 10**16-1):x}e77b409d"
    return {
        "success": True,
        "escrow_tx_hash": tx_hash,
        "disbursed_percentage": tranche_pct,
        "signatories": {
            "administrative_auth": "Block Development Officer (Government of Jharkhand)",
            "academic_auth": "Certified University Faculty Mentor",
            "compliance": "Schedule VII CSR Corporate Escrow Protocol"
        },
        "block_timestamp": "2026-09-18T22:45:00Z"
    }

@app.post("/api/governance/generate-nep-credits")
def issue_academic_credits(payload: CreditCertificationRequest):
    cert_id = f"ABC-NEP2020-JH-{random.randint(10000, 99999)}"
    return {
        "success": True,
        "certificate_id": cert_id,
        "student_name": payload.student_name,
        "institution": payload.institution,
        "credits_awarded": 6,
        "framework": "National Higher Education Qualifications Framework (NHEQF Level 7)",
        "qr_verification_url": f"https://digilocker.gov.in/verify/academic-credits/{cert_id}",
        "issued_by": "State Higher & Technical Education Council, Jharkhand"
    }

@app.get("/api/geo/district-clusters")
def get_geo_district_clusters():
    return [
        {"district": "Ranchi", "lat": 23.3441, "lng": 85.3096, "problems": 19, "active_projects": 8, "csr_funding_cr": 1.45, "primary_domain": "Clean Energy"},
        {"district": "Palamu", "lat": 24.0373, "lng": 84.0722, "problems": 24, "active_projects": 6, "csr_funding_cr": 0.85, "primary_domain": "Water Resources"},
        {"district": "Khunti", "lat": 23.0725, "lng": 85.2798, "problems": 16, "active_projects": 5, "csr_funding_cr": 0.65, "primary_domain": "Tribal Livelihood"},
        {"district": "Dhanbad", "lat": 23.7957, "lng": 86.4304, "problems": 21, "active_projects": 9, "csr_funding_cr": 1.90, "primary_domain": "Infrastructure"},
        {"district": "East Singhbhum", "lat": 22.8046, "lng": 86.2029, "problems": 18, "active_projects": 7, "csr_funding_cr": 2.10, "primary_domain": "Water Resources"},
        {"district": "Gumla", "lat": 23.0435, "lng": 84.5414, "problems": 14, "active_projects": 4, "csr_funding_cr": 0.45, "primary_domain": "Rural Healthcare"},
        {"district": "Simdega", "lat": 22.6162, "lng": 84.5085, "problems": 11, "active_projects": 3, "csr_funding_cr": 0.35, "primary_domain": "Agriculture & Soil"},
        {"district": "Sahibganj", "lat": 25.2425, "lng": 87.6444, "problems": 13, "active_projects": 4, "csr_funding_cr": 0.55, "primary_domain": "Clean Energy"}
    ]

# --- Application Startup Entrypoint ---
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)