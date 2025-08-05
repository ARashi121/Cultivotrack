
import Link from 'next/link';
import Image from 'next/image';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface PlantListItemProps {
  plant: Plant;
}

export function PlantListItem({ plant }: PlantListItemProps) {
    const lastSubcultureDate = plant.subcultureHistory.length > 0
        ? new Date(Math.max(...plant.subcultureHistory.map(h => new Date(h.date).getTime())))
        : null;

  return (
    <TableRow>
        <TableCell>
            <Badge variant="outline" className="font-mono">{plant.code}</Badge>
        </TableCell>
        <TableCell>
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-md overflow-hidden hidden sm:block">
                     <Image
                        src={plant.photoUrl}
                        alt={`Photo of ${plant.scientificName}`}
                        fill
                        className="object-cover"
                        data-ai-hint={`${plant.name}`}
                    />
                </div>
                <div>
                    <div className="font-medium">{plant.scientificName}</div>
                    <div className="text-sm text-muted-foreground italic">{plant.name}</div>
                </div>
            </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
            {lastSubcultureDate ? format(lastSubcultureDate, 'PPP') : 'N/A'}
        </TableCell>
        <TableCell className="text-right">
            <Link href={`/plants/${plant.id}`}>
                <Button variant="outline" size="sm">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </TableCell>
    </TableRow>
  );
}

