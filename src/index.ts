import { Message1 } from "messages/message-1";
import "reflect-metadata";

import { bus as bus1, initializeBus as initializeBus1 } from "./bus-1";
import { bus as bus2, initializeBus as initializeBus2 } from "./bus-2";

async function runDemo(): Promise<void> {
  await bus1().send(new Message1("hello, I am message #1"));
}

initializeBus1()
  .then(() => {
    initializeBus2()
      .then(runDemo)
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
