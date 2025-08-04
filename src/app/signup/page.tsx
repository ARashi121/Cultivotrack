"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link';
import { Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      })
      return;
    }
    setIsLoading(true);
    try {
      await signup(email, password);
      router.push('/');
    } catch (error: any) {
        toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
        })
      console.error('Signup failed:', error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignup}>
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center gap-2 mb-2">
                    <Sprout className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-headline">CultivoTrack</CardTitle>
                </div>
                <CardDescription>Create your account to get started.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                 <Alert>
                    <AlertTitle className='font-semibold'>Demo Signup</AlertTitle>
                    <AlertDescription>
                        <p>To sign up as an admin, use the email <code className='font-mono text-sm'>admin@cultivotrack.com</code>.</p>
                        <p>For a technician account, use any other email address.</p>
                         <p>Default password is <code className='font-mono text-sm'>password123</code></p>
                    </AlertDescription>
                </Alert>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Log in
                    </Link>
                </div>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
}
