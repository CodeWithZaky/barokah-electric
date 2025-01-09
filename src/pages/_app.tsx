import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import clsx from "clsx";

import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main
            className={clsx(
              GeistSans.className,
              "mx-auto flex min-h-screen w-full flex-col",
            )}
          >
            <Header />
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </SessionProvider>
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
