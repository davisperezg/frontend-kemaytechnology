export const LINK_USER = "@page/LINK_USER";

export const setLink = (link: any) => async (dispatch: any) => {
  await dispatch({
    type: LINK_USER,
    payload: {
      link,
      page: link === "/" ? "HOME" : link.toUpperCase(),
    },
  });
};
