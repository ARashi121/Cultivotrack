import { getPlantById } from '@/lib/mock-data';
import { MainLayout } from '@/components/layout';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContaminationAnalyzer } from '@/components/contamination-analyzer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PlantDetailPage({ params }: { params: { id: string } }) {
  const plant = getPlantById(params.id);

  if (!plant) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <Card className="overflow-hidden">
                <div className="relative w-full h-96">
                   <Image
                    src={plant.photoUrl}
                    alt={`Photo of ${plant.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={`${plant.name}`}
                   />
                </div>
                <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">{plant.type === 'tc' ? 'TC Plant' : 'Protocol Development'}</Badge>
                    <CardTitle className="font-headline text-4xl">{plant.name}</CardTitle>
                    <CardDescription className="italic text-lg">{plant.scientificName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{plant.description}</p>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
             <Tabs defaultValue="subculture" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subculture">Subculture</TabsTrigger>
                <TabsTrigger value="hardening">Hardening</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="subculture">
                <Card>
                  <CardHeader>
                    <CardTitle>Subculture History</CardTitle>
                    <CardDescription>Records of all subculturing events for this plant.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href="/subculture/new" className="w-full">
                      <Button className="w-full bg-primary/90 hover:bg-primary">Add New Subculture Event</Button>
                    </Link>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Explants</TableHead>
                          <TableHead>Media</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plant.subcultureHistory.length > 0 ? plant.subcultureHistory.map(event => (
                          <TableRow key={event.id}>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.explantCount}</TableCell>
                            <TableCell><Badge variant="secondary">{event.media}</Badge></TableCell>
                          </TableRow>
                        )) : (
                          <TableRow><TableCell colSpan={3} className="text-center">No subculture history.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hardening">
                 <Card>
                  <CardHeader>
                    <CardTitle>Hardening History</CardTitle>
                    <CardDescription>Records of transfers to ex-vitro conditions.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-primary/90 hover:bg-primary">Add New Hardening Event</Button>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Transferred</TableHead>
                          <TableHead>Survival %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                         {plant.hardeningHistory.length > 0 ? plant.hardeningHistory.map(event => (
                          <TableRow key={event.id}>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.transferredCount}</TableCell>
                            <TableCell>{event.survivalRate * 100}%</TableCell>
                          </TableRow>
                        )) : (
                           <TableRow><TableCell colSpan={3} className="text-center">No hardening history.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analysis">
                <ContaminationAnalyzer />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
