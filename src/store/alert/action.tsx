import { IAlert } from "../../interfaces/alert.interface";

export const ALERT = "@message/ALERT";

//{ alert }: { alert: Alert }
export const setAlert = (alert: IAlert) => {
  return {
    type: ALERT,
    payload: alert,
  };
};
