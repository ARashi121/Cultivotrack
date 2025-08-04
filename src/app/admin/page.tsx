
"use client";

import { MainLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || user?.role !== 'admin') {
        return (
             <MainLayout>
                <div className="flex items-center justify-center flex-1">
                    <p>Loading or unauthorized...</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
                        <ShieldCheck className="mr-2 h-8 w-8 text-primary"/>
                        Admin Dashboard
                    </h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, Admin!</CardTitle>
                        <CardDescription>This is the admin control panel. More features coming soon!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>You have full access to all features of the application.</p>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}
