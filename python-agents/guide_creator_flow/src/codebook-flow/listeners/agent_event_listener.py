from crewai.utilities.events import (
    AgentExecutionCompletedEvent
)
from crewai.utilities.events.base_event_listener import BaseEventListener
from evals.municipal_code_extraction import MunicipalCodeExtractionEval

class AgentEventListener(BaseEventListener):
    def __init__(self):
        super().__init__()
    
    def setup_listeners(self, crewai_event_bus):
        @crewai_event_bus.on(AgentExecutionCompletedEvent)
        def on_agent_execution_completed(source, event):
            print(f"Agent '{event.agent.role}' completed task")
            print(f"Output: {event.output}")

            if event.agent.role == "Municipal Code Section Extractor":
                eval_municipal_code_extraction = MunicipalCodeExtractionEval()
                eval_result = eval_municipal_code_extraction.evaluate(event.output)
                print(f"""
                    Municipal Code Extraction evaluation:
                    Passed: {eval_result.pass_}
                    Score: {eval_result.score}
                    Explanation: {eval_result.explanation}
                    """)