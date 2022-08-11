export interface IModal {
  open: boolean;
  handleClose: () => void;
  entity?: any;
}
