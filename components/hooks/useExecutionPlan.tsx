import { FlowExecutionPlan, FlowToExecutionPlanValidationError } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react"
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";
import { clear } from "console";

const useExecutionPlan = () => {
    const {toObject} = useReactFlow();
    const {setInvalidInputs, clearErrors} = useFlowValidation()

    const handleError = useCallback((error: any) => {
        switch(error.type){
            case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
                toast.error("No entry point found");
                break;
            case FlowToExecutionPlanValidationError.INVALID_INPUTS:
                toast.error("Invalid inputs found");
                setInvalidInputs(error.invalidElements);
                break;
            default:
                toast.error("An error occured");
                break;
        }
    }, [])

    const generateExecutionPlan = useCallback(() => {
        const {nodes, edges} = toObject();
        const {executionPlan,error} = FlowExecutionPlan(nodes as AppNode[], edges);


        if(error){
            handleError(error);
            return null;
        }
        clearErrors();
        return executionPlan
    }, [toObject, handleError, clearErrors])
    return generateExecutionPlan
}

export default useExecutionPlan