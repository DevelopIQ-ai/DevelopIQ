from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Dict
from src.codebook_flow.tools.table_of_contents_tools import TableOfContentsExtractorTool, SectionExtractorTool
load_dotenv()

class SubTopicItem(BaseModel):
    sub_topic: str = Field(description="The sub-topic you are looking for")
    section_number: List[str] = Field(description="Array of section numbers (e.g. ['151.027', '151.028'])")
    section_title: List[str] = Field(description="Array of section titles without their section numbers")
    relevance_score: List[int] = Field(description="Array of relevance scores from 1-10 (10 being highest)")
    reason: List[str] = Field(description="Array of reasons explaining why each section is relevant")

class TopicOutput(BaseModel):
    root: Dict[str, List[SubTopicItem]] = Field(description="Dictionary with topic as key and list of sub-topics as value")

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
			tools=[TableOfContentsExtractorTool()]
		)
	
	@task
	def find_and_extract_sections(self) -> Task:
		return Task(
			config=self.tasks_config['find_and_extract_sections'],
			output_json=TopicOutput
		)

	# @agent
	# def municipal_code_section_analyst(self) -> Agent:
	# 	return Agent(
	# 		config=self.agents_config['municipal_code_section_analyst'],
	# 		llm=self.llm
	# 	)
	
	# @task
	# def analyze_extracted_sections(self) -> Task:
	# 	return Task(
	# 		config=self.tasks_config['analyze_extracted_sections'],
	# 	)

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
