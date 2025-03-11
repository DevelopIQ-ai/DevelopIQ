import { researchAgent } from './agents';
import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';

const fetchNews = new Step({
  id: 'fetch-news',
  description: 'Fetches news articles for a given location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the news for'),
  }),
  execute: async ({ context }) => {
    const triggerData = context?.getStepResult<{ location: string }>('trigger');

    if (!triggerData) {
      throw new Error('Trigger data not found');
    }

    const prompt = `Find news articles that would appeal to a real estate developer looking for reasons to develop property in ${triggerData.location}.`;
    console.log("Prompt: ", prompt);

    const response = await researchAgent.generate([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    // For Streaming:
    // for await (const chunk of response.textStream) {
    //   process.stdout.write(chunk);
    // }
    console.log('Response: ', response.text);
    try {
      // Extract JSON from markdown code block
      const jsonMatch = response.text.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch || !jsonMatch[1]) {
        throw new Error('Could not find JSON data in the response');
      }
      
      const jsonContent = jsonMatch[1];
      return {
        news: JSON.parse(jsonContent),
      };
    } catch (error) {
      console.error('Failed to extract or parse JSON from response:', error);
      console.log('Raw response:', response.text);
      throw new Error('Could not process the research agent response');
    }
    
  },
});

const researchWorkflow = new Workflow({
  name: 'research-workflow',
  triggerSchema: z.object({
    location: z.string().describe('The location to get the news for'),
  }),
})
  .step(fetchNews);

researchWorkflow.commit();

export { researchWorkflow };