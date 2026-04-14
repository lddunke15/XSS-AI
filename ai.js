import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeInput(input) {
  const prompt = `
You are a cybersecurity assistant analyzing potential XSS input.

User input:
"${input}"

Tasks:
1. Determine if this looks like an XSS attempt or harmless input
2. If malicious or suspicious, explain what type of XSS it resembles (reflected, stored, DOM-based)
3. DO NOT provide exploit instructions
4. Explain the security risk in simple terms
5. Provide secure coding fixes (sanitization, CSP, escaping)

Return in structured bullet points.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}

