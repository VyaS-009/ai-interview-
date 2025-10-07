// src/app/layout.tsx
import { App } from "antd";
import { Inter } from 'next/font/google';
import AntdProvider from "@/components/providers/AntdProvider";
import ClientReduxWrapper from "@/components/providers/ClientReduxWrapper";
import WelcomeModal from "@/components/common/WelcomeModal";
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
    <html lang="en" className={inter.className}>
      <body >
        <ClientReduxWrapper>
          <AntdProvider>
            <App>
              {children}
              <WelcomeModal />
            </App>
          </AntdProvider>
        </ClientReduxWrapper>
      </body>
    </html>
  );
}