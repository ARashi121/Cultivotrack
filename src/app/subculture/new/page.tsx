
"use client"

import { MainLayout } from "@/components/layout";
import { SubcultureForm } from "@/components/subculture-form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { FilePlus2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewSubculturePage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();

    const handleFormSuccess = () => {
        toast({
            title: "Subculture Event Logged",
            description: "The new subculture event has been successfully recorded.",
        });
        router.push('/');
    }

    return (
        <MainLayout>
            <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
                        <FilePlus2 className="mr-2 h-8 w-8 text-primary"/>
                        Log New Subculture Event
                    </h1>
                </div>
                <div className="max-w-2xl mx-auto">
                     <SubcultureForm onSuccess={handleFormSuccess} />
                </div>
            </div>
        </MainLayout>
    )
}
