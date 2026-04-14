import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { analyzeInput } from "./ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// serve frontend
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ensure logs folder exists
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

app.get("/", async (req, res) => {
  const input = req.query.input || "";

  if (input) {
    console.log("🔍 Input received:", input);

    // log raw input
    fs.appendFileSync(
      "./logs/requests.log",
      `[INPUT] ${new Date().toISOString()} ${input}\n`
    );

    try {
      const analysis = await analyzeInput(input);

      console.log("\n🧠 AI ANALYSIS:\n");
      console.log(analysis);

      fs.appendFileSync(
        "./logs/requests.log",
        `[AI] ${new Date().toISOString()}\n${analysis}\n\n`
      );
    } catch (err) {
      console.error("AI error:", err.message);
    }
  }

  res.sendFile(path.resolve("public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

