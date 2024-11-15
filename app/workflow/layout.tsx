
'use client'
import Logo from '@/components/Logo'
import { ModeToggle } from '@/components/ModeToggle'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className='flex flex-col w-full h-screen'
        >
            {children}
            <Separator />
            <header className='flex items-center justify-between p-2'>
                <Logo iconSize={16} fontSize='text-xl' />
                <ModeToggle />
            </header>
        </div>
    )
}

export default layout