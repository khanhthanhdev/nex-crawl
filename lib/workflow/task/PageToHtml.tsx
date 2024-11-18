import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: 'Get HTML from page',
    icon: (props: LucideProps) => (<CodeIcon className="stroke-rose-400" {...props}/>),
    isEntryPoint: false,
    inputs: [
        {
            name: "Website URL",
            type: TaskParamType.BROWSER_INSTANCE,

        required: true,

        }
    ]
}