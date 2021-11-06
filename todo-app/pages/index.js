import Head from "next/head";
import Image from "next/image";

import useSupabase from "./../hooks/useSupabase";
import { useUser } from "../lib/UserContext";
import { useRouter } from "next/router";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  if (user) router.push("/dashboard");

  async function handleSignIn(e) {
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
      alert(error);
    }
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>My to do app</h1>
        <button onClick={() => router.push("/signin")}>Sign in</button>
        <button onClick={() => router.push("/signup")}>Sign up</button>
      </main>
    </div>
  );
}
