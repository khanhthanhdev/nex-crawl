import { useReactFlow } from "@xyflow/react"
import { useCallback } from "react";

const useExecutionPlan = () => {
    const {toObject} = useReactFlow();

    const generateExecutionPlan = useCallback(() => {
        const {nodes, edges} = toObject();
        const result = FlowExecutionPlan(nodes, edges);

    }, [toObject])
    return generateExecutionPlan
}

export default useExecutionPlan