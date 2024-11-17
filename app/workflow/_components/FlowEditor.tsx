'use client'

import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useEffect } from 'react'

import "@xyflow/react/dist/style.css"
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import NodeComponent from './nodes/NodeComponent'
import { set } from 'date-fns'

const nodeTypes = {
    NexCrawlNode: NodeComponent,
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

function FlowEditor({workflow}: {workflow: Workflow}) {

    const [nodes, setNodes, onNotesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const {setViewport} = useReactFlow();

    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definitions);
            if (!flow) {
                return;
            }
            setNodes(flow.nodes || []) 
            setEdges(flow.edges || [])
            if (!flow.viewport) return;
            const {x=0,y=0, zoom=1} = flow.viewport;
            setViewport({x,y,zoom})
        } catch (error) {
            
        }
    }, [workflow.definitions, setEdges, setNodes, setViewport])

  return <main className='h-full w-full'>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNotesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            snapToGrid
            snapGrid={snapGrid}
            fitViewOptions={fitViewOptions}
        // add fitView if want to reset to the fit screen when f5
        >
            <Controls position='top-left' fitViewOptions={fitViewOptions} />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
  </main>
}

export default FlowEditor