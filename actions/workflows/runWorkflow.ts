"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {
    workflowId: string;
    flowDefinition?: string;
}) {
    const {userId} = auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    const {workflowId, flowDefinition} = form;
    if (!workflowId) {
        throw new Error("Workflow ID is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    })

    if(!workflow) {
        throw new Error("Workflow not found");
    }
    let executionPlan: WorkflowExecutionPlan;

    if(!flowDefinition){
        throw new Error("Flow definition is required");
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if(result.error) {
        throw new Error("Invalid flow definition");
    }

    if(!result.executionPlan) {
        throw new Error("Execution plan not generated");
    }

    executionPlan = result.executionPlan;
    console.log("Execution plan", executionPlan);
}