import { User } from "../../interfaces/user.interface";
import { gql, useQuery } from "@apollo/client";

const GET = gql`
  {
    getUser(id: "60906a68053f9a30ac12eddd") {
      id
      name
      lastName
      email
      role {
        name
        description
        modules {
          name
          description
          access {
            id
            name
          }
          menus {
            id
            name
            link
          }
        }
      }
    }
  }
`;

export function ExchangeRates() {
  const { loading, error, data } = useQuery(GET);
  //const { getUser } = data;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  /**{data.getUser.role.name.modules.map((module: any) => (
          <li>{module.name}</li>
        ))} */
  //console.log(data.getUser.role.modules[0].name);
  //obtener menus del modulo
  const modulemenus = data.getUser.role.modules.map(
    (module: any) => module.menus
  );
  //obtener accesos
  const accessos = data.getUser.role.modules.map(
    (acceso: any) => acceso.access
  );
  //obtener nombre de los modulos
  const modulename = data.getUser.role.modules.map(
    (module: any) => module.name
  );

  console.log("Map modulo name");
  console.log(modulename);
  console.log("Map Accesso");
  const listaccessos = accessos[0].map((acceso: any) => acceso.name);
  console.log(listaccessos);
  console.log(listaccessos[0]);
  console.log("Map menu");
  const menu = modulemenus[0].map((menu: any) => menu.name);
  console.log(menu);

  return (
    <div>
      <ul>
        <li>
          {data.getUser.name} - {data.getUser.role.name}
        </li>
        {data.getUser.role.modules.map((module: any) => (
          <li key={module.id}>{module.name}</li>
        ))}
        <ul>
          {modulemenus[0].map((menu: any) => (
            <li key={menu.id}>
              {menu.name}
              {listaccessos[0] === "Eliminar" ? (
                <> Ir a {menu.link}</>
              ) : (
                <a href={menu.link}> Ir a {menu.link}</a>
              )}

              <ul>
                {accessos[0].map((acceso: any) => (
                  <li key={acceso.id}>{acceso.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ul>
    </div>
  );
}
