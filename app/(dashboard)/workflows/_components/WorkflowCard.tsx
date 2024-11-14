'use client';

import { Card, CardContent } from '@/components/ui/card'

import { FileTextIcon, MoreVerticalIcon, PlayIcon, ShuffleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react'
import { Workflow } from '@prisma/client';
import { WorkflowStatus } from '@/types/workflow';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TooltipWrapper from '@/components/TooltipWrapper';


const statusColors = {
    [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
    [WorkflowStatus.PUBLISHED]: 'bg-primary',
}

function WorkflowCard({ workflow }: { workflow: Workflow}) {

    const isDraft = workflow.status === WorkflowStatus.DRAFT;

    return <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30'>
        <CardContent className='p-4 flex items-center justify-between h-[100px]'>
            <div className='flex items-center justify-end space-x-3'>
                <div className={cn("w-10 h-10 rounded-full flex items-center  justify-center", statusColors[workflow.status as WorkflowStatus])}>
                    {isDraft ? <FileTextIcon className='text-white' /> : <PlayIcon className='text-white' />}
                </div>
                <div>
                    <h3 className='text-base font-bold text-muted-foreground flex items-center'>
                        <Link href={`/workflow/editor/${workflow.id}`}
                            className='flex items-center hover:underline'
                        >
                            {workflow.name}
                        </Link>
                        {isDraft && <span className='px-2 ml-2 bg-yellow-200 font-medium py-0.5 rounded-full'>Draft</span>}
                    </h3>
                    {/* <p className='text-sm text-muted-foreground'>{workflow.description}</p> */}
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                    <Link href={`/workflow/editor/${workflow.id}`}
                            className={cn(buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                            }),
                            "flex items-center gap-2"
                        )}
                        >
                            <ShuffleIcon size={16} />
                            Edit
                    </Link>
                    <WorkflowActions />
            </div>
        </CardContent>
    </Card>
}

function WorkflowActions() {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
                <TooltipWrapper content={"More Actions"}>
                    <MoreVerticalIcon size={18} />
                </TooltipWrapper>
                
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuContent>
    </DropdownMenu>
}

export default WorkflowCard