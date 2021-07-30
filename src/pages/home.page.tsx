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
        <div className="body">
          <Header />
          <Wrapper />
        </div>
        <Footer />
      </section>
    </>
  );
};

export default Home;
