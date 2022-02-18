import {
  Bus,
  BusInstance,
  ClassConstructor,
  HandlerDefinition,
} from "@node-ts/bus-core";
import {
  Message,
  MessageAttributeMap,
  MessageAttributes,
} from "@node-ts/bus-messages";
import {
  RabbitMqTransport,
  RabbitMqTransportConfiguration,
} from "@node-ts/bus-rabbitmq";
import { explainInitializationError } from "./error-helpers";


let busInstance: BusInstance | undefined;

/**
 * Initializes a new instance of bus
 */
export const initializeBus = async (
  queueName: string,
  handler: {
    messageType: ClassConstructor<Message>;
    messageHandler: HandlerDefinition<
      Message,
      MessageAttributes<MessageAttributeMap, MessageAttributeMap>
    >;
  }
): Promise<void> => {
  if (!!busInstance) {
    throw new Error("Bus has already been initialized");
  }
  const rabbitMqConfiguration: RabbitMqTransportConfiguration = {
    queueName,
    connectionString: "amqp://guest:guest@rabbitmq",
    maxRetries: 2,
  };
  
  const rabbitMq = new RabbitMqTransport(rabbitMqConfiguration);
  
  try {
    busInstance = await Bus.configure()
      .withHandler(handler)
      .withTransport(rabbitMq)
      .initialize();
  } catch (error) {
    explainInitializationError(error);
    throw error;
  }

  await busInstance.start();
};

/**
 * Disposes and removes the current bus instance
 */
export const disposeBus = async () => {
  if (!busInstance) {
    throw new Error("Cannot dispose bus as it has not been initialized");
  }
  await busInstance.dispose();
  busInstance = undefined;
};

/**
 * Gets the initialized bus instance
 */
export const bus = (): BusInstance => {
  if (!busInstance) {
    throw new Error(
      "Bus has not been initialized, call initializeBus() first."
    );
  }
  return busInstance;
};
