
"use client"

import { useState, useMemo } from 'react';
import { PlantCard } from '@/components/plant-card';
import { MainLayout } from '@/components/layout';
import { getPlants } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter, PlusCircle, Search, Upload } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Plant } from '@/lib/types';
import Link from 'next/link';
import { SpreadsheetUploadDialog } from '@/components/spreadsheet-upload-dialog';

const allPlants = getPlants().filter(p => p.type === 'tc');

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const filteredPlants = useMemo(() => {
    let plants = allPlants;

    if (searchTerm) {
      plants = plants.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange?.from && dateRange?.to) {
        plants = plants.filter(plant => {
            if (plant.subcultureHistory.length === 0) return false;
            // Get the most recent subculture date
            const lastSubcultureDate = new Date(Math.max(...plant.subcultureHistory.map(h => new Date(h.date).getTime())));
            return lastSubcultureDate >= dateRange.from! && lastSubcultureDate <= dateRange.to!;
        });
    }

    return plants;
  }, [searchTerm, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange(undefined);
  }

  const handleUploadSuccess = () => {
    setIsUploadDialogOpen(false);
    // Here you would typically trigger a data refresh
    // For now, we just close the dialog.
  }
  
  return (
    <MainLayout>
       <SpreadsheetUploadDialog 
        isOpen={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handleUploadSuccess}
      />
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            TC Plants
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import from Sheet
            </Button>
            <Link href="/subculture/new">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Subculture
                </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by plant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                />
            </div>
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <div className="p-4 space-y-2">
                        <h4 className="font-medium leading-none">Filter by Date</h4>
                        <p className="text-sm text-muted-foreground">
                            Show plants last subcultured within a date range.
                        </p>
                    </div>
                     <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                      />
                      <div className="p-4 flex justify-end gap-2 border-t">
                          <Button variant="ghost" onClick={() => setDateRange(undefined)}>Clear</Button>
                          <Button disabled={!dateRange} onClick={() => {
                              // Popover closes on button click, so just having the value is enough
                          }}>Apply</Button>
                      </div>
                </PopoverContent>
            </Popover>
        </div>
        
        {(searchTerm || dateRange) && (
             <div className="flex items-center gap-2 text-sm mb-4">
                <span>Filtered by:</span>
                {searchTerm && <span className="bg-muted px-2 py-1 rounded-md">Name: "{searchTerm}"</span>}
                {dateRange?.from && <span className="bg-muted px-2 py-1 rounded-md">Date: {format(dateRange.from, "LLL dd, y")} - {dateRange.to ? format(dateRange.to, "LLL dd, y") : '...'}</span>}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary">Clear all</Button>
            </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <p className="text-lg font-semibold">No plants found</p>
                <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
