import re
from typing import Dict, Any

CATEGORY_KEYWORDS = {
    "Infrastructure": ["road", "pothole", "bridge", "building", "bench", "wall", "gate", "pathway", "construction", "sidewalk", "block"],
    "Electricity": ["light", "streetlight", "power", "wire", "spark", "electricity", "transformer", "dark", "bulb", "current", "outage"],
    "Water": ["pipe", "water", "leak", "drain", "sewage", "tap", "flood", "drinking water", "overflow", "plumbing", "tank"],
    "Cleanliness": ["trash", "garbage", "waste", "clean", "smell", "dirt", "dustbin", "litter", "sanitation", "dump"],
    "Transport": ["bus", "parking", "traffic", "shuttle", "vehicle", "scooter", "car", "stop", "ride", "transport"],
    "Academic": ["classroom", "projector", "lab", "library", "book", "exam", "course", "grade", "professor", "desk", "wifi", "internet"],
    "Security": ["theft", "stolen", "security", "guard", "camera", "cctv", "threat", "unsafe", "harassment", "lock", "suspicious"],
}

LOCATION_PATTERNS = [
    r"(?:near|at|around|behind|in front of|opposite|in|by)\s+([A-Z0-9][a-zA-Z0-9\s]{2,25}(?:Block|Building|Gate|Hall|Lab|Department|Campus|Hostel|Street|Road|Park|Area|Center|Complex|Library))",
    r"([A-Z0-9][a-zA-Z0-9\s]{2,20}(?:Block|Building|Gate|Hall|Lab|Hostel|Street|Road))",
    r"(Block\s+[A-Z0-9]+)",
    r"(Gate\s+[0-9]+)"
]

SENTIMENT_KEYWORDS = {
    "Negative": ["broken", "not working", "worst", "unacceptable", "dangerous", "urgent", "horrible", "damaged", "fail", "delay", "leaking", "stolen", "dirty", "smelly", "outage"],
    "Neutral": ["request", "inquiry", "issue", "notice", "observation", "update", "check"],
    "Positive": ["fixed", "improved", "thanks", "good", "great", "resolved"]
}

CATEGORY_TO_DEPT_CODE = {
    "Infrastructure": "CIVIL",
    "Electricity": "ELEC",
    "Water": "WATER",
    "Cleanliness": "SANITA",
    "Transport": "TRANS",
    "Academic": "ACAD",
    "Security": "SEC",
    "Other": "GEN"
}

def analyze_complaint_text(title: str, description: str) -> Dict[str, Any]:
    text = f"{title} {description}".lower()

    # 1. Category Classification
    category_scores = {cat: 0 for cat in CATEGORY_KEYWORDS}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                category_scores[cat] += text.count(kw)
    
    best_category = max(category_scores, key=category_scores.get)
    if category_scores[best_category] == 0:
        best_category = "Other"

    # 2. Priority Prediction
    priority = "Medium"
    critical_terms = ["danger", "spark", "fire", "theft", "harassment", "emergency", "flood", "high voltage", "collapse", "5 days", "10 days", "week"]
    high_terms = ["not working", "broken", "overflow", "blackout", "urgent", "leaking", "hazard", "darkness"]
    low_terms = ["request", "minor", "suggestion", "paint", "slow", "cosmetic"]

    if any(term in text for term in critical_terms):
        priority = "Critical"
    elif any(term in text for term in high_terms):
        priority = "High"
    elif any(term in text for term in low_terms):
        priority = "Low"

    # 3. Sentiment Analysis
    sentiment = "Negative"
    if any(kw in text for kw in SENTIMENT_KEYWORDS["Positive"]):
        sentiment = "Positive"
    elif any(kw in text for kw in SENTIMENT_KEYWORDS["Neutral"]) and not any(kw in text for kw in SENTIMENT_KEYWORDS["Negative"]):
        sentiment = "Neutral"

    # 4. Location Extraction
    extracted_location = None
    combined_raw = f"{title}. {description}"
    for pattern in LOCATION_PATTERNS:
        match = re.search(pattern, combined_raw, re.IGNORECASE)
        if match:
            extracted_location = match.group(1).strip()
            break
    if not extracted_location:
        if "block a" in text:
            extracted_location = "Block A"
        elif "block b" in text:
            extracted_location = "Block B"
        elif "main gate" in text:
            extracted_location = "Main Gate"
        elif "library" in text:
            extracted_location = "Central Library"
        else:
            extracted_location = "Campus Area"

    # 5. SLA Calculation
    sla_hours_map = {
        "Critical": 12,
        "High": 24,
        "Medium": 48,
        "Low": 72
    }
    sla_hours = sla_hours_map.get(priority, 48)

    dept_code = CATEGORY_TO_DEPT_CODE.get(best_category, "GEN")

    return {
        "category": best_category,
        "priority": priority,
        "suggested_department": dept_code,
        "extracted_location": extracted_location,
        "sentiment": sentiment,
        "sla_hours": sla_hours
    }
