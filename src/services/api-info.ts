import axios from "axios";
import {API_INFO} from "../const";

export const getPerson = async (document: string, nroDocument: string) => {
    return await axios.get(`${API_INFO}/${document}/${nroDocument}`);
};

export const getCompany = async (document: string, nroDocument: string) => {
    return await axios.get(`${API_INFO}/${document}/${nroDocument}`);
};