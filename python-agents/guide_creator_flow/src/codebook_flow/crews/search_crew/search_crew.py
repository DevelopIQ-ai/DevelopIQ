from typing import List, Dict, Any
from crewai import Agent, Task, Crew, Process, LLM
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel, Field
from tools.toc_tools import (
    TitleExtractorTool,
    ChapterExtractorTool
)

class Section(BaseModel):
    section_number: str = Field(description="The full section number (eg. 126.001)")
    section_name: str = Field(description="The section name/title")

class ChapterOutput(BaseModel):
    selected_title: str = Field(description="The selected title number")
    selected_chapter: str = Field(description="The selected chapter number")
    chapter_name: str = Field(description="The name of the selected chapter")
    chapter_reason: str = Field(description="Explanation for why this chapter was selected")
    chapter_contents: List[Section] = Field(description="List of sections in this chapter")

@CrewBase
class SearchCrew:
    """Crew for finding relevant sections in municipal code"""
    llm = LLM(model="gpt-4o-mini")
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def municipal_code_finder(self) -> Agent:
        """Creates the municipal code finder agent"""
        return Agent(
            config=self.agents_config['municipal_code_finder'],
            llm=self.llm,
        )

    @task
    def find_chapter(self) -> Task:
        """Task to find the most relevant chapter"""
        return Task(
            config=self.tasks_config['find_chapter'],
            output_json=ChapterOutput,
            tools=[TitleExtractorTool(), ChapterExtractorTool()]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Development Standards crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )

   