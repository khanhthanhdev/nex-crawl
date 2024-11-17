'use server';

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function CreateWorkflow(
    from: createWorkflowSchemaType
) {
    const {success, data} = createWorkflowSchema.safeParse(from);

    if (!success) {
        throw new Error("Invalid form data");
    }

    const {userId} = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const initialFlow: {nodes: AppNode[], edges: Edge[]} = {
        nodes: [],
        edges: []
    }

    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definitions: JSON.stringify(initialFlow),
            ...data,
        }
    })

    if (!result) {
        throw new Error("Failed to create workflow");
    }

    redirect(`/workflow/editor/${result.id}`);
}