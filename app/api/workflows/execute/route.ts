import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, workflowExecutionTrigger } from "@/types/workflow";
import { timingSafeEqual } from "crypto";

function isValidSecret(secret: string) {
    const API_SECRET = process.env.API_SECRET;
    if (!API_SECRET) {
        return false;
    }

    try {
        return  timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    } catch (error) {
        return false
    }

}

export async function GET(request: Request){
    
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];

    if (!isValidSecret(secret)) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const {searchParams} = new URL(request.url);

    const workflowId = searchParams.get("workflowId") as string;

    if (!workflowId) {
        return Response.json({ error: "Bad request" }, { status: 400 });
    }

    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId }
    });

    if (!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 400 });
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;

    if (!executionPlan) {
        return Response.json({ error: "Workflow execution plan not found" }, { status: 400 });
    }

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId: workflowId,
            userId: workflow.userId,
            definition: workflow.definitions,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: workflowExecutionTrigger.CRON,
            phases: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.map((node) => {
                        return {
                            userId: workflow.userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        }
                    })
                })
            }
        }
    })

    await ExecuteWorkflow(execution.id);

    return new Response(null, { status: 200 });
}