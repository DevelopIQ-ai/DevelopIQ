from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List
from tools.section_extractor import SectionExtractorTool
load_dotenv()

class SectionItem(BaseModel):
	section_number: str = Field(description="The section number (e.g. '151.027')")
	section_title: str = Field(description="The title of the section without the section number")
	relevance_score: int = Field(description="A number from 1-10 indicating relevance (10 being highest)", ge=1, le=10)
	reason: str = Field(description="A brief explanation of why this section is relevant")

class SectionsOutput(BaseModel):
	root: List[SectionItem] = Field(description="Array of relevant sections")

@CrewBase
class ExtractionCrew():
	"""ExtractionCrew crew"""
	# llm= LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
	llm = LLM(model="gpt-4o-mini", api_key="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")
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	@agent	
	def municipal_code_section_extractor(self) -> Agent:
		return Agent(
			config=self.agents_config['municipal_code_section_extractor'],
			llm=self.llm,
			tools=[SectionExtractorTool()]
		)
	
	@task
	def find_sections(self) -> Task:
		return Task(
			config=self.tasks_config['find_sections'],
			output_json=SectionsOutput
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
