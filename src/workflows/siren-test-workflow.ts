import { BusInstance, Workflow, WorkflowMapper } from "@node-ts/bus-core";
import { inject, injectable } from "inversify";
import {
  EmailMaintenanceTeam,
  MaintenanceTeamEmailed,
  SirenTestFailed,
  SirenTestPassed,
  SirenTestStarted,
} from "../messages";
import { SirenTestWorkflowData } from "./sirent-test-workflow-data";

@injectable()
export class SirenTestWorkflow extends Workflow<SirenTestWorkflowData> {
  constructor(
    @inject("bus")
    private readonly bus: BusInstance
  ) {
    super();
  }

  configureWorkflow(
    mapper: WorkflowMapper<SirenTestWorkflowData, SirenTestWorkflow>
  ) {
    mapper
      .withState(SirenTestWorkflowData)
      .startedBy(SirenTestStarted, "handlesSirenTestStarted")
      .when(SirenTestFailed, "handlesSirenTestFailed", {
        lookup: (event) => event.sirenId,
        mapsTo: "sirenId",
      })
      .when(SirenTestPassed, "handlesSirenTestPassed", {
        lookup: (event) => event.sirenId,
        mapsTo: "sirenId",
      })
      .when(MaintenanceTeamEmailed, "handlesMaintenanceTeamEmailed", {
        lookup: (event) => event.sirenId,
        mapsTo: "sirenId",
      });
  }

  handlesSirenTestStarted({
    sirenId,
  }: SirenTestStarted): Partial<SirenTestWorkflowData> {
    console.log("workflow::handlesSirenTestStarted");
    return {
      sirenId,
    };
  }

  async handlesSirenTestFailed({
    sirenId,
  }: SirenTestFailed): Promise<Partial<SirenTestWorkflowData>> {
    console.log("workflow::handlesSirenTestFailed");
    const emailMaintenanceTeam = new EmailMaintenanceTeam(
      "A siren has failed its test and requires maintenance",
      sirenId
    );
    await this.bus.send(emailMaintenanceTeam);
    return {};
  }

  async handlesSirenTestPassed(
    _: SirenTestPassed
  ): Promise<Partial<SirenTestWorkflowData>> {
    console.log("workflow::handlesSirenTestPassed");

    return this.completeWorkflow();
  }

  async handlesMaintenanceTeamEmailed(
    _: MaintenanceTeamEmailed
  ): Promise<Partial<SirenTestWorkflowData>> {
    console.log("workflow::handlesMaintenanceTeamEmailed");

    return this.completeWorkflow({
      maintenanceEmailSent: true,
    });
  }
}
