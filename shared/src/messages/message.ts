import { Command } from "@node-ts/bus-messages";

export class Message extends Command {
  static readonly NAME = "bus-starter/message";
  readonly $name = Message.NAME;
  readonly $version = 0;

  constructor(readonly message: string, readonly count: number) {
    super();
  }
}
