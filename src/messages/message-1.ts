import { Command } from '@node-ts/bus-messages'

export class Message1 extends Command {

  static readonly NAME = 'bus-starter/message-1'
  readonly $name = Message1.NAME
  readonly $version = 0

 
  constructor (
    readonly message: string
  ) {
    super()
  }

}
