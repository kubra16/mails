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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()} className="btn">
          Sign out
        </button>
        <div>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter OpenAI API Key"
            className="input"
          />
          <button onClick={saveApiKey} className="btn">
            Save API Key
          </button>
        </div>
        <Link href="/emails">
          <button className="btn">Go to Emails</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p>Not signed in</p>
      <button onClick={() => signIn("google")} className="btn">
        Sign in with Google
      </button>
    </div>
  );
}
