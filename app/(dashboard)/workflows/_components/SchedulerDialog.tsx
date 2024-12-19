"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CalendarIcon, TriangleAlertIcon } from 'lucide-react'
import React from 'react'

function SchedulerDialog() {
  return <Dialog>
    <DialogTrigger asChild>
        <Button variant={"link"} size='sm' className={cn("text-sm p-0 h-auto")}>
            <div className='flex items-center gap-1'>
                <TriangleAlertIcon className='h-3 w-3' /> Set schedule
            </div>
        </Button>
    </DialogTrigger>
    <DialogContent className='px-0'>
        <CustomDialogHeader title='Schedule workflow execution' icon={CalendarIcon} />
        <div className='p-6 space-y-4'>
            <p className='text-sm text-muted-foreground'>
                Schedule this workflow to run at a specific time. You can set the schedule to run once or on a recurring basis.
            </p>
            <Input placeholder='E.g *****' />
        </div>
        <DialogFooter className='px-6 gap-3'>
            <DialogClose asChild>
                <Button variant='secondary' className='w-full'>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button  className='w-full'>Save</Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
  </Dialog>
}

export default SchedulerDialog