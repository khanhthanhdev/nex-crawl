import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

type FlowExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
}

export function FlowExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowExecutionPlanType {

    const entryPoint = nodes.find(node => TaskRegistry[node.data.type].isEntryPoint);

    if (!entryPoint) {
        throw new Error('Entry point not found');
    }

    const planned = new Set<string>();

    const executionPlan: WorkflowExecutionPlan = [
        {
        phase: 1,
        nodes: [entryPoint],
    },

];

    for (let phase = 2; phase <= nodes.length || planned.size < nodes.length; phase++) {
        const nextPhase: WorkflowExecutionPlanPhase = {phase, nodes: []};
        for (const currentNode of nodes) {
            if (planned.has(currentNode.id)) continue;

            const invalidInputs = getInvalidInputs(currentNode, edges, planned);
            if(invalidInputs.length > 0){
                const incomers = getIncomers(currentNode, nodes, edges);
                if(incomers.every((incomer) => planned.has(incomer.id))){
                    
                    console.log('invalid inputs', currentNode.id, invalidInputs );
                    throw new Error('Invalid inputs');
                } else {
                    continue;
                }
            }

            nextPhase.nodes.push(currentNode);
            planned.add(currentNode.id);
        }
    }

    return { executionPlan }
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;
        if (inputValueProvided) {
            continue;
        }

        const incomingEdges = edges.filter((edge) => edge.target === node.id);

        const inputLinkedByOutput = incomingEdges.find(
            (edge) => edge.targetHandle === input.name
        )

        const requireInputProvidedByVisitedOutput = input.required && inputLinkedByOutput && planned.has(inputLinkedByOutput.source);
        
        if(requireInputProvidedByVisitedOutput){
            continue;
        } else if (!input.required) {
            if (!inputLinkedByOutput) {
                continue;
            }
            if(inputLinkedByOutput && planned.has(inputLinkedByOutput.source)){
                continue;
            }
        }
        invalidInputs.push(input.name);

    }
    return invalidInputs;
}