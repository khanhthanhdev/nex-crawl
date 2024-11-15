'use client'

import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import React from 'react'

import "@xyflow/react/dist/style.css"

function FlowEditor({workflow}: {workflow: Workflow}) {

    const [nodes, setNodes, onNotesChange] = useNodesState([
        {
            id: '1',
            position: { x: 0, y: 0 },
            data: { 
                label: 'example' 
            },
        },
    ])

    const [edges, setEdges, onEdgesChange] = useEdgesState([])

  return <main className='h-full w-full'>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNotesChange}
            onEdgesChange={onEdgesChange}
        >
            <Controls position='top-left' />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
  </main>
}

export default FlowEditor