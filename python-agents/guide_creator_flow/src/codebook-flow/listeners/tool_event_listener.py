from crewai.utilities.events import (
    ToolUsageFinishedEvent
)
from crewai.utilities.events.base_event_listener import BaseEventListener
# from evals.table_of_contents_extraction import TableOfContentsExtractionEval

class ToolEventListener(BaseEventListener):
    def __init__(self):
        super().__init__()
    
    def setup_listeners(self, crewai_event_bus):
        @crewai_event_bus.on(ToolUsageFinishedEvent)
        def on_tool_usage_finished(source, event):
            print(f"Tool '{event.tool_name}' completed task")
            print(f"Tool event: {event}")
            # cannot access output here, need to access it from the tool itself