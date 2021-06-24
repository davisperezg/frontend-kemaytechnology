export const LINK_USER = "@page/LINK_USER";

export const setLink = (module: any, link: any) => async (dispatch: any) => {
  await dispatch({
    type: LINK_USER,
    payload: {
      link,
      module,
      page: link === "/" ? "HOME" : link.toUpperCase(),
    },
  });
};
