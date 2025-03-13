from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class ContentCrew():
	"""ContentCrew crew"""
	llm= LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	@agent	
	def documents_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['documents_analyst'],
			verbose=True,
			llm=self.llm
		)
	
	@task
	def relevant_sections_task(self) -> Task:
		return Task(
			config=self.tasks_config['relevant_sections_task'],
		)


	@crew
	def crew(self) -> Crew:
		"""Creates the ContentCrew crew"""

		return Crew(
			agents=self.agents, # Automatically created by the @agent decorator
			tasks=self.tasks, # Automatically created by the @task decorator
			process=Process.sequential,
			verbose=True,
			# process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
		)
