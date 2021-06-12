import React, { useState, useEffect } from "react";
import Footer from "../footer/footer.component";
import SwitchContainer from "../../lib/switch-container";
import { connect } from "react-redux";
import { Module } from "../../interfaces/module.interface";
import { User } from "../../interfaces/user.interface";
import ListItemModules from "./list-item-modules";
import "./wrapper.css";

interface RootState {
  authReducer: {
    loading: boolean;
    authUser: User;
  };
  page: {
    user: {
      link: string;
      page: string;
    };
  };
}

const mapStateToProps = (state: RootState) => {
  const {
    authReducer: { loading, authUser },
    page: {
      user: { link, page },
    },
  } = state;

  return { loading, authUser, page, link };
};

const Wrapper = ({ authUser, page }: any) => {
  const data: User = authUser;
  const title: String = page;
  const firsCaracter: String = title.charAt(0).toUpperCase();
  const restCaracter: String = title.substr(1, title.length);
  const subTitle: String = `${firsCaracter}${restCaracter.toLowerCase()}`;
  const findModules = data?.role?.modules;
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    setModules(findModules || []);
  }, [findModules]);

  return (
    <div className="wrapper">
      <aside>
        <div className="sidebar">
          <ul>
            {modules.map((module) => (
              <ListItemModules key={module.id} module={module} />
            ))}
          </ul>
        </div>
      </aside>
      <section>
        <div className="content-wrapper">
          <div className="content-wrapper-header items-center">
            <h1>{title}</h1>
            <ol>
              <li className="list-style-none text-active">
                <strong>Home</strong>
              </li>
              <li className="list-style-none text-inactive">{subTitle}</li>
            </ol>
          </div>
          <div className="content-wrapper-main">
            <SwitchContainer />
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default connect(mapStateToProps, null)(Wrapper);
