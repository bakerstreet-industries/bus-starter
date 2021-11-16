import { Event } from '@node-ts/bus-messages'

export class DummyError extends Event {

  static readonly NAME = 'bus-starter/dummy-error'
  readonly $name = DummyError.NAME
  readonly $version = 0

  /**
   * A siren was tested and found to be functioning correctly
   * @param sirenId Identifies the siren that was tested
   */
  constructor (
    readonly message: string
  ) {
    super()
  }

}
