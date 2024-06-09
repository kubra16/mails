import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState("");

  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", apiKey);
    console.log("clcile");
  };
  console.log(session);

  if (session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-lg mb-4">Signed in as {session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign out
        </button>
        <div className="mt-4">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Gemini API"
            className="input border border-gray-400 rounded px-4 py-2"
          />
          <button
            onClick={saveApiKey}
            className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Save API Key
          </button>
        </div>
        <Link href="/emails">
          <button className="btn bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4">
            Go to Emails
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-lg mb-4">Not signed in</p>
      <button
        onClick={() => signIn("google")}
        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
