import React from "react";
import Button from "@material-ui/core/Button";
// @ts-ignore
import logo from "../assets/logo.png";
import "./css/login.css";
import { GET, POST, GETXID, useLogin } from "../hooks/user/useGet";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  //const { error, loading, data } = useQuery(GET);
  //   const { data } = useQuery(GETXID, {
  //     variables: { id: "60906a68053f9a30ac12eddd" },
  //   });
  const [login, { error }] = useMutation(POST);

  const { register, handleSubmit } = useForm<LoginData>();
  const mylogin = useLogin();
  const onSubmit = handleSubmit(({ email, password }) => {
    console.log(email, password);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    mylogin({ variables: { authInput: { email, password } } });
  });

  //   const FormLogin = () => {
  //     login({
  //       variables: {
  //         authInput: {
  //           email: "daviskeiner@gmail.com",
  //           password: "Dapeor2020",
  //         },
  //       },
  //     });
  //     if (error) {
  //       console.log(error);
  //     }
  //   };
  //   React.useEffect(() => {
  //     FormLogin();
  //   }, []);

  //console.log(data);

  return (
    <div className="login-page">
      <div className="login-01">
        <img width="250" height="250" src={logo} alt="Logo" />
      </div>
      <div className="login-02">
        <div className="login-title">
          <p className="title">SISTEMA RPUM</p>
        </div>
        <div className="login-subtitle">
          <p className="subtitle">
            Sistema de Roles, Permisos, Usuarios y Modulos.
          </p>
        </div>
        <div className="login-box">
          <form onSubmit={onSubmit}>
            <div className="login-center">
              <div className="login-input">
                <p className="title-input">Usuario</p>
                <input type="text" className="input" {...register("email")} />
              </div>

              <div className="login-input">
                <p className="title-input">Contraseña</p>
                <input
                  type="password"
                  className="input"
                  {...register("password")}
                />
              </div>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
              >
                Iniciar Sesion
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
