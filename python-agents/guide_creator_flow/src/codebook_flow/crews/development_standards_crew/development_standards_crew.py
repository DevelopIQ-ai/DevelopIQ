from typing import List, Dict, Any
from crewai import Agent, Task, Crew, Process, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from pydantic import BaseModel, Field
from tools.table_of_contents_tools import (
    TableOfContentsExtractorTool,
    ChapterExtractorTool
)

class TitleOutput(BaseModel):
    selected_title: str = Field(description="The selected title number")
    title_name: str = Field(description="The name of the selected title")
    relevance_score: int = Field(description="A score from 1-10 indicating relevance")
    reason: str = Field(description="Explanation for why this title was selected")

class ChapterOutput(BaseModel):
    selected_chapter: str = Field(description="The selected chapter number")
    chapter_name: str = Field(description="The name of the selected chapter")
    relevance_score: int = Field(description="A score from 1-10 indicating relevance")
    reason: str = Field(description="Explanation for why this chapter was selected")

class SectionItem(BaseModel):
    section_number: str = Field(description="The section number (e.g., 151.039)")
    section_title: str = Field(description="The title of the section")
    relevance_score: int = Field(description="A score from 1-10 indicating relevance")
    reason: str = Field(description="Explanation for why this section was selected")

class SectionsOutput(BaseModel):
    sections: List[SectionItem] = Field(description="List of relevant sections")

@CrewBase
class DevelopmentStandardsCrew:
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
    def find_title(self) -> Task:
        """Task to find the most relevant title"""
        return Task(
            config=self.tasks_config['find_title'],
            output_json=TitleOutput,
            tools=[TableOfContentsExtractorTool()]
        )

    @task
    def find_chapter(self) -> Task:
        """Task to find the most relevant chapter"""
        return Task(
            config=self.tasks_config['find_chapter'],
            output_json=ChapterOutput,
            tools=[ChapterExtractorTool()]
        )

    # @task
    # def find_sections(self) -> Task:
    #     """Task to find the most relevant sections"""
    #     return Task(
    #         config=self.tasks_config['find_sections'],
    #         output_json=SectionsOutput,
    #         tools=[SectionExtractorTool()]
    #     )

    @crew
    def crew(self) -> Crew:
        """Creates the Development Standards crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )

   