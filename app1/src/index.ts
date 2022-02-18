import "reflect-metadata";
import { bus, initializeBus } from "../../shared/src/bus";
import { Message } from "../../shared/src/messages/message";
import { handler } from "./handlers/handler";

initializeBus("app1", handler)
  .then(() => {
    console.log("app1 bus started");

    setTimeout(() => {
      bus().send(new Message("This message was sent from app1", 0));
    }, 5000);
  })
  .catch((err) => {
    console.log(err);
  });
