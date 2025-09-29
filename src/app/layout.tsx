// src/app/layout.tsx
import { App } from "antd";
import AntdProvider from "@/components/providers/AntdProvider";
import ClientReduxWrapper from "@/components/providers/ClientReduxWrapper";
import Header from "@/components/common/Header";
import WelcomeModal from "@/components/common/WelcomeModal";
import "@/styles/globals.css";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "AI Interview Platform",
  description: "An AI-powered interview platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientReduxWrapper>
          <AntdProvider>
            <App>
              <Header />
              <main>{children}</main>
              <WelcomeModal />
            </App>
          </AntdProvider>
        </ClientReduxWrapper>
      </body>
    </html>
  );
}
