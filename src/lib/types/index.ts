import { ChangeEvent, FormEvent } from "react";

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type FormChange = FormEvent<HTMLFormElement>;
export type SelectChange = ChangeEvent<
  { value: unknown } | any | HTMLSelectElement
>;
