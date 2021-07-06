import React, { useState, FormEvent, useCallback, useEffect } from "react";
import { Access } from "../../interfaces/access.interface";
import { Module } from "../../interfaces/module.interface";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { useUpdateModule } from "../../hooks/module/useUpdateModule";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import { useGetAllAccess } from "../../hooks/access/useGetAllAceess";
import TrasnferList from "../../lib/transfer-list-component";
import { findError } from "../../helpers/control-errors";

type FormChange = FormEvent<HTMLFormElement>;

const AccesoForm = ({
  module,
  handleClose,
}: {
  module: Module;
  handleClose: () => void;
}) => {
  const [listAvailable, setListAvailable] = useState<Access[]>([]);
  const [listCurrent, setListCurrent] = useState<Access[]>([]);
  const [checked, setChecked] = useState<Access[]>([]);
  const dispatch = useDispatch();
  const optionsUpdateModule = useUpdateModule();
  const optionsGetAllAccess = useGetAllAccess();
  const alert = useSelector((state: any) => state.message);
  const { type, text } = alert;

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    const newData = listCurrent.map((access) => {
      return {
        name: access.name,
      };
    });

    try {
      await optionsUpdateModule.updateModule({
        variables: {
          moduleInput: {
            id: module.id,
            access: newData,
          },
        },
      });
      return dispatch(
        setAlert({
          type: "success",
          text: "El modulo actualizó sus accesos correctamente.",
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

  const loadAccessAvailable = useCallback(() => {
    const res = optionsGetAllAccess.data.getAccess.filter(
      (dispo: Access) =>
        !module.access?.some((actual) => dispo.name === actual.name)
    );

    setListAvailable(res);
  }, [module, optionsGetAllAccess.data]);

  useEffect(() => {
    if (module && optionsGetAllAccess.data) {
      setListCurrent(module.access || []);
      loadAccessAvailable();
    }
  }, [module, optionsGetAllAccess.data, loadAccessAvailable]);

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
            titleAvailable="Accesos disponibles"
            listCurrent={listCurrent}
            titleCurrent="Accesos actuales"
            loading={optionsGetAllAccess.loading}
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
            disabled={optionsUpdateModule.loading ? true : false}
          >
            {module.id ? "Actualizar" : "Registrar"}
          </Button>
        </DialogActions>
      </Grid>
    </form>
  );
};

export default AccesoForm;
