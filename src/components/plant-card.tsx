import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plant } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={plant.photoUrl}
            alt={`Photo of ${plant.name}`}
            fill
            className="object-cover"
            data-ai-hint={`${plant.name}`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-1">{plant.name}</CardTitle>
        <CardDescription className="italic text-muted-foreground mb-2">{plant.scientificName}</CardDescription>
        <p className="text-sm text-foreground/80 line-clamp-3">{plant.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/plants/${plant.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
