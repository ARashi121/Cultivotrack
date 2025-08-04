
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { performSheetParsing } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { ParsedSubcultureRecord } from '@/lib/types';
import { Bot, FileWarning, Loader, UploadCloud } from 'lucide-react';

interface SpreadsheetUploadDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSuccess: () => void;
}

export function SpreadsheetUploadDialog({ isOpen, onOpenChange, onSuccess }: SpreadsheetUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<ParsedSubcultureRecord[] | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv') {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a CSV file.",
                    variant: "destructive"
                });
                return;
            }
            setFile(selectedFile);
            setParsedData(null);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target?.result as string);
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleParse = async () => {
        if (!fileContent) return;
        setIsParsing(true);
        setParsedData(null);
        try {
            const result = await performSheetParsing(fileContent);
            setParsedData(result.records);
            toast({
                title: "Parsing Successful",
                description: `${result.records.length} records were found. Please review the data below before saving.`,
            })
        } catch (error) {
            toast({
                title: "Parsing Failed",
                description: "The AI assistant could not parse the spreadsheet. Please check the file format and try again.",
                variant: "destructive",
            });
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Here you would typically send the parsedData to your backend/database
        // For this example, we'll just simulate a save operation.
        console.log("Saving data:", parsedData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
            title: "Data Imported",
            description: "The subculture records have been successfully added to the system.",
        });
        setIsSaving(false);
        onSuccess();
        resetState();
    }
    
    const resetState = () => {
        setFile(null);
        setFileContent(null);
        setIsParsing(false);
        setParsedData(null);
        setIsSaving(false);
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetState();
        }
        onOpenChange(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" />AI-Powered Spreadsheet Import</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file with your subculture data. The AI will automatically parse and format it for you.
                        Ensure your file has headers like 'Plant Name', 'Date', 'Jars Used', etc.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <Input id="spreadsheet" type="file" accept=".csv" onChange={handleFileChange} />
                        <Button onClick={handleParse} disabled={!file || isParsing} className="w-full">
                            {isParsing ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Parsing...</> : <><Bot className="mr-2 h-4 w-4" />Parse with AI</>}
                        </Button>
                    </div>

                    {parsedData && parsedData.length > 0 && (
                        <div className="space-y-4">
                            <Alert>
                                <FileWarning className="h-4 w-4" />
                                <AlertTitle>Review Parsed Data</AlertTitle>
                                <AlertDescription>
                                    Please verify the data below. If it looks correct, click "Save Records" to import it.
                                </AlertDescription>
                            </Alert>
                             <div className="max-h-[400px] overflow-y-auto border rounded-md">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-muted">
                                        <TableRow>
                                            <TableHead>Plant Name</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Done By</TableHead>
                                            <TableHead>Jars</TableHead>
                                            <TableHead>Contaminated</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsedData.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{record.plantName}</TableCell>
                                                <TableCell>{record.subcultureDate}</TableCell>
                                                <TableCell>{record.doneBy}</TableCell>
                                                <TableCell>{record.jarsUsed}</TableCell>
                                                <TableCell>{record.contaminatedJars || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!parsedData || isSaving}>
                         {isSaving ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><UploadCloud className="mr-2 h-4 w-4" />Save Records</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
