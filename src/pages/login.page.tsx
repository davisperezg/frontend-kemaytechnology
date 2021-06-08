import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import logo from "../assets/logo.png";
import { useLogin } from "../hooks/login/useLogin";
import { Error } from "../interfaces/error.interface";
import { Login } from "../interfaces/auth.interface";
import { setLocal } from "../lib/local-storage";
import client from "../apollo-client";

import "./css/login.css";
import { setLoading } from "../store/auth/action";
import { connect } from "react-redux";

//for inputs
type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
//for selects
//type SelectChange = ChangeEvent<HTMLSelectElement>;
//for forms
type FormChange = FormEvent<HTMLFormElement>;

const initialUser = {
  email: "",
  password: "",
};

const mapStateToProps = (state: any) => {
  return {
    loading: state.authReducer.loading,
  };
};

const LoginPage: React.FC = ({ loading, setLoading }: any) => {
  const [error, setError] = useState<Error>();
  const [user, setUser] = useState<Login>(initialUser);
  const loginForm = useLogin();

  const handleInputChange = (e: InputChange) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormChange) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginForm({
        variables: {
          authInput: { email: user.email, password: user.password },
        },
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
    } catch (e) {
      setError(e.graphQLErrors[0].extensions.exception.response);
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className="content-login-form-body">
              <div className="content-login-form-input">
                <TextField
                  error={error?.path === "username" ? true : false}
                  id="idUsername"
                  label="Usuario"
                  helperText={error?.path === "username" ? error?.message : ""}
                  name="email"
                  onChange={handleInputChange}
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
                  name="password"
                  onChange={handleInputChange}
                  variant="outlined"
                  type="password"
                  fullWidth
                />
              </div>
              <br />
              <div className="content-login-form-input content-items-center">
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    disabled={loading ? true : false}
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Iniciar sesion
                  </Button>
                )}
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

export default connect(mapStateToProps, { setLoading })(LoginPage);
