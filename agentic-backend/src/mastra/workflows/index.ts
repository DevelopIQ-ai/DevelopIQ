import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { parseHTMLAndExtractTOC } from "./codebook-workflow";
import { identifyRelevantSections } from "./codebook-workflow";

const codebookWorkflow = new Workflow({
  name: 'codebook-workflow',
  triggerSchema: z.object({
    htmlContent: z.string().describe('The HTML content to parse'),
  }),
})
  .step(parseHTMLAndExtractTOC)
  .then(identifyRelevantSections);

codebookWorkflow.commit();

export { codebookWorkflow };