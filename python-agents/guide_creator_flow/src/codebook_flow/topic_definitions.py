from typing import Dict, List, TypedDict

class SubtopicDefinition(TypedDict):
    name: str
    hint: str

class TopicDefinition(TypedDict):
    subtopics: List[SubtopicDefinition]

TOPICS: Dict[str, TopicDefinition] = {
    "development_standards": {
        "subtopics": [
            {
                "name": "LOT REQUIREMENTS",
                "hint": "Look for sections discussing minimum lot sizes, lot width, lot coverage, and lot area requirements."
            },
            {
                "name": "BUILDING PLACEMENTS",
                "hint": "Search for setback requirements, building location restrictions, and yard requirements"
            },
            {
                "name": "BUILDING REQUIREMENTS",
                "hint": "Find sections about building height, floor area ratios, and building design standards"
            },
            {
                "name": "PARKING REQUIREMENTS",
                "hint": "Look for minimum parking spaces, parking lot design, and loading zone requirements"
            },
            {
                "name": "LIGHTING REQUIREMENTS",
                "hint": "Search for exterior lighting standards, light pollution controls, and illumination requirements"
            },
            {
                "name": "SIGNAGE REQUIREMENTS",
                "hint": "Find regulations about sign dimensions, placement, types, and restrictions"
            }
        ]
    }
}

def get_topic_subtopics(topic_name: str) -> List[SubtopicDefinition]:
    """Get all subtopics for a given topic."""
    return TOPICS.get(topic_name, {"subtopics": []})["subtopics"]

def get_subtopic_hint(topic_name: str, subtopic_name: str) -> str:
    """Get the hint for a specific subtopic within a topic."""
    subtopics = get_topic_subtopics(topic_name)
    for subtopic in subtopics:
        if subtopic["name"] == subtopic_name:
            return subtopic["hint"]
    return ""

def get_all_topics() -> List[str]:
    """Get a list of all available topics."""
    return list(TOPICS.keys()) 