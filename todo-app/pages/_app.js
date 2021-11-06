import { UserContextProvider } from "./../lib/UserContext";
import supabase from "../lib/supabaseClient";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;
