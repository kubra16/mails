import OpenAI, { Configuration, OpenAIApi } from "openai";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { emails, apikey } = req.body;
//   console.log(req.body);

//   const configuration = new OpenAI({
//     apiKey: apikey,
//   });
//   const openai = new OpenAIApi(configuration);

//   try {
//     const classifiedEmails = await Promise.all(
//       emails.map(async (email) => {
//         const response = await openai.createCompletion({
//           model: "text-davinci-003",
//           prompt: `Classify the following email into one of the categories: marketing, general, important, social, spam. Email: ${email.snippet} ${email.from} ${email.subject}`,
//           max_tokens: 10,
//         });
//         const classification = response.data.choices[0].text.trim();
//         return { ...email, classification };
//       })
//     );

//     res.status(200).json({ classifiedEmails });
//   } catch (error) {
//     console.error("Error classifying emails:", error);
//     res.status(500).json({ error: "Error classifying emails" });
//   }
// }

const axios = require("axios");

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emails, apiKey } = req.body;

  try {
    const classifiedEmails = [];
    for (const email of emails) {
      // Send request for each email
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Snippet: ${email.snippet}\nSubject: ${email.subject}\nFrom: ${email.from}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Extract classification from response
      const classification = response.data.choices[0].message;

      // Add classified email to result
      classifiedEmails.push({ ...email, classification });

      // Add a delay between requests (adjust as needed)
      await delay(1000); // 1 second delay
    }

    res.status(200).json({ classifiedEmails });
  } catch (error) {
    console.error("Error classifying emails:", error);
    res.status(500).json({ error: "Error classifying emails" });
  }
}
