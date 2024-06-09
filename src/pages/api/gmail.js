import { google } from "googleapis";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    console.log("Starting email fetch process");

    const session = await getSession({ req });
    if (!session) {
      console.log("No session found, unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // console.log("Session found:", session);

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
    });

    // console.log("Gmail API response:", response);

    const messages = response.data.messages || [];

    const emailData = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return msg.data;
      })
    );

    // console.log("Fetched email data:", emailData);
    res.status(200).json(emailData);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Error fetching emails" });
  }
}
