'use server'

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
    id, definitions
} : {
    id: string,
    definitions: string;
}) {
    const {userId} = auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    })

    if (!workflow) {
        throw new Error('Workflow not found');
    }

    if(workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error('Workflow is not a draft');
    }

    await prisma.workflow.update({
        data: {
            definitions,
        },
        where: {
            id,
            userId
        }
    })

    revalidatePath("/workflows")
}