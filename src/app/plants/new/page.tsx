
"use client"

import { MainLayout } from "@/components/layout";
import { PlantForm } from "@/components/plant-form";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewPlantPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleFormSuccess = (plantType: 'tc' | 'development') => {
        toast({
            title: "Plant Created",
            description: "The new plant has been successfully added to the system.",
        });
        const destination = plantType === 'tc' ? '/' : '/protocol-development';
        router.push(destination);
    }

    return (
        <MainLayout>
            <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
                        <Sprout className="mr-2 h-8 w-8 text-primary"/>
                        Add New Plant
                    </h1>
                </div>
                <div className="max-w-2xl mx-auto">
                     <PlantForm onSuccess={handleFormSuccess} />
                </div>
            </div>
        </MainLayout>
    )
}
