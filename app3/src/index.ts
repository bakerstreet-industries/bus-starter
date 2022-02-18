import "reflect-metadata";
import { initializeBus } from "../../shared/src/bus";
import { handler } from "./handlers/handler";

initializeBus("app3", handler)
  .then(() => {
    console.log("app3 bus started");
  })
  .catch((err) => {
    console.log(err);
  });
