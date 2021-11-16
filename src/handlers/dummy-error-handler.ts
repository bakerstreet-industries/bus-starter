import { handlerFor } from "@node-ts/bus-core";
import { DummyError } from "messages/dummy-error";

export const dummyErrorHandler = handlerFor(DummyError, async ({ message }) => {
  console.log("Does this happen?", message);
});
