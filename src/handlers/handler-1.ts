import { handlerFor } from '@node-ts/bus-core'
import { Message1 } from 'messages/message-1'

export const handler1 = handlerFor(
  Message1,
  async ({ message}) => console.log(`handler 1 receive message: ${message}`)
)
