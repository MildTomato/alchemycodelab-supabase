import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import { useUser } from "../lib/UserContext";

export default function SignUp() {
  const router = useRouter();

  /*
   * Check if a user is defined (a user is logged in)
   * if `session` is defined, we change the route to '/dashboard'
   *
   * for those using nextjs, pages middleware (pages/_middleware.ts) might be
   * a better way to handle protecting routes and redirects
   * https://nextjs.org/docs/middleware
   */
  const { session } = useUser();
  if (session) router.push("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*
   * handleSignin()
   *
   * this is where we sign in using supabase-js
   * supabase.auth.signIn()
   *
   * https://supabase.io/docs/reference/javascript/auth-signin
   * *
   */
  async function handleSignIn(e) {
    e.preventDefault();

    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
      return alert(error.message);
    }

    console.log("user", user);
    console.log("session", session);
  }

  return (
    <main>
      <form onSubmit={(e) => handleSignIn(e)}>
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
