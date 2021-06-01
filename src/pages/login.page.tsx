import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import logo from "../assets/logo.png";
import { useLogin } from "../hooks/login/useLogin";
import { useForm } from "react-hook-form";
import { Error } from "../interfaces/error.interface";
import { Login } from "../interfaces/auth.interface";
import { setLocal } from "../lib/local-storage";
import client from "../apollo-client";
import "./css/login.css";

const LoginPage: React.FC = () => {
  //const { error, loading, data } = useQuery(GET);
  //   const { data } = useQuery(GETXID, {
  //     variables: { id: "60906a68053f9a30ac12eddd" },
  //   });
  //useState<Error[]>([]);
  const [error, setError] = useState<Error>();
  const { register, handleSubmit } = useForm<Login>();
  const [isLoading, setLoading] = useState<Boolean>(false);
  const loginForm = useLogin();

  const onSubmit = handleSubmit(({ email, password }) => {
    setLoading(true);
    const resultLogin = async () => {
      try {
        const res = await loginForm({
          variables: { authInput: { email, password } },
        });

        const {
          data: {
            login: { access_token, refresh_token },
          },
        } = res;

        setLocal("accessToken", access_token);
        setLocal("refreshToken", refresh_token);
        client.resetStore();
        window.location.href = "/";
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(e.graphQLErrors[0].extensions.exception.response);
      }
    };

    resultLogin();
  });

  return (
    <div className="login">
      <div className="content-login-logo content-items-center">
        <img width="250" height="250" src={logo} alt="Logo" />
      </div>
      <div className="content-login-form content-items-center">
        <div className="content-login-form-main">
          <div className="content-login-form-header content-items-center">
            <h1>SISTEMA RPUM</h1>
          </div>
          <form onSubmit={onSubmit}>
            <div className="content-login-form-body">
              <div className="content-login-form-input">
                <TextField
                  error={error?.path === "username" ? true : false}
                  id="idUsername"
                  label="Usuario"
                  helperText={error?.path === "username" ? error?.message : ""}
                  {...register("email")}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <br />
              <div className="content-login-form-input">
                <TextField
                  error={error?.path === "password" ? true : false}
                  id="idPassword"
                  label="Contraseña"
                  helperText={error?.path === "password" ? error?.message : ""}
                  {...register("password")}
                  variant="outlined"
                  type="password"
                  fullWidth
                />
              </div>
              <br />
              <div className="content-login-form-input">
                <Button
                  disabled={isLoading ? true : false}
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {isLoading ? <CircularProgress /> : "Iniciar sesion"}
                </Button>
              </div>
              <br />
              <div className="content-login-form-footer content-items-center">
                ¿Olvidaste tu contraseña?
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
