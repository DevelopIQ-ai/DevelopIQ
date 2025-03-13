import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { codebookWorkflow } from './workflows';
import { documentAnalysisAgent } from './agents';
import { FileTransport } from "@mastra/loggers/file";
import * as fs from 'fs';
import * as path from 'path';

// Ensure logs directory exists
const logDir = path.resolve('./logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const mastra = new Mastra({
  workflows: { codebookWorkflow },
  agents: {documentAnalysisAgent},
  logger: createLogger({
    name: 'Mastra',
    level: 'debug',
    transports: { file: new FileTransport({ path: path.join(logDir, "mastra.log") }) },
  }),
});

