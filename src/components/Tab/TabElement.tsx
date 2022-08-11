import "./tab.css";

interface Props {
  children: string;
  handleClick: () => void;
  value: string;
  index: number;
}

const TabElement = ({ children, handleClick, value, index }: Props) => {
  return (
    <li
      style={
        Number(value) === index
          ? {
              backgroundColor: "#DDDDDD",
            }
          : {}
      }
      onClick={handleClick}
      className="li-div"
    >
      {children}
    </li>
  );
};

export default TabElement;
