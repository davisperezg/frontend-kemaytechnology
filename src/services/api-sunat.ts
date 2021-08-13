import axios from "axios";
import { API_SUNAT } from "../const";
import { Company } from "../interfaces/company.interface";

export const getCompany = async (document: string) => {
  return await axios.get<Company>(`${API_SUNAT}${document}`);
};
