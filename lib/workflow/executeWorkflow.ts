import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { WorkflowExecutionStatus } from "@/types/workflow";

export async function ExecuteWorkflow(executionId: string) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {id: executionId},
        include: {workflow: true, phases: true}
    })

    if (!execution) {
        throw new Error("Execution not found");
    }

    const environment = {
        phases: {
            launchBrowser: {
                inputs: {
                    websiteUrl: "https://google.com"
                },
                outputs: {
                    browser: "PuppetterInstance"
                }
            }
        }
    }

    await initializeWorkflowExecution(executionId, execution.workflowId)

    // setup execution environment
    let executionFailed = false;
    for (const phase of execution.phases) {

    }

    revalidatePath("/workflows/runs")

}

async function initializeWorkflowExecution(executionId: string, workflowId: string){
    await prisma.workflowExecution.update({
        where: {id: executionId},
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    });

    await prisma.workflow.update({
        where: {id: workflowId},
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId
        }
    })
    
}