import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="center">
        <p>
          © 2020-2021 by{" "}
          <a
            href="https://kemaytechnology.com/"
            target="_blank"
            rel="noreferrer"
          >
            Kemay Technology
          </a>
          . Todos los derechos reservados. Si tuviese algún inconveniente por
          favor contactarnos al siguiente correo:
          <a
            href="mailto:dperez@kemaytechnology.com"
            target="_blank"
            rel="noreferrer"
          >
            dperez@kemaytechnology.com
          </a>
          <br /> Version: 0.0.1 | Powered by
          <a
            href="http://github.com/davisperezg"
            target="_blank"
            rel="noreferrer"
          >
            @davisperezg
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
