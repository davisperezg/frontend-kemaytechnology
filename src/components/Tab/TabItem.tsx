import { ReactElement } from "react";

interface Props {
  children: ReactElement<any, any>;
  value: string;
  index: number;
}

const TabItem = ({ children, value, index }: Props) => {
  return Number(value) === index ? children : <></>;
};

export default TabItem;
