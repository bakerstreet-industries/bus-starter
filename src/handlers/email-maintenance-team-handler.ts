import { handlerFor } from "@node-ts/bus-core";
import { bus } from "bus";
import { DummyError } from "messages/dummy-error";
import { EmailMaintenanceTeam } from "../messages";
import * as emailService from "../services/email-service";

export const emailMaintenanceTeamHandler = handlerFor(
  EmailMaintenanceTeam,
  async ({ message, sirenId }) => {
    try {
      await emailService.sendEmail(message, sirenId);
    } catch (err) {
      await bus().publish(new DummyError(JSON.stringify(err)));
      await bus().fail();
    }
  }
);
