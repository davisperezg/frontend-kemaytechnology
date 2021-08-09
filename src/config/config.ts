import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

export const URLC = process.env.URL || "http://localhost:3000/graphql";
