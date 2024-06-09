const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emails, apiKey } = req.body;
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const classifiedEmails = [];

    for (const email of emails) {
      const prompt = `Classify the following email into one of the categories: marketing, general, important, social, spam. Into one word Email: ${email.snippet} ${email.from} ${email.subject}`;

      const result = await genAI
        .getGenerativeModel({ model: "gemini-1.5-flash" })
        .generateContent(prompt);
      const response = await result.response;
      const classification = response.text();

      classifiedEmails.push({ ...email, classification });
    }

    res.status(200).json({ classifiedEmails });
  } catch (error) {
    console.error("Error classifying emails:", error);
    res.status(500).json({ error: "Error classifying emails" });
  }
}
