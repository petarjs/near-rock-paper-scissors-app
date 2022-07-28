import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { createTheme } from "@nextui-org/react";
import { AuthProvider } from "../context/AuthContext";
import { NearProvider } from "../context/NearContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const darkTheme = createTheme({
  type: "dark",
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={darkTheme}>
      <QueryClientProvider client={queryClient}>
        <NearProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </NearProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default MyApp;
