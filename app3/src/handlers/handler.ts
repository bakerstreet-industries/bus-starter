import { handlerFor } from "@node-ts/bus-core";
import { Message } from "../../../shared/src/messages/message";

export const handler = handlerFor(Message, async ({ message }) => {
  console.log(`app3 handler received message: ${message}`);
});
