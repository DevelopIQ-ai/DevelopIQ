# All Event Listeners

Crew Events
    - CrewKickoffStartedEvent: Emitted when a Crew starts execution
    - CrewKickoffCompletedEvent: Emitted when a Crew completes execution
    - CrewKickoffFailedEvent: Emitted when a Crew fails to complete execution
    - CrewTestStartedEvent: Emitted when a Crew starts testing
    - CrewTestCompletedEvent: Emitted when a Crew completes testing
    - CrewTestFailedEvent: Emitted when a Crew fails to complete testing
    - CrewTrainStartedEvent: Emitted when a Crew starts training
    - CrewTrainCompletedEvent: Emitted when a Crew completes training
    - CrewTrainFailedEvent: Emitted when a Crew fails to complete training
​
Agent Events
    - AgentExecutionStartedEvent: Emitted when an Agent starts executing a task
    - AgentExecutionCompletedEvent: Emitted when an Agent completes executing a task
    - AgentExecutionErrorEvent: Emitted when an Agent encounters an error during execution
​
Task Events
    - TaskStartedEvent: Emitted when a Task starts execution
    - TaskCompletedEvent: Emitted when a Task completes execution
    - TaskFailedEvent: Emitted when a Task fails to complete execution
    - TaskEvaluationEvent: Emitted when a Task is evaluated
​
Tool Usage Events
    - ToolUsageStartedEvent: Emitted when a tool execution is started
    - ToolUsageFinishedEvent: Emitted when a tool execution is completed
    - ToolUsageErrorEvent: Emitted when a tool execution encounters an error
    - ToolValidateInputErrorEvent: Emitted when a tool input validation encounters an error
    - ToolExecutionErrorEvent: Emitted when a tool execution encounters an error
    - ToolSelectionErrorEvent: Emitted when there’s an error selecting a tool
​
Flow Events
    - FlowCreatedEvent: Emitted when a Flow is created
    - FlowStartedEvent: Emitted when a Flow starts execution
    - FlowFinishedEvent: Emitted when a Flow completes execution
    - FlowPlotEvent: Emitted when a Flow is plotted
    - MethodExecutionStartedEvent: Emitted when a Flow method starts execution
    - MethodExecutionFinishedEvent: Emitted when a Flow method completes execution
    - MethodExecutionFailedEvent: Emitted when a Flow method fails to complete execution
​
LLM Events
    - LLMCallStartedEvent: Emitted when an LLM call starts
    - LLMCallCompletedEvent: Emitted when an LLM call completes
    - LLMCallFailedEvent: Emitted when an LLM call fails
    - LLMStreamChunkEvent: Emitted for each chunk received during streaming LLM responses