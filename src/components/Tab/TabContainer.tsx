import "./tab.css";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const TabContainer = ({ children }: Props) => {
  return <ul className="ul-tabs">{children}</ul>;
};

export default TabContainer;
