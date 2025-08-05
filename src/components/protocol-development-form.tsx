
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { getPlants } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronsUpDown, Check, PlusCircle, Beaker, FlaskConical, ImagePlus, Camera } from "lucide-react"
import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"


const sterilisationProcedures = ["70% Ethanol for 1 min", "10% Bleach solution for 10 mins", "Autoclaving at 121°C"];
const mediaTypes = ["MS Media", "B5 Media", "Orchid Maintenance Medium"];
const observationTypes = ['callus', 'shoot', 'root', 'necrosis', 'contamination', 'other'];

const protocolFormSchema = z.object({
  plantId: z.string({ required_error: "Please select a plant." }),
  inoculationDate: z.date({ required_error: "A date is required." }),
  sterilisationProcedure: z.string({ required_error: "Please select a procedure." }),
  customSterilisationProcedure: z.string().optional(),
  inoculationMedia: z.string({ required_error: "Please select a media." }),
  customInoculationMedia: z.string().optional(),
  initialObservation: z.string().optional(),
  observationNotes: z.string().optional(),
  experimentalNotes: z.string().optional(),
  status: z.enum(["ongoing", "success", "failed"], { required_error: "You must select a status."}),
  images: z.any().optional(),
}).refine(data => {
    if (data.sterilisationProcedure === 'Other' && !data.customSterilisationProcedure) {
        return false;
    }
    return true;
}, { message: "Please specify the custom sterilisation procedure.", path: ["customSterilisationProcedure"]})
 .refine(data => {
    if (data.inoculationMedia === 'Other' && !data.customInoculationMedia) {
        return false;
    }
    return true;
 }, { message: "Please specify the custom inoculation media.", path: ["customInoculationMedia"] });


type ProtocolFormValues = z.infer<typeof protocolFormSchema>

const plants = getPlants().filter(p => p.type === 'development');

interface ProtocolDevelopmentFormProps {
    plantId?: string;
    onSuccess?: () => void;
}

export function ProtocolDevelopmentForm({ plantId, onSuccess }: ProtocolDevelopmentFormProps) {
  const { toast } = useToast()
  const [useCustomSterilisation, setUseCustomSterilisation] = useState(false);
  const [useCustomMedia, setUseCustomMedia] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ProtocolFormValues>({
    resolver: zodResolver(protocolFormSchema),
    defaultValues: {
        plantId: plantId,
        status: "ongoing",
    },
  })

  function onSubmit(data: ProtocolFormValues) {
    console.log(data)
    toast({
      title: "Experiment Logged Successfully",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    if(onSuccess) {
        onSuccess();
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        form.setValue("images", files);
        const newPreviews: string[] = [];
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === files.length) {
                    setImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 p-1">
             <FormField
                control={form.control}
                name="plantId"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Plant Name</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant="outline"
                            role="combobox"
                            className={cn( "w-full justify-between", !field.value && "text-muted-foreground" )}
                            disabled={!!plantId}
                            >
                            {field.value ? plants.find((plant) => plant.id === field.value)?.name : "Select plant"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                        <Command>
                            <CommandInput placeholder="Search plant..." />
                            <CommandEmpty>No plant found.</CommandEmpty>
                            <CommandGroup>
                            {plants.map((plant) => (
                                <CommandItem value={plant.name} key={plant.id} onSelect={() => { form.setValue("plantId", plant.id)}}>
                                <Check className={cn( "mr-2 h-4 w-4", plant.id === field.value ? "opacity-100" : "opacity-0")} />
                                {plant.name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="inoculationDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Inoculation Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} className={cn( "w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground" )}>
                            {field.value ? ( format(field.value, "PPP") ) : ( <span>Pick a date</span> )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="space-y-4 p-1">
             <FormField
                control={form.control}
                name="sterilisationProcedure"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><Beaker className="mr-2 h-4 w-4 text-primary"/>Sterilisation Procedure</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        setUseCustomSterilisation(value === "Other");
                    }} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a procedure" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {sterilisationProcedures.map(proc => <SelectItem key={proc} value={proc}>{proc}</SelectItem>)}
                            <SelectItem value="Other">Other (Specify)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

            {useCustomSterilisation && (
                <FormField
                    control={form.control}
                    name="customSterilisationProcedure"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Custom Procedure Name</FormLabel>
                        <FormControl><Input placeholder="e.g., 5% H2O2 for 5 min" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
             <FormField
                control={form.control}
                name="inoculationMedia"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><FlaskConical className="mr-2 h-4 w-4 text-primary"/>Inoculation Media</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        setUseCustomMedia(value === "Other");
                    }} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a media type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {mediaTypes.map(media => <SelectItem key={media} value={media}>{media}</SelectItem>)}
                            <SelectItem value="Other">Other (Specify)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

            {useCustomMedia && (
                <FormField
                    control={form.control}
                    name="customInoculationMedia"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Custom Media Name</FormLabel>
                        <FormControl><Input placeholder="e.g., MS + 2mg/L BAP" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
        
         <div className="space-y-4 p-1">
             <FormLabel>Initial Observation (Optional)</FormLabel>
            <FormField
                control={form.control}
                name="initialObservation"
                render={({ field }) => (
                    <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select an initial observation type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {observationTypes.map(obs => <SelectItem key={obs} value={obs} className="capitalize">{obs}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            
            <FormField
                control={form.control}
                name="observationNotes"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Textarea placeholder="Notes about this initial observation..." className="resize-y min-h-[60px]" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
             <FormField
                control={form.control}
                name="experimentalNotes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Overall Experimental Notes</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Goals, hypothesis, etc." className="resize-y min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Camera className="h-4 w-4 text-primary"/>Add Photos</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            capture="environment"
                            multiple
                            onChange={handleImageChange} 
                            className="file:text-primary file:font-semibold"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
             {imagePreviews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {imagePreviews.map((preview, index) => (
                         <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Experiment Status</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="ongoing" /></FormControl>
                            <FormLabel className="font-normal">Ongoing</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="success" /></FormControl>
                            <FormLabel className="font-normal">Success</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="failed" /></FormControl>
                            <FormLabel className="font-normal">Failed</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
        </div>

        <Button type="submit" className="w-full sm:w-auto" size="lg">
            <PlusCircle className="mr-2 h-5 w-5"/>
            Save Experiment
        </Button>
      </form>
    </Form>
  )
}
