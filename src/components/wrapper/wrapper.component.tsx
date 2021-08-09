import SwitchContainer from "../../lib/switch-container";
import { useSelector } from "react-redux";
import "./wrapper.css";

const Wrapper = () => {
  const { module, page, name } = useSelector((state: any) => {
    return state.page.user;
  });
  const firsCaracter: String = name?.charAt(0).toUpperCase();
  const restCaracter: String = name?.substr(1, name?.length);
  const subTitle: String = `${firsCaracter}${restCaracter.toLowerCase()}`;

  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <div className="content-wrapper-header items-center">
          <h1>{name.toUpperCase()}</h1>
          <ol>
            <li className="list-style-none text-active">
              <strong>{module}</strong>
            </li>
            <li className="list-style-none text-inactive">{subTitle}</li>
          </ol>
        </div>
        <div className="content-wrapper-main">
          <SwitchContainer />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
