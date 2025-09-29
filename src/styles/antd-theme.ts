import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f0f2f5",
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 6,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Table: {
      headerBg: "#fafafa",
    },
  },
};
