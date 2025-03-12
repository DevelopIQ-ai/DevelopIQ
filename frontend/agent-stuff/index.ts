// Export the codebook workflow and other Mastra components
export { codebookWorkflow } from './codebook/workflow';
export { newsWorkflow } from './news-agent';

/**
 * Helper function to run the codebook workflow
 * 
 * @param html - The HTML content to parse
 * @returns Promise with the result of the workflow execution
 */
export async function runCodebookWorkflow(html: string) {
  // Import the workflow
  const { codebookWorkflow } = await import('./codebook/workflow');
  
  // Create a new run instance
  const { runId, start } = codebookWorkflow.createRun();
  
  console.log('Starting codebook workflow run:', runId);
  
  // Start the workflow with the provided HTML
  const workflowResult = await start({
    triggerData: {
      htmlContent: html,
    },
  });
  
  return workflowResult;
}
