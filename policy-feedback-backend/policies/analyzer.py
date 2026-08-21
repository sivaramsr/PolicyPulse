import os
import json
import google.generativeai as genai


def analyze_with_gemini(text: str) -> dict:
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or len(api_key) < 10:
        return None

    try:
        genai.configure(api_key=api_key)
        prompt = f"""You are an AI policy analyst for the Government of Tamil Nadu.
Analyze the following citizen comment and classify it into JSON format.

Comment: "{text}"

Return strictly valid JSON with these 3 fields:
- "sentiment": must be one of ["Positive", "Negative", "Mixed", "Neutral"]
- "issue": must be one of ["Affordability", "Safety & Quality", "Accessibility", "Resource Allocation", "General"]
- "why": a concise 1-sentence executive summary of the citizen's core reasoning.

Return ONLY the raw JSON object."""

        model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
        response = None
        for mname in model_names:
            try:
                model = genai.GenerativeModel(mname)
                response = model.generate_content(prompt)
                if response and response.text:
                    break
            except Exception:
                continue

        if not response or not response.text:
            return None

        res_text = response.text.strip()

        # Remove markdown code formatting if present
        if "```" in res_text:
            parts = res_text.split("```")
            res_text = parts[1] if len(parts) > 1 else parts[0]
            if res_text.startswith("json"):
                res_text = res_text[4:]

        data = json.loads(res_text.strip())

        if "sentiment" in data and "issue" in data and "why" in data:
            return {
                "sentiment": data["sentiment"],
                "issue": data["issue"],
                "why": data["why"]
            }
    except Exception as e:
        print(f"[Gemini AI Notice] API call unfulfilled: {e}. Using rule-based fallback engine.")

    return None


def analyze_comment(text: str) -> dict:
    # 1. Try Gemini AI API first
    gemini_res = analyze_with_gemini(text)
    if gemini_res:
        return gemini_res

    # 2. Fallback Rule-Based Engine
    t = text.lower().strip()

    # ── WHICH (Issue) ──────────────────────────────────────────────
    safety_keywords = [
        "hygiene", "hygienic", "clean", "quality", "prepare", "safety",
        "health", "safe", "dirty", "secure", "hacker", "hackers",
        "steal", "danger", "dangerous", "security"
    ]
    accessibility_keywords = [
        "shop", "district", "reach", "travel", "distance", "far",
        "crowd", "line", "enough", "capacity", "large", "place",
        "location", "router", "coverage", "signal", "zone", "parks"
    ]
    resource_keywords = [
        "spending", "funds", "budget", "tax", "focus", "scheme",
        "existing", "instead", "money", "allocation", "resource",
        "groundwater", "rain", "water", "harvesting"
    ]
    affordability_keywords = [
        "cheap", "student", "poor", "affordable", "price", "cost",
        "low-income", "free", "save money", "subsidies", "expensive"
    ]

    def has_safety(txt):
        for kw in safety_keywords:
            if kw == "fresh" and "fresh air" in txt:
                continue
            if kw in txt:
                return True
        return False

    if has_safety(t):
        issue = "Safety & Quality"
    elif any(kw in t for kw in resource_keywords):
        issue = "Resource Allocation"
    elif any(kw in t for kw in accessibility_keywords):
        issue = "Accessibility"
    elif any(kw in t for kw in affordability_keywords):
        issue = "Affordability"
    else:
        issue = "General"

    # ── WHAT (Sentiment) ───────────────────────────────────────────
    positive_keywords = [
        "great", "good", "help", "support", "excellent", "love",
        "fantastic", "agree", "benefit", "useful"
    ]
    negative_keywords = [
        "don't support", "disagree", "waste", "against", "should not",
        "not support", "instead of", "bad", "poor quality", "useless",
        "dangerous", "steal"
    ]

    has_positive = any(kw in t for kw in positive_keywords)
    has_negative = any(kw in t for kw in negative_keywords)

    if has_positive and has_negative:
        sentiment = "Mixed"
    elif has_negative:
        sentiment = "Negative"
    elif has_positive:
        sentiment = "Positive"
    else:
        sentiment = "Mixed" if issue in ("Safety & Quality", "Accessibility") else "Neutral"

    # ── WHY (Reasoning) ────────────────────────────────────────────
    if issue == "Safety & Quality":
        if any(kw in t for kw in ["wifi", "hacker", "secure", "data", "network"]):
            why = "Concern about network security, hacking, or data privacy"
        elif any(kw in t for kw in ["hygiene", "clean"]):
            why = "Concern about cleanliness and health standards"
        else:
            why = "Cheap price shouldn't lead to low food quality"

    elif issue == "Accessibility":
        if any(kw in t for kw in ["park", "zone", "router"]):
            why = "Wants wider Wi-Fi coverage across more park locations"
        elif any(kw in t for kw in ["enough", "capacity", "large"]):
            why = "One shop per district may not meet high demand"
        else:
            why = "Concern about travel distance to the facility"

    elif issue == "Resource Allocation":
        if any(kw in t for kw in ["groundwater", "water", "harvesting"]):
            why = "Wants to secure groundwater supplies for the future"
        elif any(kw in t for kw in ["existing", "scheme"]):
            why = "Wants government to focus on existing welfare schemes"
        else:
            why = "Believes public funds are better spent elsewhere"

    elif issue == "Affordability":
        if any(kw in t for kw in ["expensive", "subsidies", "subsidy"]):
            why = "Worry about installation cost; requests financial subsidies"
        elif any(kw in t for kw in ["student", "college"]):
            why = "Provides cheap options for students and workers"
        else:
            why = "Helps low-income citizens access resources"

    else:
        why = (text[:50] + "...") if len(text) > 50 else text

    return {"sentiment": sentiment, "issue": issue, "why": why}
