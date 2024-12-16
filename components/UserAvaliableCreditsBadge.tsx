"use client"

import { GetAvaliableCredits } from '@/actions/billing/getAvaliableCredits'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { CoinsIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ReactCountUpWrapper from './ReactCountUpWrapper'
import { buttonVariants } from './ui/button'

function UserAvaliableCreditsBadge() {
    const query = useQuery({
        queryKey: ["user-avaliable-credits"],
        queryFn: () => GetAvaliableCredits(),
        refetchInterval: 30 * 1000, // 30 s
    })
    return <Link href={"/billing"} className={cn("w-full space-x-2 items-center",

        buttonVariants({ variant: "outline" })
    )}>
        <CoinsIcon size={20} className='text-primary' />
        <span className='font-semibold capitalize'>
            {query.isLoading && <Loader2Icon className='h-4 w-4 animate-spin' />}
            {!query.isLoading && query.data && <ReactCountUpWrapper value={query.data} />}
            {!query.isLoading && !query.data && "-"}
        </span>
    </Link>
}

export default UserAvaliableCreditsBadge