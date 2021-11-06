import { useState } from "react";
import { useRouter } from "next/router";
import useSupabase from "../hooks/useSupabase";
import { useUser } from "../lib/UserContext";

export default function SignUp() {
  const router = useRouter();

  const { session } = useUser();
  if (session) router.push("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignin(e) {
    e.preventDefault();
    try {
      const { user, session, error } = await useSupabase.auth.signIn({
        email: email,
        password: password,
      });
      console.log("user", user);
      console.log("session", session);
      if (error) throw error;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  return (
    <main>
      <form onSubmit={(e) => handleSignin(e)}>
        <h3>Sign In</h3>
        <div>
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
      <button onClick={() => router.push("/signup")}>
        I don't have an account
      </button>
    </main>
  );
}
