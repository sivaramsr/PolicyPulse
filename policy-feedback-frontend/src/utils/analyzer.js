/**
 * Dynamic Rule-Based AI Engine to analyze public policy feedback
 * Extracts: What (Sentiment), Which (Issue Discussed), and Why (Reasoning)
 */
export function analyzeComment(text) {
  const commentText = text.toLowerCase().trim();

  // 1. Identify "WHICH" (Issue Discussed)
  let issue = "General";
  
  // Renamed to Safety & Quality to support both food hygiene and network security
  const safetyKeywords = ["hygiene", "hygienic", "clean", "quality", "prepare", "safety", "health", "safe", "dirty", "fresh", "secure", "hacker", "hackers", "steal", "danger", "dangerous", "security"];
  const accessibilityKeywords = ["shop", "district", "reach", "travel", "distance", "far", "crowd", "line", "enough", "capacity", "large", "place", "location", "router", "coverage", "signal", "zone", "parks"];
  const resourceKeywords = ["spending", "funds", "budget", "tax", "focus", "scheme", "existing", "instead", "money", "allocation", "resource", "groundwater", "rain", "water", "harvesting"];
  const affordabilityKeywords = ["cheap", "student", "poor", "affordable", "price", "cost", "low-income", "help students", "every wednesday", "free", "save money", "subsidies", "expensive"];

  // Smart check: "fresh" is a safety keyword, unless it's "fresh air"
  const hasSafetyMatch = safetyKeywords.some(kw => {
    if (kw === "fresh" && commentText.includes("fresh air")) return false;
    return commentText.includes(kw);
  });

  if (hasSafetyMatch) {
    issue = "Safety & Quality";
  } else if (resourceKeywords.some(kw => commentText.includes(kw))) {
    issue = "Resource Allocation";
  } else if (accessibilityKeywords.some(kw => commentText.includes(kw))) {
    issue = "Accessibility";
  } else if (affordabilityKeywords.some(kw => commentText.includes(kw))) {
    issue = "Affordability";
  }

  // 2. Identify "WHAT" (Sentiment)
  let sentiment = "Neutral";
  
  const positiveKeywords = ["great", "good", "help", "support", "excellent", "love", "fantastic", "agree", "benefit", "useful"];
  const negativeKeywords = ["don't support", "disagree", "waste", "against", "should not", "not support", "instead of", "bad", "poor quality", "useless", "dangerous", "steal"];
  
  const hasPositive = positiveKeywords.some(kw => commentText.includes(kw));
  const hasNegative = negativeKeywords.some(kw => commentText.includes(kw));

  if (hasPositive && hasNegative) {
    sentiment = "Mixed";
  } else if (hasNegative) {
    sentiment = "Negative";
  } else if (hasPositive) {
    sentiment = "Positive";
  } else {
    // Fallback based on specific issues if neutral
    if (issue === "Safety & Quality" || issue === "Accessibility") {
      sentiment = "Mixed"; // Concerns are usually mixed/neutral
    }
  }

  // 3. Extract "WHY" (Reasoning)
  let why = "Needs further detail";

  if (issue === "Safety & Quality") {
    // Check if it's a Wi-Fi/cyber safety comment or food safety comment
    if (commentText.includes("wifi") || commentText.includes("hacker") || commentText.includes("secure") || commentText.includes("data")) {
      why = "Concern about network security, hacking, or data privacy";
    } else {
      why = commentText.includes("hygiene") || commentText.includes("clean") 
        ? "Concern about cleanliness and health standards"
        : "Cheap price shouldn't lead to low food quality";
    }
  } else if (issue === "Accessibility") {
    if (commentText.includes("park") || commentText.includes("zone") || commentText.includes("router")) {
      why = "Wants wider Wi-Fi coverage across more park locations";
    } else {
      why = commentText.includes("enough") || commentText.includes("capacity") || commentText.includes("large")
        ? "One shop per district may not meet high demand"
        : "Concern about travel distance to the shop";
    }
  } else if (issue === "Resource Allocation") {
    if (commentText.includes("groundwater") || commentText.includes("water") || commentText.includes("harvesting")) {
      why = "Wants to secure groundwater supplies for the future";
    } else {
      why = commentText.includes("existing") || commentText.includes("scheme")
        ? "Wants government to focus on existing welfare schemes"
        : "Believes public funds are better spent elsewhere";
    }
  } else if (issue === "Affordability") {
    if (commentText.includes("expensive") || commentText.includes("subsidy") || commentText.includes("subsidies")) {
      why = "Worry about installation cost; requests financial subsidies";
    } else {
      why = commentText.includes("student") || commentText.includes("college")
        ? "Provides cheap options for students and workers"
        : "Helps low-income citizens access resources";
    }
  } else {
    why = text.length > 50 ? text.substring(0, 50) + "..." : text;
  }

  return {
    sentiment,
    issue,
    why
  };
}