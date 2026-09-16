from typing import List, Dict, Any

def generate_cluster_summary(complaint_group: List[Dict[str, Any]]) -> str:
    if not complaint_group:
        return "No complaints in group."

    count = len(complaint_group)
    category = complaint_group[0].get("category", "General")
    location = complaint_group[0].get("location_name") or "Campus/City Location"

    titles = [c.get("title", "") for c in complaint_group if c.get("title")]
    sample_title = titles[0] if titles else "issue"

    summary = (
        f"AI Cluster Summary: {count} user{'s' if count > 1 else ''} have reported similar issues regarding "
        f"'{sample_title}' located near {location} under the {category} department. "
        f"Common concerns relate to functional disruption and safety hazards. "
        f"Priority is classified as {complaint_group[0].get('priority', 'High')} with urgent resolution recommended."
    )
    return summary

def generate_ai_response(status: str, category: str, dept_name: str, title: str) -> str:
    if status == "In Progress":
        return (
            f"Dear Citizen, your complaint regarding '{title}' has been successfully assigned to the "
            f"{dept_name} Department. A maintenance officer has been dispatched to investigate and resolve the issue. "
            f"Expected resolution within SLA timeframe."
        )
    elif status == "Resolved":
        return (
            f"Good news! Your complaint regarding '{title}' has been resolved by the {dept_name} Department. "
            f"Please inspect the resolution and share your feedback rating on your dashboard."
        )
    elif status == "Rejected":
        return (
            f"Thank you for reaching out. Upon technical inspection by the {dept_name} Department, this submission "
            f"was determined to fall outside current department purview or is a duplicate case. "
            f"If you have further questions, please contact support."
        )
    else:
        return (
            f"Your complaint regarding '{title}' is currently registered with status '{status}' "
            f"under the {dept_name} Department and is awaiting technical review."
        )
