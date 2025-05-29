import swaggerAutogen from "swagger-autogen";
import { swaggerDefinition } from "../config/swagger";

const doc = {
  ...swaggerDefinition,
};

const outputFile = "./../config/swagger-output.json";
const routes = ["./../app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
