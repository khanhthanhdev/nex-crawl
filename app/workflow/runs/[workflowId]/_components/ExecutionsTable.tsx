"use client"

import { GetWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { DatesToDurationString } from '@/lib/helper/dates';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>

function ExecutionsTable({
    workflowId,
    initialData
}: {
    workflowId: string;
    initialData: InitialDataType
}) {

    const query = useQuery({
        queryKey: ["executions", workflowId],
        queryFn: () => GetWorkflowExecutions(workflowId),
        initialData,
        refetchInterval: 5000
    })

  return <div className='border rounded-lg shadow-md overflow-auto'>
    <Table className='bg-muted'>
        <TableHeader className='bg-muted'>
            <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className='text-right text-xs text-muted-foreground'>Started at </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody className='gap-2 h-full overflow-auto'>
            {query.data.map((execution) => {
                const duration = DatesToDurationString(execution.completedAt, execution.startedAt)

                return <TableRow key={execution.id}>
                    <TableCell>
                        <div className='flex flex-col'>
                            <span className='font-semibold'>
                                {execution.id}
                            </span>
                            <div className="text-muted-foreground text-xs">
                                <span>Triggered via</span>
                                <Badge variant={"outline"} className=''>{execution.trigger}</Badge>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div>
                            <div>{execution.status}</div>
                            <div>{duration}</div>
                        </div>
                    </TableCell>
                    
                </TableRow>
            })}
        </TableBody>
    </Table>
  </div>
}

export default ExecutionsTable