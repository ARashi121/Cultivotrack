
import { PlantCard } from '@/components/plant-card';
import { MainLayout } from '@/components/layout';
import { getPlants } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  const plants = getPlants().filter(p => p.type === 'tc');

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            TC Plants
          </h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
