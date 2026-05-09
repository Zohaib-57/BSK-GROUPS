import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = config({ path: path.resolve(__dirname, ".env") });

if (result.error) {
	console.error("❌ Failed to load .env file:", result.error);
} else {
	console.log("✅ .env file loaded successfully");
	console.log("Loaded keys:", Object.keys(result.parsed || {}));
}
