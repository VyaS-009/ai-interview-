// src/app/layout.tsx
import { App } from "antd";
import AntdProvider from "@/components/providers/AntdProvider";
import ClientReduxWrapper from "@/components/providers/ClientReduxWrapper";
import WelcomeModal from "@/components/common/WelcomeModal";
import "@/styles/globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
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