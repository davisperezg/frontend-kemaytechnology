import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { Role } from "../../interfaces/role.interface";
import { setAlert } from "../../store/alert/action";
import DialogActions from "@mui/material/DialogActions";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { Module } from "../../interfaces/module.interface";
import { useGetModules } from "../../hooks/module/useGetModules";
import { useUpdateRole } from "../../hooks/role/useUpdateRole";
import TrasnferList from "../../lib/transfer-list-component";
import { MODULE_FORBIDDEN, ROLSA } from "../../const";
import { User } from "../../interfaces/user.interface";
import { findError } from "../../helpers/control-errors";

type FormChange = FormEvent<HTMLFormElement>;

const ModuleTransferList = ({
  role,
  handleClose,
}: {
  role: Role;
  handleClose: () => void;
}) => {
  const [listAvailable, setListAvailable] = useState<Module[]>([]);
  const [listCurrent, setListCurrent] = useState<Module[]>([]);
  const [checked, setChecked] = useState<Module[]>([]);
  const dispatch = useDispatch();
  const optionsGetModules = useGetModules();
  const optionsUpdateRole = useUpdateRole();
  const alert = useSelector((state: any) => state.message);
  const { type, text } = alert;
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    const newData = listCurrent.map((module) => {
      return {
        name: module.name,
      };
    });

    try {
      await optionsUpdateRole.updateRole({
        variables: {
          roleInput: {
            id: role.id,
            modules: newData,
          },
        },
      });
      return dispatch(
        setAlert({
          type: "success",
          text: "El rol actualizó sus modulos correctamente.",
        })
      );
    } catch (e) {
      dispatch(
        setAlert({
          type: "error",
          text: findError(e),
        })
      );
    }
  };

  const loadModuleAvailable = useCallback(() => {
    let res: Module[];

    res = optionsGetModules.data.getModules.filter(
      (dispo: Module) =>
        !role.modules?.some((actual) => dispo.name === actual.name)
    );

    const listModulesAvailableNoModulo = res.filter(
      (module) => module.name !== MODULE_FORBIDDEN
    );

    // if (auth?.role?.name === ROLSA) {
    //   setListAvailable(res);
    // } else {
    //   const resNotSA = res.filter((module) => module.name !== MODULE_FORBIDDEN);
    //   setListAvailable(resNotSA);
    // }

    setListAvailable(listModulesAvailableNoModulo);
  }, [role, optionsGetModules.data]);

  useEffect(() => {
    if (role && optionsGetModules.data) {
      const listModulesCurrentNoModulo = role.modules?.filter(
        (module) => module.name !== MODULE_FORBIDDEN
      );
      setListCurrent(listModulesCurrentNoModulo || []);
      loadModuleAvailable();
    }
  }, [role, optionsGetModules.data, loadModuleAvailable]);

  if (type === "error") {
    return <h1>{text}</h1>;
  }

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TrasnferList
            setListAvailable={setListAvailable}
            setListCurrent={setListCurrent}
            setChecked={setChecked}
            checked={checked}
            listAvailable={listAvailable}
            titleAvailable="Modulos disponibles"
            listCurrent={listCurrent}
            titleCurrent="Modulos actuales"
            loading={optionsGetModules.loading}
          />
        </Grid>
        <DialogActions style={{ width: "100%" }}>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>

          <Button
            type="submit"
            color="primary"
            autoFocus
            variant="contained"
            disabled={optionsUpdateRole.loading ? true : false}
          >
            {module.id ? "Actualizar" : "Registrar"}
          </Button>
        </DialogActions>
      </Grid>
    </form>
  );
};

export default ModuleTransferList;
