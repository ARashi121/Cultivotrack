
"use client"

import { MainLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getHardeningData } from "@/lib/mock-data";
import { HardeningEvent } from "@/lib/types";
import { ArrowRight, CheckCircle, Package, PackageCheck, ThermometerSnowflake, TrendingUp } from "lucide-react";

export default function HardeningPage() {
    const hardeningData = getHardeningData();
    const activeHardening = hardeningData.filter(h => h.stage === 'acclimatizing' || h.stage === 'growing');
    const exportedHardening = hardeningData.filter(h => h.stage === 'exported');
    
    const inventoryCount = activeHardening.reduce((acc, h) => acc + h.transferredCount, 0);

    const getStageIcon = (stage: HardeningEvent['stage']) => {
        switch (stage) {
            case 'acclimatizing': return <div className="flex items-center gap-2"><ThermometerSnowflake className="h-4 w-4 text-blue-500" /><span className="text-blue-500">Acclimatizing</span></div>;
            case 'growing': return <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-green-600">Growing</span></div>;
            case 'exported': return <div className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Exported</span></div>;
        }
    }

    return (
        <MainLayout>
             <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Hardening & Acclimatization
                    </h1>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In-Hardening Inventory</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inventoryCount.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">plants currently in hardening</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Hardening Batches</CardTitle>
                        <CardDescription>Plants currently in the acclimatization or growth phase.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plant</TableHead>
                                    <TableHead>Transfer Date</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Current Stage</TableHead>
                                    <TableHead>Success Rate</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeHardening.length > 0 ? activeHardening.map(h => (
                                    <TableRow key={h.id}>
                                        <TableCell className="font-medium">{h.plantName}</TableCell>
                                        <TableCell>{h.dateTransferred}</TableCell>
                                        <TableCell>{h.transferredCount}</TableCell>
                                        <TableCell>{getStageIcon(h.stage)}</TableCell>
                                        <TableCell>
                                            {h.stage === 'acclimatizing' && (h.acclimatizationSuccessRate ? `${(h.acclimatizationSuccessRate * 100).toFixed(0)}%` : 'N/A')}
                                            {h.stage === 'growing' && (h.growthSuccessRate ? `${(h.growthSuccessRate * 100).toFixed(0)}%` : 'N/A')}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            {h.stage === 'acclimatizing' && <Button size="sm" variant="outline">Move to Growth <ArrowRight className="ml-2 h-4 w-4"/></Button>}
                                            {h.stage === 'growing' && <Button size="sm" variant="outline">Record Export <PackageCheck className="ml-2 h-4 w-4"/></Button>}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={6} className="text-center">No active hardening batches.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Export History</CardTitle>
                        <CardDescription>Record of all plants that have been exported or used.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plant</TableHead>
                                    <TableHead>Export Date</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Final Success %</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exportedHardening.length > 0 ? exportedHardening.map(h => (
                                    <TableRow key={h.id}>
                                        <TableCell className="font-medium">{h.plantName}</TableCell>
                                        <TableCell>{h.dateExported}</TableCell>
                                        <TableCell>{h.transferredCount}</TableCell>
                                        <TableCell>{h.exportedTo}</TableCell>
                                        <TableCell><Badge variant="secondary">{h.growthSuccessRate ? `${(h.growthSuccessRate * 100).toFixed(0)}%` : 'N/A'}</Badge></TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={5} className="text-center">No export history.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </MainLayout>
    );
}
