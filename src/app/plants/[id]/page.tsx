

"use client"

import { getPlantById } from '@/lib/mock-data';
import { MainLayout } from '@/components/layout';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContaminationAnalyzer } from '@/components/contamination-analyzer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubcultureForm } from '@/components/subculture-form';
import { ProtocolDevelopmentForm } from '@/components/protocol-development-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Calendar, Microscope, FlaskConical, Beaker, FileText, CheckCircle, XCircle, Clock, Dna } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

export default function PlantDetailPage() {
  const params = useParams();
  const plant = getPlantById(params.id as string);
  const [isSubcultureDialogOpen, setIsSubcultureDialogOpen] = useState(false);
  const [isExperimentDialogOpen, setIsExperimentDialogOpen] = useState(false);
  const [isExperimentSubcultureDialogOpen, setIsExperimentSubcultureDialogOpen] = useState(false);
  const { user } = useAuth();


  if (!plant) {
    notFound();
  }

  const handleSubcultureSuccess = () => {
    setIsSubcultureDialogOpen(false);
    // Here you might want to refresh the subculture history data
  }

  const handleExperimentSubcultureSuccess = () => {
    setIsExperimentSubcultureDialogOpen(false);
    // Here you might want to refresh the subculture history data
  }

  const handleExperimentSuccess = () => {
    setIsExperimentDialogOpen(false);
    // Here you might want to refresh the experiment data
  }

  const getStatusIcon = (status: 'ongoing' | 'success' | 'failed') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'ongoing':
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const tabs = plant.type === 'tc'
    ? [
        { value: 'subculture', label: 'Subculture' },
        { value: 'analysis', label: 'Analysis' },
      ]
    : [
        { value: 'experiments', label: 'Experiments' },
        { value: 'analysis', label: 'Analysis' },
      ];

  const defaultTab = plant.type === 'tc' ? 'subculture' : 'experiments';

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
             <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
                {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
              </TabsList>
              
              {plant.type === 'tc' && (
                <>
                  <TabsContent value="subculture">
                    <Card>
                      <CardHeader>
                        <CardTitle>Subculture History</CardTitle>
                        <CardDescription>Records of all subculturing events for this plant.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Dialog open={isSubcultureDialogOpen} onOpenChange={setIsSubcultureDialogOpen}>
                          <DialogTrigger asChild>
                             <Button className="w-full bg-primary/90 hover:bg-primary">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add New Subculture Event
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Log New Subculture Event</DialogTitle>
                              <DialogDescription>
                                Enter the details for the new subculture event for {plant.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <SubcultureForm plantId={plant.id} onSuccess={handleSubcultureSuccess} />
                          </DialogContent>
                        </Dialog>

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
                </>
              )}

              {plant.type === 'development' && (
                <TabsContent value="experiments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Protocol Experiments</CardTitle>
                            <CardDescription>Tracking iterations of protocol development.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Dialog open={isExperimentDialogOpen} onOpenChange={setIsExperimentDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-primary/90 hover:bg-primary">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add New Experiment
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                    <DialogTitle>Log New Experiment</DialogTitle>
                                    <DialogDescription>
                                        Enter the details for a new experiment for {plant.name}.
                                    </DialogDescription>
                                    </DialogHeader>
                                    <ProtocolDevelopmentForm plantId={plant.id} onSuccess={handleExperimentSuccess} />
                                </DialogContent>
                            </Dialog>

                            {plant.protocolExperiments && plant.protocolExperiments.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {plant.protocolExperiments.sort((a,b) => b.iteration - a.iteration).map(exp => (
                                        <AccordionItem value={`item-${exp.id}`} key={exp.id}>
                                            <AccordionTrigger>
                                                <div className="flex justify-between w-full pr-4">
                                                  <span className="font-semibold">Iteration {exp.iteration}</span>
                                                  <div className="flex items-center gap-2">
                                                    {getStatusIcon(exp.status)}
                                                    <span className="capitalize text-sm text-muted-foreground">{exp.status}</span>
                                                  </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-4 p-2">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-primary" /> <strong>Inoculation:</strong> {format(new Date(exp.inoculationDate), "PPP")}</div>
                                                    <div className="flex items-start gap-2 text-sm"><Beaker className="h-4 w-4 text-primary mt-1" /> <div><strong>Sterilization:</strong> {exp.sterilisationProcedure}</div></div>
                                                    <div className="flex items-start gap-2 text-sm"><FlaskConical className="h-4 w-4 text-primary mt-1" /> <div><strong>Inoculation Media:</strong> {exp.inoculationMedia}</div></div>
                                                    <div className="flex items-start gap-2 text-sm"><FileText className="h-4 w-4 text-primary mt-1" /> <div><strong>Notes:</strong> {exp.notes || 'N/A'}</div></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Microscope className="h-4 w-4 text-primary" />Observations</h4>
                                                    {exp.observations.length > 0 ? (
                                                        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                                                          {exp.observations.map(obs => (
                                                            <div key={obs.id} className="text-sm">
                                                              <p><strong>{format(new Date(obs.date), "PPP")}:</strong> <Badge variant="secondary" className="capitalize">{obs.observation}</Badge></p>
                                                              {obs.notes && <p className="text-muted-foreground pl-2 italic">"{obs.notes}"</p>}
                                                              {obs.imageUrl && <div className="mt-2"><Image src={obs.imageUrl} alt="Observation" width={200} height={150} className="rounded-md border"/></div>}
                                                            </div>
                                                          ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No observations recorded yet.</p>
                                                    )}
                                                </div>
                                                 <div>
                                                    <h4 className="font-semibold my-2 flex items-center gap-2"><Dna className="h-4 w-4 text-primary" />Subcultures</h4>
                                                    {exp.subcultures && exp.subcultures.length > 0 ? (
                                                       <Table>
                                                          <TableHeader>
                                                            <TableRow>
                                                              <TableHead>Date</TableHead>
                                                              <TableHead>Explants</TableHead>
                                                              <TableHead>Media</TableHead>
                                                            </TableRow>
                                                          </TableHeader>
                                                          <TableBody>
                                                            {exp.subcultures.map(sc => (
                                                              <TableRow key={sc.id}>
                                                                <TableCell>{sc.date}</TableCell>
                                                                <TableCell>{sc.explantCount}</TableCell>
                                                                <TableCell><Badge variant="secondary">{sc.media}</Badge></TableCell>
                                                              </TableRow>
                                                            ))}
                                                          </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No subculture history for this experiment.</p>
                                                    )}
                                                    {exp.status === 'ongoing' && (
                                                      <Dialog open={isExperimentSubcultureDialogOpen} onOpenChange={setIsExperimentSubcultureDialogOpen}>
                                                        <DialogTrigger asChild>
                                                           <Button variant="outline" size="sm" className="mt-2 w-full">
                                                            <PlusCircle className="mr-2 h-4 w-4" />
                                                            Add Subculture
                                                          </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                                          <DialogHeader>
                                                            <DialogTitle>Log Subculture for Experiment</DialogTitle>
                                                            <DialogDescription>
                                                              Log a new subculture for Iteration {exp.iteration} of {plant.name}.
                                                            </DialogDescription>
                                                          </DialogHeader>
                                                          <SubcultureForm plantId={plant.id} onSuccess={handleExperimentSubcultureSuccess} />
                                                        </DialogContent>
                                                      </Dialog>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No experiments recorded yet.</p>
                            )}

                        </CardContent>
                    </Card>
                </TabsContent>
              )}

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
