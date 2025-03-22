from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List
from tools.table_of_contents_tools import TableOfContentsExtractorTool, SectionExtractorTool
load_dotenv()

class SectionItem(BaseModel):
	section_number: str = Field(description="The section number (e.g. '151.027')")
	section_title: str = Field(description="The title of the section without the section number")
	relevance_score: int = Field(description="A number from 1-10 indicating relevance (10 being highest)", ge=1, le=10)
	reason: str = Field(description="A brief explanation of why this section is relevant")
	content: str = Field(description="The full extracted content of the section")

class SectionsOutput(BaseModel):
	root: List[SectionItem] = Field(description="Array of relevant sections")

@CrewBase
class ExtractionCrew():
	"""ExtractionCrew crew"""
	# llm= LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
	llm = LLM(model="gpt-4o-mini", api_key=os.environ.get('OPENAI_API_KEY'))
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	@agent	
	def municipal_code_section_extractor(self) -> Agent:
		return Agent(
			config=self.agents_config['municipal_code_section_extractor'],
			llm=self.llm,
			tools=[TableOfContentsExtractorTool(), SectionExtractorTool()]
		)
	
	@task
	def find_and_extract_sections(self) -> Task:
		return Task(
			config=self.tasks_config['find_and_extract_sections'],
			output_json=SectionsOutput
		)

	@agent
	def municipal_code_section_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['municipal_code_section_analyst'],
			llm=self.llm
		)
	
	@task
	def analyze_extracted_sections(self) -> Task:
		return Task(
			config=self.tasks_config['analyze_extracted_sections'],
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
