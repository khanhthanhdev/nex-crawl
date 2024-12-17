"use server"

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
    id,
    flowDefinition
}: {
    id: string;
    flowDefinition: string;
}) {
    const {userId } = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    })

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Workflow is not in draft status");
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
        throw new Error("Invalid flow definition");
    }

    if (!result.executionPlan) {
        throw new Error("Invalid plan generation");
    }


    const creditsCost = CalculateWorkflowCost(flow.nodes)

    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            definitions: flowDefinition,
            status: WorkflowStatus.PUBLISHED,
            executionPlan: JSON.stringify(result.executionPlan),
            creditsCost
        }
    })

    revalidatePath(`/workflow/editor/${id}`);

}