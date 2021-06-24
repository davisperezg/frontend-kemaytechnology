import React, { useState, useEffect, FormEvent, useCallback } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Module } from "../../interfaces/module.interface";
import { Menu } from "../../interfaces/menu.interface";
import { useGetMenus } from "../../hooks/menu/useGetMenus";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import DialogActions from "@material-ui/core/DialogActions";
import { useUpdateModule } from "../../hooks/module/useUpdateModule";
import { useSelector } from "react-redux";
import TrasnferList from "../../lib/transfer-list-component";

type FormChange = FormEvent<HTMLFormElement>;

const MenuForm = ({
  module,
  handleClose,
}: {
  module: Module;
  handleClose: () => void;
}) => {
  const [listAvailable, setListAvailable] = useState<Menu[]>([]);
  const [listCurrent, setListCurrent] = useState<Menu[]>([]);
  const [checked, setChecked] = useState<Menu[]>([]);
  const dispatch = useDispatch();
  const optionsGetMenus = useGetMenus();
  const optionsUpdateModule = useUpdateModule();
  const alert = useSelector((state: any) => state.message);
  const { type, text } = alert;

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    const newData = listCurrent.map((menu) => {
      return {
        name: menu.name,
      };
    });

    try {
      await optionsUpdateModule.updateModule({
        variables: {
          moduleInput: {
            id: module.id,
            menus: newData,
          },
        },
      });
      return dispatch(
        setAlert({
          type: "success",
          text: "El modulo actualizó sus menu correctamente.",
        })
      );
    } catch (e) {
      dispatch(
        setAlert({
          type: "error",
          text: e.message,
        })
      );
    }
  };

  const loadMenusAvailable = useCallback(() => {
    const res = optionsGetMenus.data.getMenus.filter(
      (dispo: Menu) =>
        !module.menus?.some((actual) => dispo.name === actual.name)
    );

    setListAvailable(res);
  }, [module, optionsGetMenus.data]);

  useEffect(() => {
    if (module && optionsGetMenus.data) {
      setListCurrent(module.menus || []);
      loadMenusAvailable();
    }
  }, [module, optionsGetMenus.data, loadMenusAvailable]);

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
            titleAvailable="Menus disponibles"
            listCurrent={listCurrent}
            titleCurrent="Menus actuales"
            loading={optionsGetMenus.loading}
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

export default MenuForm;
