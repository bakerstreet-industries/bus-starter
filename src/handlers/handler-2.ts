import { handlerFor } from "@node-ts/bus-core";
import { Message1 } from "messages/message-1";

export const handler2 = handlerFor(Message1, async ({ message }) =>
  console.log(`handler 2 receive message: ${message}`)
);
