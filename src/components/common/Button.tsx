import { Button as AntdButton } from "antd";
import { ButtonProps } from "antd";
import { cn } from "@/utils/cn";

const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return <AntdButton className={cn(className)} {...props} />;
};

export default Button;
