import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import clsx from "clsx";

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
              "min-h-screen w-full bg-muted-foreground/50",
            )}
          >
            <div className="mx-auto flex w-[70%] flex-col bg-background px-7">
              <Header />
              <Component {...pageProps} />
            </div>
          </main>
        </ThemeProvider>
      </SessionProvider>
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
