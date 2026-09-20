import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def synthesize_problem(raw_title: str, raw_desc: str, district: str) -> dict:
    """
    Transforms unstructured citizen grievances into formal, researchable
    engineering challenges aligned with NEP 2020 experiential learning tracks.
    """
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
    "domain": "Water Resources, Agriculture, Healthcare, Infrastructure, Rural Livelihood, or Other",
    "academic_summary": "Precise problem formulation and technical gap (2-3 sentences)",
    "suggested_deliverable": "Specific prototype or software system to be constructed by HEI students",
    "feasibility_score": integer between 1 and 100,
    "tags": "3-5 comma-separated domain tags"
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
        print(f"[Groq Error]: {exc}")
        return {
            "standardized_title": raw_title,
            "domain": "Other",
            "academic_summary": raw_desc,
            "suggested_deliverable": "Proof-of-Concept Prototype",
            "feasibility_score": 50,
            "tags": "jharkhand, societal-innovation"
        }