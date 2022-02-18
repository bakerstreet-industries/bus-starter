import "reflect-metadata";
import { initializeBus } from "../../shared/src/bus";
import { handler } from "./handlers/handler";

initializeBus("app2", handler)
  .then(() => {
    console.log("app2 bus started");
  })
  .catch((err) => {
    console.log(err);
  });
