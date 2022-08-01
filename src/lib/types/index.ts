import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type FormChange = FormEvent<HTMLFormElement>;
export type SelectChange =
  | ChangeEvent<{ value: unknown } | any | HTMLSelectElement>
  | SelectChangeEvent;

export type OnKeyUp =
  | KeyboardEvent<
      HTMLImageElement | HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
    >
  | any;
