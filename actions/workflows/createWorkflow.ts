'use server';

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
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

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definitions: "TODO",
            ...data,
        }
    })

    if (!result) {
        throw new Error("Failed to create workflow");
    }

    redirect(`/workflows/editor/${result.id}`);
}