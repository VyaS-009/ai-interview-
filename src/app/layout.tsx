// src/app/layout.tsx
import { App } from "antd";
import { Inter } from 'next/font/google';
import AntdProvider from "@/components/providers/AntdProvider";
import ClientReduxWrapper from "@/components/providers/ClientReduxWrapper";
import WelcomeModal from "@/components/common/WelcomeModal";
import Header from "@/components/common/Header";
import SessionValidator from "@/components/auth/SessionValidator";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "AI Interview Platform",
  description: "An AI-powered interview platform with modern design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ClientReduxWrapper>
          <AntdProvider>
            <App className="flex flex-col min-h-screen w-full">
              <SessionValidator />
              {/* Global Animated Background */}
              <div className="fixed inset-0 -z-10">
                <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
                <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
                {/* Floating gradient orbs */}
                <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
                <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />
              </div>

              <Header />
              <main className="flex-grow w-full">
                {children}
              </main>
              <WelcomeModal />
            </App>
          </AntdProvider>
        </ClientReduxWrapper>
      </body>
    </html>
  );
}