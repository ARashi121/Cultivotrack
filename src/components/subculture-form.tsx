
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getPlants } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CalendarIcon, Check, ChevronsUpDown, ListTodo, PlusCircle, ImagePlus } from "lucide-react"
import { useState } from "react"


const mediaTypes = ["MS Media", "B5 Media", "White's Medium", "Nitsch & Nitsch"]

const subcultureFormSchema = z.object({
  plantId: z.string({ required_error: "Please select a plant." }),
  subcultureDate: z.date({ required_error: "A date is required." }),
  doneBy: z.string().min(2, "Name must be at least 2 characters."),
  mediaType: z.string({ required_error: "Please select a media type." }),
  customMedia: z.string().optional(),
  jarsUsed: z.coerce.number().min(1, "Must be at least 1."),
  contaminatedJars: z.coerce.number().min(0).optional(),
  contaminationReason: z.string().optional(),
  jarsToHardening: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  batchId: z.string().optional(),
  usePreset: z.boolean().default(false).optional(),
  image: z.any().optional(),
}).refine(data => {
    if (data.mediaType === 'Other' && !data.customMedia) {
        return false;
    }
    return true;
}, { message: "Please specify the custom media type.", path: ["customMedia"]})
 .refine(data => {
    if ((data.contaminatedJars ?? 0) > 0 && !data.contaminationReason) {
        return false;
    }
    return true;
 }, { message: "Please provide a reason for contamination.", path: ["contaminationReason"] });


type SubcultureFormValues = z.infer<typeof subcultureFormSchema>

const plants = getPlants().filter(p => p.type === 'tc');

interface SubcultureFormProps {
    plantId?: string;
    onSuccess?: () => void;
}

export function SubcultureForm({ plantId, onSuccess }: SubcultureFormProps) {
  const { toast } = useToast()
  const [useCustomMedia, setUseCustomMedia] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SubcultureFormValues>({
    resolver: zodResolver(subcultureFormSchema),
    defaultValues: {
        plantId: plantId,
        doneBy: '',
        jarsUsed: 1,
        contaminatedJars: 0,
        jarsToHardening: 0,
        usePreset: false,
    },
  })

  function onSubmit(data: SubcultureFormValues) {
    console.log(data)
    toast({
      title: "Subculture Event Logged",
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

  const handlePresetChange = (checked: boolean) => {
    form.setValue("usePreset", checked);
    if (checked) {
        form.setValue("notes", "Standard subculture protocol followed. No deviations.");
        form.setValue("mediaType", "MS Media");
        setUseCustomMedia(false);
    } else {
        form.setValue("notes", "");
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        form.setValue("image", file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
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
                            className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                            disabled={!!plantId}
                            >
                            {field.value
                                ? plants.find(
                                    (plant) => plant.id === field.value
                                )?.name
                                : "Select plant"}
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
                                <CommandItem
                                value={plant.name}
                                key={plant.id}
                                onSelect={() => {
                                    form.setValue("plantId", plant.id)
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    plant.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                />
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
                name="subcultureDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Subculture Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="doneBy"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Done By</FormLabel>
                    <FormControl>
                        <Input placeholder="Technician's name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="batchId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Batch ID / Barcode</FormLabel>
                    <FormControl>
                        <Input placeholder="Optional: e.g., BATCH-00123" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="space-y-4 p-1">
             <FormField
                control={form.control}
                name="mediaType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Media Used</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        setUseCustomMedia(value === "Other");
                    }} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a media type" />
                        </SelectTrigger>
                        </FormControl>
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
                    name="customMedia"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Custom Media Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., MS + 2mg/L BAP" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}

             <FormField
                control={form.control}
                name="jarsUsed"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Number of Jars Used</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="contaminatedJars"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contaminated Jars</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="jarsToHardening"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Jars for Hardening</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             
            {(form.watch("contaminatedJars") ?? 0) > 0 && (
                 <FormField
                    control={form.control}
                    name="contaminationReason"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Reason for Contamination</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Fungal growth, bacterial slime" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>

         <div className="space-y-4 p-1">
             <FormField
                control={form.control}
                name="usePreset"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => handlePresetChange(Boolean(checked))}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center">
                            <ListTodo className="mr-2 h-4 w-4"/>
                            Use Preset Template
                        </FormLabel>
                        <FormDescription>
                            Speeds up data entry for routine subcultures.
                        </FormDescription>
                    </div>
                    </FormItem>
                )}
                />

            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Observations, deviations from protocol, etc."
                        className="resize-y min-h-[100px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><ImagePlus className="mr-2 h-4 w-4 text-primary"/>Upload Image</FormLabel>
                    <FormControl><Input type="file" accept="image/*" onChange={handleImageChange} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
             {imagePreview && <div className="relative w-full h-48 rounded-lg overflow-hidden border"><img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /></div>}
        </div>

        <Button type="submit" className="w-full sm:w-auto" size="lg">
            <PlusCircle className="mr-2 h-5 w-5"/>
            Save Subculture Event
        </Button>
      </form>
    </Form>
  )
}
