import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Tuple

def compute_similarity(target_text: str, candidate_texts: List[str]) -> List[float]:
    if not candidate_texts:
        return []

    documents = [target_text] + candidate_texts
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
        return cosine_sim[0].tolist()
    except Exception:
        # Fallback keyword overlap
        target_words = set(target_text.lower().split())
        scores = []
        for cand in candidate_texts:
            cand_words = set(cand.lower().split())
            if not cand_words:
                scores.append(0.0)
                continue
            intersection = target_words.intersection(cand_words)
            score = len(intersection) / float(len(target_words.union(cand_words)))
            scores.append(score)
        return scores


def find_duplicates_for_complaint(
    new_title: str,
    new_description: str,
    existing_complaints: List[Dict[str, Any]],
    threshold: float = 0.45
) -> List[Dict[str, Any]]:
    if not existing_complaints:
        return []

    target_text = f"{new_title} {new_description}"
    candidate_texts = [
        f"{c['title']} {c['description']}" for c in existing_complaints
    ]

    scores = compute_similarity(target_text, candidate_texts)
    matches = []

    for idx, score in enumerate(scores):
        if score >= threshold:
            match = existing_complaints[idx].copy()
            match["similarity_score"] = round(float(score), 3)
            matches.append(match)

    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches
