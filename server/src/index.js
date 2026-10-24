import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// Load server/.env by its real location, not by whatever directory the
// process happens to be launched from (dotenv/config defaults to cwd-relative,
// which breaks if you `cd src && node index.js` instead of running from server/).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Todo API is running");
});

app.use("/api/auth", authRoutes);

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in server/.env");
  }
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
