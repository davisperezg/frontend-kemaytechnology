export const LINK_USER = "@page/LINK_USER";

export const setLink =
  (module: string, link: string, name: string) => async (dispatch: any) => {
    await dispatch({
      type: LINK_USER,
      payload: {
        link,
        module,
        page: link === "/" ? "DASHBOARD" : link.toUpperCase(),
        name,
      },
    });
  };
