import React from "react";
import Header from "../components/header/header.component";
import Wrapper from "../components/wrapper/wrapper.component";
import Footer from "../components/footer/footer.component";
import Aside from "../components/aside/aside";
import "./css/home.css";

const Home = () => {
  return (
    <>
      <section className="menu">
        <Aside />
      </section>
      <section className="content">
        <Header />
        <Wrapper />
        <Footer />
        {/* <div className="body"></div> */}
      </section>
    </>
  );
};

export default Home;
