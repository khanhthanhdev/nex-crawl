"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser"
import { revalidatePath } from "next/cache";


export async function UpdateWorkflowCron( {id, cron}: {id: string; cron: string;}){
    const {userId} = auth();

    if(!userId){
        throw new Error("User not authenticated");
    }

    try {
        const interval = parser.parseExpression(cron, {utc: true});
        await prisma.workflow.update({
            where: {
                userId,
                id
            },
            data: {
                cron,
                nextRunAt: interval.next().toDate(),
            }
        })
    } catch (error) {
    
        throw new Error("Invalid cron expression");
    }

    revalidatePath("/workflows");

}