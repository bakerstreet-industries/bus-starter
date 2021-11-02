import { startSirenTestHandler, emailMaintenanceTeamHandler, startSirenTestHandler1 } from './handlers'
import { SirenTestWorkflow } from './workflows'
import { RabbitMqTransportConfiguration, RabbitMqTransport } from '@node-ts/bus-rabbitmq'
import { explainInitializationError } from './error-helpers'
import { Bus, BusConfiguration, BusInstance } from '@node-ts/bus-core'

const rabbitMqConfiguration: RabbitMqTransportConfiguration = {
  queueName: '@node-ts/bus-starter-test',
  connectionString: 'amqp://guest:guest@0.0.0.0',
  maxRetries: 10
}

const rabbitMq = new RabbitMqTransport(rabbitMqConfiguration)

let busInstance: BusInstance | undefined

/**
 * Initializes a new instance of bus
 */
export const initializeBus = async (): Promise<void> => {
  if (!!busInstance) {
    throw new Error('Bus has already been initialized')
  }

  let bc;
  try {
    bc = Bus.configure()
      .withWorkflow(SirenTestWorkflow)
      .withHandler(startSirenTestHandler)
      .withHandler(emailMaintenanceTeamHandler)
      .withTransport(rabbitMq);
      busInstance = await bc.initialize();
  } catch (error) {
    explainInitializationError(error)
    throw error
  }

  await busInstance.start()
  bc.withHandler(startSirenTestHandler1);
}

/**
 * Disposes and removes the current bus instance
 */
export const disposeBus = async () => {
  if (!busInstance) {
    throw new Error('Cannot dispose bus as it has not been initialized')
  }
  await busInstance.dispose()
  busInstance = undefined
}

/**
 * Gets the initialized bus instance
 */
export const bus = (): BusInstance => {
  if (!busInstance) {
    throw new Error('Bus has not been initialized, call initializeBus() first.')
  }
  return busInstance
}
