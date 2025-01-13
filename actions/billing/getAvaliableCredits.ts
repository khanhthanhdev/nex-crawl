"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GetAvaliableCredits() {
    const { userId } = auth()
    if (!userId) {
        throw new Error("User not found")
    }

    const balance = await prisma.userBalance.findUnique({
        where: { userId }
    })
    if (!balance) return -1;
    return balance.credits
}