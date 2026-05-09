import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = config({ path: path.resolve(__dirname, ".env") });

if (result.error) {
  // On Railway/production, env vars are injected by the platform — this is normal
  console.warn("⚠️ No .env file found — using platform environment variables.");
} else {
  console.log("✅ .env file loaded successfully");
  console.log("Loaded keys:", Object.keys(result.parsed || {}));
}