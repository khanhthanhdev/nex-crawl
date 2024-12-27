'use client'
import React from 'react'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';



interface Props {
    children: React.ReactNode;
    content: React.ReactNode;
    side ?: "top" | "bottom" | "left" | "right";
}

function TooltipWrapper(props: Props) {

  if (!props.content) {
    return props.children
  }

  return <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger asChild>{props.children}</TooltipTrigger>
            <TooltipContent side={props.side}>{props.content}</TooltipContent>
        </Tooltip>
  </TooltipProvider>

}

export default TooltipWrapper