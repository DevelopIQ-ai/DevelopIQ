import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { parseHTMLAndExtractTOC } from "./steps";

const codebookWorkflow = new Workflow({
    name: 'codebook-workflow',
    triggerSchema: z.object({
      htmlContent: z.string().describe('The HTML content to parse'),
    }),
  })
    .step(parseHTMLAndExtractTOC);
  
  codebookWorkflow.commit();
  
  export { codebookWorkflow };
  