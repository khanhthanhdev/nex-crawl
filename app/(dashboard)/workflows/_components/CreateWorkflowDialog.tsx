'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Layers2Icon } from 'lucide-react';
import React from 'react'

function CreateWorkflowDialog({triggerText} : {triggerText?: string}) {

    const [open, setOpen] = React.useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    
        <DialogTrigger asChild>
            <Button>
                {triggerText ?? "Create Workflow"}
            </Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader
                icon={Layers2Icon}
                title="Create Workflow"
                subTitle="Create a new workflow"
            />
        </DialogContent>
    
    </Dialog>
  
}

export default CreateWorkflowDialog