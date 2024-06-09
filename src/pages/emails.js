import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Modal from "./components/Modal";

export default function Emails() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailContent, setEmailContent] = useState([]);
  const [numEmailsToClassify, setNumEmailsToClassify] = useState(5);
  const [storedEmails, setStoredEmails] = useState([]);

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (session) {
      const fetchEmails = async () => {
        try {
          const response = await axios.get("/api/gmail");
          const emailsData = response.data;
          setEmails(emailsData);
          console.log(emailsData);

          const processedEmails = emailsData.map((email) => {
            const headers = email.payload.headers;
            const fromHeader = headers.find((header) => header.name === "From");
            const toHeader = headers.find((header) => header.name === "To");
            const subjectHeader = headers.find(
              (header) => header.name === "Subject"
            );
            const snippet = email.snippet;

            return {
              from: fromHeader ? fromHeader.value : "",
              to: toHeader ? toHeader.value : "",
              subject: subjectHeader ? subjectHeader.value : "",
              snippet: snippet ? snippet : "",
            };
          });

          localStorage.setItem("emails", JSON.stringify(processedEmails));
          setStoredEmails(processedEmails);
        } catch (error) {
          console.error("Error fetching emails:", error);
        }
      };
      fetchEmails();
    } else {
      const storedEmails = JSON.parse(localStorage.getItem("emails")) || [];
      setStoredEmails(storedEmails);
    }
  }, [session]);

  const classifyEmails = async () => {
    if (!apiKey) {
      alert("Please provide an OpenAI API key.");
      return;
    }

    try {
      const emailsToClassify = storedEmails.slice(0, numEmailsToClassify);
      const response = await axios.post("/api/classify", {
        emails: emailsToClassify,
        apiKey: apiKey,
      });
      const classifiedEmails = response.data.classifiedEmails;
      const updatedStoredEmails = storedEmails.map((email, index) => {
        if (index < classifiedEmails.length) {
          return {
            ...email,
            classification: classifiedEmails[index].classification,
          };
        }
        return email;
      });

      localStorage.setItem("emails", JSON.stringify(updatedStoredEmails));
      setStoredEmails(updatedStoredEmails);
    } catch (error) {
      console.error("Error classifying emails:", error);
    }
  };
  const handleOpenModal = (email) => {
    setEmailContent(email);
    setSelectedEmail(email);
  };

  const handleCloseModal = () => {
    setSelectedEmail(null);
    setEmailContent("");
  };

  if (!session) {
    return <p>Please log in to view your emails.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center mb-4">
        <label htmlFor="numEmails" className="mr-2">
          Select Number of Emails to Classify:
        </label>
        <select
          id="numEmails"
          className="bg-slate-600 rounded-md border border-gray-300 p-1"
          value={numEmailsToClassify}
          onChange={(e) => setNumEmailsToClassify(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <button onClick={classifyEmails} className="btn ml-4">
          Classify Emails
        </button>
      </div>
      {storedEmails.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storedEmails.slice(0, numEmailsToClassify).map((email, index) => (
            <div
              key={index}
              className="p-4 mx-2 border-2 border-rose-500 cursor-pointer"
              onClick={() => handleOpenModal(email)}
            >
              <p>
                <strong>Snippet:</strong> {email.snippet}
              </p>
              <p>
                <strong>Classification:</strong> {email.classification}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedEmail && (
        <Modal
          emailContent={emailContent}
          selectedEmail={selectedEmail}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
