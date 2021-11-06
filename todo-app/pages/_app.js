import { UserContextProvider } from "./../lib/UserContext";
import useSupabase from "./../hooks/useSupabase";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider supabaseClient={useSupabase}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;
