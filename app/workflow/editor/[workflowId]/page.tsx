
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import Editor from '../../_components/Editor';

async function page({params} : {params: {workflowId: string}}) {

    const { workflowId } = params;
    const {userId} = auth()

    if (!userId) {
        return <div>
            <h1>Not logged in</h1>
        </div>
    }
    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        }
    })

    if (!workflow) {
        return <div>
            <h1>Workflow not found</h1>
        </div>
    }

  return <Editor workflow={workflow} />
}

export default page