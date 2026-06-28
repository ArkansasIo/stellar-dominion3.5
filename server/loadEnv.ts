import { config } from "dotenv";
import { resolve } from "node:path";

const projectRoot = process.cwd();

config({ path: resolve(projectRoot, ".env") });
config({ path: resolve(projectRoot, ".env.local") });
config();
