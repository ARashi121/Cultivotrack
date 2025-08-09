
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"


const plantFormSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters.").max(10, "Code cannot be longer than 10 characters.").refine(val => val.toUpperCase() === val, { message: "Code must be uppercase." }),
  name: z.string().min(3, "Common name must be at least 3 characters."),
  scientificName: z.string().min(3, "Scientific name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  photoUrl: z.string().url("Please enter a valid image URL."),
  type: z.enum(["tc", "development"], {
    required_error: "You need to select a plant type.",
  }),
});


type PlantFormValues = z.infer<typeof plantFormSchema>

interface PlantFormProps {
    onSuccess?: (plantType: 'tc' | 'development') => void;
}

export function PlantForm({ onSuccess }: PlantFormProps) {
  const { toast } = useToast()

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
        code: "",
        name: "",
        scientificName: "",
        description: "",
        photoUrl: "https://placehold.co/600x400.png",
        type: "tc",
    },
  })
  
  function onSubmit(data: PlantFormValues) {
    // In a real app, you'd send this to a server
    console.log("New plant data:", data)
    
    // For now, we just show a toast and call the success callback
    toast({
      title: "Form Submitted (Simulated)",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    if(onSuccess) {
        onSuccess(data.type);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Plant Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="tc" />
                    </FormControl>
                    <FormLabel className="font-normal">TC Plant</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="development" />
                    </FormControl>
                    <FormLabel className="font-normal">Protocol Development</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ARM" {...field} />
              </FormControl>
              <FormDescription>
                A short, unique, uppercase identifier (2-10 chars).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="scientificName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scientific Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alternanthera reineckii 'mini'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Common Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AR Mini" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the plant."
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
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL for the plant's image. Use a placeholder if you don't have one.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg">
            <PlusCircle className="mr-2 h-5 w-5"/>
            Add Plant
        </Button>
      </form>
    </Form>
  )
}
