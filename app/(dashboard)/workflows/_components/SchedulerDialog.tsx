"use client"

import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import cronstrue from 'cronstrue';
import parser from "cron-parser"
import { RemoveWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule'
import { Separator } from '@/components/ui/separator'

function SchedulerDialog(props: { workflowId: string, cron: string | null }) {

    const [cron, setCron] = useState(props.cron || "")
    const [validCron, setValidCron] = useState(false)
    const [readableCron, setReadableCron] = useState('')

    const mutation = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: () => {
            toast.success('Workflow scheduled successfully', { id: "cron" })
        },
        onError: () => {
            toast.error('Failed to schedule workflow', { id: "cron" })
        }
    });

    const removeScheduleMutation = useMutation({
        mutationFn: RemoveWorkflowSchedule,
        onSuccess: () => {
            toast.success('Workflow scheduled successfully', { id: "cron" })
        },
        onError: () => {
            toast.error('Failed to schedule workflow', { id: "cron" })
        }
    });



    useEffect(() => {
        try {
            parser.parseExpression(cron);
            const humanCronStr = cronstrue.toString(cron);
            setValidCron(true);
            setReadableCron(humanCronStr);
        } catch (error) {
            setValidCron(false)
        }
    }, [cron]);

    const workflowHasValidCron = props.cron && props.cron.length > 0;

    const readableSavedIcon = workflowHasValidCron && cronstrue.toString(props.cron!);

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant={"link"} size='sm' className={cn("text-sm p-0 h-auto text-orange-500",

                workflowHasValidCron && "text-primary"
            )}>
                {workflowHasValidCron && <div className='flex items-center gap-2'>
                    <ClockIcon /> {readableSavedIcon}
                </div>}

                {!workflowHasValidCron && (
                    <div className='flex items-center gap-1'>
                        <TriangleAlertIcon className='h-3 w-3' /> Set schedule
                    </div>
                )}

            </Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader title='Schedule workflow execution' icon={CalendarIcon} />
            <div className='p-6 space-y-4'>
                <p className='text-sm text-muted-foreground'>
                    Schedule this workflow to run at a specific time. You can set the schedule to run once or on a recurring basis.
                </p>
                <Input
                    placeholder='E.g * * * * *'
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                />

                <div className={cn("bg-accent rounded-md p-4 border text-sm border-destructive text-destructive", validCron && "border-primary text-primary")}>
                    {validCron ? readableCron : "Not a valid cron expression"}
                </div>

                {workflowHasValidCron && <DialogClose asChild>
                        <div className="">
                            <Button className='w-full text-destructive border-destructive hover:text-destructive'
                            variant={"outline"}
                            disabled={
                                mutation.isPending || removeScheduleMutation.isPending
                            }
                            onClick={() => {
                                toast.loading('Removing schedule...', { id: "cron" })
                                removeScheduleMutation.mutate(props.workflowId)
                            }}
                            >
                                Remove schedule
                            </Button>
                            <Separator className='my-4' />
                        </div>
                    </DialogClose>}
            </div>
            <DialogFooter className='px-6 gap-3'>
                <DialogClose asChild>
                    <Button variant='secondary' className='w-full'>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button className='w-full'
                        disabled={mutation.isPending || !validCron}

                        onClick={() => {
                            toast.loading('Scheduling workflow...', { id: "cron" })
                            mutation.mutate({ id: props.workflowId, cron })
                        }}
                    >Save</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default SchedulerDialog