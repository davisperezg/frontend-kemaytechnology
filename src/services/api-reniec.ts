import axios from "axios";
import { API_RENIEC } from "../const";
import { Person } from "../interfaces/person.interface";

export const getPerson = async (document: string) => {
  return await axios.get<Person>(`${API_RENIEC}${document}`);
};
