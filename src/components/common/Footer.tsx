import { Layout, Typography } from "antd";

const Footer = Layout.Footer; // safer than destructuring
const { Text } = Typography;

const FooterComponent: React.FC = () => (
  <Footer style={{ textAlign: "center" }}>
    <Text>
      {process.env.NEXT_PUBLIC_APP_NAME} © {new Date().getFullYear()}
    </Text>
  </Footer>
);

export default FooterComponent;
