'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Layers2Icon, Loader2, ShieldEllipsis, ShieldEllipsisIcon } from 'lucide-react';
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential';
import { CreateCredential } from '@/actions/credentials/createCredential';


function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {

    const [open, setOpen] = React.useState(false);

    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {},
    });

    const { mutate, isPending } = useMutation(
        {
            mutationFn: CreateCredential,
            onSuccess: () => {
                toast.success("Credential created successfully", { id: "create-credential" });
                form.reset();
                setOpen(false);
            },
            onError: () => {
                toast.error("Failed to create Credential", { id: "create-credential" })
            },
        }
    )

    const onSubmit = useCallback((values: createCredentialSchemaType) => {
        toast.loading("Creating credential...", { id: "create-credential" })
        mutate(values);
    },[mutate])

    return <Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger asChild>
            <Button>
                {triggerText ?? "Create Credential"}
            </Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader
                icon={ShieldEllipsis}
                title="Create Credential"
                subTitle="Create a new credential"
            />
            <div className='p-6'>
                <Form {...form}>
                    <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 items-center'>
                                        Name
                                        <p className='text-xs text-primary'>
                                            (required)
                                        </p>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter a name for your credential
                                        <hr />
                                        This name will be used to identify the credential
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >

                        </FormField>

                        <FormField
                            control={form.control}
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 items-center'>
                                        Value
                                        <p className='text-xs text-primary'>
                                            (required)
                                        </p>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea className='resize-none' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the value for your credential
                                        <hr />
                                        This value will be used to authenticate the credential
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <Button type='submit' className='w-full' disabled={isPending}>
                            {!isPending && "Create Credential"}
                            {isPending && <Loader2 className='animate-spin' />}
                        </Button>
                    </form>
                </Form>
            </div>
        </DialogContent>

    </Dialog>

}

export default CreateCredentialDialog