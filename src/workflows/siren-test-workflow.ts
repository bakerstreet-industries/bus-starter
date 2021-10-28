import { SirenTestWorkflowData } from './siren-test-workflow-data'
import {
  SirenTestStarted,
  SirenTestFailed,
  SirenTestPassed,
  EmailMaintenanceTeam,
  MaintenanceTeamEmailed
} from '../messages'
import { Workflow, WorkflowMapper } from '@node-ts/bus-core'
import { bus } from '../bus'

export class SirenTestWorkflow extends Workflow<SirenTestWorkflowData> {

  configureWorkflow (mapper: WorkflowMapper<SirenTestWorkflowData, SirenTestWorkflow>) {
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

  handleRussTest({
    sirenId,
  }: SirenTestStarted): Partial<SirenTestWorkflowData> {
    console.log("workflow::handlesSirenTestStarted");
    return {
      sirenId,
    };
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
    )
    await bus().send(emailMaintenanceTeam)
    return {}
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
