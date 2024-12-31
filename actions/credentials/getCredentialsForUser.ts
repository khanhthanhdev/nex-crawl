"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCredentialsForUser() {
    const {userId} = auth()

    if (!userId) {
        throw new Error('User not found')
    }

    return prisma.credential.findMany({
        where: {userId},
        orderBy: {createdAt: 'asc'}
    })
}