import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#6366F1",
    colorSuccess: "#10B981",
    colorWarning: "#F59E0B",
    colorError: "#EF4444",
    colorInfo: "#6366F1",
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 16,
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#FAFBFC",
    colorBorder: "#E2E8F0",
    colorText: "#1A202C",
    colorTextSecondary: "#4A5568",
    controlHeight: 42,
  },
  components: {
    Button: {
      controlHeight: 42,
      borderRadius: 8,
      fontWeight: 500,
      primaryShadow: "0 2px 4px rgba(99, 102, 241, 0.1)",
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 32,
      boxShadowTertiary: "0 1px 3px rgba(0, 0, 0, 0.05)",
    },
    Table: {
      headerBg: "#F9FAFB",
      headerColor: "#1A202C",
      borderColor: "#E2E8F0",
      rowHoverBg: "#F9FAFB",
    },
    Input: {
      borderRadius: 8,
      controlHeight: 42,
      paddingBlock: 10,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 42,
    },
    Tabs: {
      itemColor: "#4A5568",
      itemSelectedColor: "#6366F1",
      itemHoverColor: "#6366F1",
      inkBarColor: "#6366F1",
      titleFontSize: 15,
    },
  },
};