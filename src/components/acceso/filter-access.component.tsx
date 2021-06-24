import React from "react";
import { PERMIT_ONE, PERMIT_TWO, PERMIT_TREE, PERMIT_FOUR } from "../../const";
import { User } from "../../interfaces/user.interface";

export const loadAccess = (
  value: string,
  auth: User,
  page: any,
  Component: any,
  Notify?: any
) => {
  switch (value) {
    case PERMIT_ONE:
      //find access by modules
      const filterAccessbyModuleCreate = auth?.role?.modules?.map((module) =>
        module.access?.filter(
          (myaccess) => module.name === page && myaccess.name === value
        )
      );
      //find access type create
      return filterAccessbyModuleCreate?.map((access, i) => {
        return access ? access?.length > 0 && <Component key={i} /> : "";
      });

    case PERMIT_TWO:
      //find access by modules
      const filterAccessbyModuleEdit = auth?.role?.modules?.map((module) =>
        module.access?.filter(
          (myaccess) => module.name === page && myaccess.name === value
        )
      );
      //find access type create
      return filterAccessbyModuleEdit?.map((access, i) => {
        return access ? access?.length > 0 && <Component key={i} /> : "";
      });

    case PERMIT_TREE:
      //find access by modules
      const filterAccessbyModuleDelete = auth?.role?.modules?.map((module) =>
        module.access?.filter(
          (myaccess) => module.name === page && myaccess.name === value
        )
      );
      //find access type create
      return filterAccessbyModuleDelete?.map((access, i) => {
        return access ? access?.length > 0 && <Component key={i} /> : "";
      });

    case PERMIT_FOUR:
      //find access by modules
      const filterAccessbyModuleView = auth?.role?.modules?.map((module) =>
        module.access?.filter(
          (myaccess) => module.name === page && myaccess.name === value
        )
      );
      //find access type create
      return filterAccessbyModuleView?.map((access, i) => {
        return access ? access?.length > 0 && <Component key={i} /> : "";
      });

    default:
      break;
  }
};
