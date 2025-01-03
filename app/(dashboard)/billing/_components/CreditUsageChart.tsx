"use client";

import { GetCreditUsageInPeriod } from '@/actions/analytics/getCreditUsageInPeriod';
import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartColumnStackedIcon, Layers2 } from 'lucide-react';
import React from 'react'
import { AreaChart, Area, CartesianGrid, XAxis, BarChart, Bar } from 'recharts';

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;

const chartConfig = {
    success: {
        label: "Successfull Phases Credits",
        color: "hsl(var(--chart-2))"
    },
    failed: {
        label: "Failed Phases Credits",
        color: "hsl(var(--chart-1))"
    }
}

function ExecutionStatusChart({ data, title, description }: { data: ChartData, title: string, description: string }) {
    return <Card>
        <CardHeader>
            <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                <ChartColumnStackedIcon className='w-6 h-6 text-primary' />
                {title}
            </CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className='max-h-[200px] w-full'>
                <BarChart data={data} height={200}
                    accessibilityLayer
                    margin={{ top: 20 }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={"date"} tickLine={false}
                        axisLine={false} tickMargin={8}
                        minTickGap={32} tickFormatter={value => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        }}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <ChartTooltip content={<ChartTooltipContent className='w-[250px]' />} />
                    <Bar 
                        radius={[0,0,4,4]}
                        dataKey={"success"}
                        fill='var(--color-success)'
                        fillOpacity={0.8}
                        stroke='var(--color-success)'
                        stackId={"a"}
                    />
                    <Bar 
                        radius={[4,4,0,0]}
                        dataKey={"failed"}
                        // fill='var(--color-failed)'
                        fillOpacity={0.6}
                        // stroke='var(--color-failed)'
                        stackId={"a"}
                    />
                </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
}

export default ExecutionStatusChart