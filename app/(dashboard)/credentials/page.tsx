
import { getCredentialsForUser } from '@/actions/credentials/getCredentialsForUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldIcon, ShieldOffIcon } from 'lucide-react'
import React, { Suspense } from 'react'
import CreateCredentialDialog from './_components/CreateCredentialDialog'

function CredentialsPage() {
  return (
    <div className='flex flex-1 flex-col h-full'>
        <div className='flex justify-between'>
            <div className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Credentials</h1>
                <p className='text-muted-foreground'>Manage your Credentials</p>
            </div>
            <CreateCredentialDialog />
        </div>
        <div className='h-full py-6 sapce-y-8'>
            <Alert>
                <ShieldIcon className='h-4 w-4 stroke-primary' />
                <AlertTitle className='text-primary'>Encryption</AlertTitle>
                <AlertDescription>All information is securely encrypted, ensuring your data remains safe</AlertDescription>
            </Alert>

            <Suspense fallback={<Skeleton className='h-[300px] w-full' />}>
                <UserCredentials />
            </Suspense>
        </div>
    </div>
  )
}

export default CredentialsPage


async function UserCredentials() {

    const credentials = await getCredentialsForUser();

    if (!credentials) {
        return <div>No Credentials found</div>
    }

    if (credentials.length === 0) {
        return <Card className='w-full p-4'>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                    <ShieldOffIcon size={40} className='stroke-primary' />
                </div>
                <div className='flex flex-col items-center gap-1'>
                    <p className='text-bold'>No credentials created yet</p>
                    <p className='text-muted-foreground text-sm'>Create your first credential to get started</p>
                </div>

                <CreateCredentialDialog triggerText='Create Credential' />
            </div>
        </Card>
    }

    return <div>User Credentials</div>
}