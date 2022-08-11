import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DialogMUI = styled(Dialog)`
  & .MuiDialog-scrollPaper {
    & .MuiDialog-paper {
      height: 553px;
      padding-bottom: 52.5px;
    }
  }

  & .MuiDialogActions-root {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #fff;
    width: 100%;
  }

  & .MuiDialogContent-root {
    padding-top: 20px !important;
    margin-top: 0px !important;
  }
`;

const DialogTitleMui = styled(DialogTitle)`
  background-color: #252546;
  color: #fff;
  padding: 5px 24px;
  font-size: 16px;
`;

export const MyDialogMUI = (props: DialogProps) => {
  return <DialogMUI {...props} />;
};

export const MyDialogTitleMUI = (props: DialogTitleProps) => {
  return <DialogTitleMui {...props} />;
};
