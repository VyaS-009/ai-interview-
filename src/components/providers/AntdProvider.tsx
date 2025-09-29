import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { lightTheme } from "@/styles/antd-theme"; // Assuming lightTheme is your theme object

const AntdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AntdRegistry>
      <ConfigProvider theme={lightTheme}>{children}</ConfigProvider>
    </AntdRegistry>
  );
};

export default AntdProvider;
