'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useRecoverPassword from '@/features/auth/hooks/useRecoverPassword';

export default function ResetPassword() {
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isRecoveryReady, setIsRecoveryReady] = useState(false);
   const [isCheckingSession, setIsCheckingSession] = useState(true);
   const { isUpdatingPassword, recoverPassword } = useRecoverPassword();

   useEffect(() => {
      let isMounted = true;

      const loadSession = async () => {
         const { data, error: sessionError } = await supabase.auth.getSession();

         if (!isMounted) return;

         if (sessionError || !data.session) {
            setError(
               'This reset link is invalid or has expired. Request a new password reset email and try again.',
            );
            setIsRecoveryReady(false);
            setIsCheckingSession(false);
            return;
         }

         setIsRecoveryReady(true);
         setIsCheckingSession(false);
      };

      loadSession();

      return () => {
         isMounted = false;
      };
   }, []);

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      if (password.length < 8) {
         setError('Password must be at least 8 characters long');
         return;
      }

      if (password !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      recoverPassword(
         { password },
         {
            onError: (submissionError: Error) => {
               setError(submissionError.message);
            },
         },
      );
   };

   return (
      <section className="bg-linear-to-br from-background via-background to-muted/30 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
         <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center justify-center">
            <Card className="w-full max-w-xl border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-xl">
               <CardHeader className="space-y-3 text-center">
                  <div className="mx-auto inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                     Secure password reset
                  </div>
                  <CardTitle className="text-2xl font-bold sm:text-3xl">
                     Create a new password
                  </CardTitle>
                  <CardDescription className="mx-auto max-w-md text-sm leading-6 sm:text-base">
                     Choose a strong password for your account. Once it is
                     updated, you can sign in right away.
                  </CardDescription>
               </CardHeader>

               <CardContent>
                  {error && (
                     <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}

                  {isCheckingSession ? (
                     <div className="rounded-2xl border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                        Verifying your reset link...
                     </div>
                  ) : isRecoveryReady ? (
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="password">New password</Label>
                           <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="password"
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="At least 8 characters"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                                 className="pl-10 pr-10"
                                 autoComplete="new-password"
                                 required
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword((value) => !value)}
                                 className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                 {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                 ) : (
                                    <Eye className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="confirmPassword">
                              Confirm new password
                           </Label>
                           <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="confirmPassword"
                                 type={
                                    showConfirmPassword ? 'text' : 'password'
                                 }
                                 placeholder="Re-enter your new password"
                                 value={confirmPassword}
                                 onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                 }
                                 className="pl-10 pr-10"
                                 autoComplete="new-password"
                                 required
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowConfirmPassword((value) => !value)
                                 }
                                 className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                 {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                 ) : (
                                    <Eye className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                        </div>

                        <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                           <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                              Use at least 8 characters and avoid reusing an old
                              password if possible.
                           </div>
                        </div>

                        <Button
                           type="submit"
                           className="w-full"
                           disabled={isUpdatingPassword}
                        >
                           {isUpdatingPassword
                              ? 'Updating password...'
                              : 'Update password'}
                        </Button>
                     </form>
                  ) : (
                     <div className="space-y-4 rounded-2xl border bg-muted/30 p-6 text-center">
                        <p className="text-sm leading-6 text-muted-foreground">
                           Request a fresh reset email to continue recovering
                           your account.
                        </p>
                        <Button asChild className="w-full">
                           <Link href="/forgot-password">Request reset email</Link>
                        </Button>
                     </div>
                  )}
               </CardContent>

               <CardFooter className="justify-center">
                  <Link
                     href="/login"
                     className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                     <ArrowLeft className="size-4" />
                     Back to sign in
                  </Link>
               </CardFooter>
            </Card>
         </div>
      </section>
   );
}
