"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { performContaminationAnalysis } from '@/app/actions';
import { AnalysisResult } from '@/lib/types';
import { UploadCloud, Loader, AlertTriangle, CheckCircle2, XCircle, Percent } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export function ContaminationAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) {
      toast({
        title: 'No file selected',
        description: 'Please upload an image to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await performContaminationAnalysis(preview);
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred during the analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contamination Analysis</CardTitle>
        <CardDescription>Upload an image to check for contamination.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
        </div>
        {preview && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <Image src={preview} alt="Upload preview" layout="fill" objectFit="contain" />
          </div>
        )}
        <Button onClick={handleAnalyze} disabled={isLoading || !file} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Analyze Image
            </>
          )}
        </Button>
        {result && (
          <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {result.isContaminated ? <AlertTriangle className="text-destructive" /> : <CheckCircle2 className="text-green-600" />}
                   Analysis Result
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-background">
                    <div className="font-semibold">Status</div>
                    <Badge variant={result.isContaminated ? 'destructive' : 'default'} className={!result.isContaminated ? 'bg-green-600 hover:bg-green-700 text-white' : ''}>
                        {result.isContaminated ? <XCircle className="mr-2 h-4 w-4"/> : <CheckCircle2 className="mr-2 h-4 w-4"/>}
                        {result.isContaminated ? 'Contaminated' : 'Clean'}
                    </Badge>
                </div>
                {result.isContaminated && (
                  <div className="flex items-start justify-between p-3 rounded-md bg-background">
                      <div className="font-semibold">Contaminants</div>
                      <div className="text-right text-sm text-muted-foreground">{result.contaminants}</div>
                  </div>
                )}
                 <div className="space-y-2 p-3 rounded-md bg-background">
                      <div className="font-semibold flex items-center justify-between">
                        <span>Confidence</span>
                        <span className="font-bold text-primary">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <Progress value={result.confidence * 100} className="h-2 [&>div]:bg-primary" />
                  </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
