import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

console.log(process.env.REACT_APP_URL);
export const URLC =
  process.env.REACT_APP_URL || "http://localhost:3000/graphql";
