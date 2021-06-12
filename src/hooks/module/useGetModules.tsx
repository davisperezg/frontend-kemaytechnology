import { gql, useQuery } from "@apollo/client";
import { Module } from "../../interfaces/module.interface";

const GET_MODULES = gql`
  query getModules {
    getModules {
      id
      name
      description
      createdAt
      updatedAt
      menus {
        id
        name
        link
      }
      access {
        id
        name
      }
    }
  }
`;

export const useGetModules = () => {
  const { data, loading, error } = useQuery(GET_MODULES);
  return { data, loading, error };
};
