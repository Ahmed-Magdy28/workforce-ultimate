'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Mail, Send } from 'lucide-react';
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
import useRequestPasswordReset from '@/features/auth/hooks/useRequestPasswordReset';

export default function ForgotPassword() {
   const [email, setEmail] = useState('');
   const [error, setError] = useState('');
   const [hasSubmitted, setHasSubmitted] = useState(false);
   const { isSendingResetEmail, requestPasswordReset } =
      useRequestPasswordReset();

   const redirectTo = useMemo(() => {
      if (typeof window === 'undefined') {
         return '/reset-password';
      }

      return new URL('/reset-password', window.location.origin).toString();
   }, []);

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      if (!email.trim()) {
         setError('Email is required');
         return;
      }

      requestPasswordReset(
         { email: email.trim(), redirectTo },
         {
            onSuccess: () => {
               setHasSubmitted(true);
            },
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
                     Account recovery
                  </div>
                  <CardTitle className="text-2xl font-bold sm:text-3xl">
                     Forgot your password?
                  </CardTitle>
                  <CardDescription className="mx-auto max-w-md text-sm leading-6 sm:text-base">
                     Enter the email address tied to your account and we will
                     send you a secure link to reset your password.
                  </CardDescription>
               </CardHeader>

               <CardContent>
                  {hasSubmitted ? (
                     <div className="space-y-5 rounded-2xl border bg-muted/30 p-6 text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                           <Send className="size-5" />
                        </div>
                        <div className="space-y-2">
                           <h2 className="text-xl font-semibold">
                              Check your inbox
                           </h2>
                           <p className="text-sm leading-6 text-muted-foreground">
                              If an account exists for <strong>{email}</strong>,
                              a password reset email is on the way. Open the
                              link in that email to choose a new password.
                           </p>
                        </div>
                        <Button
                           variant="outline"
                           className="w-full"
                           onClick={() => {
                              setHasSubmitted(false);
                              setError('');
                           }}
                        >
                           Send another link
                        </Button>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                           <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{error}</AlertDescription>
                           </Alert>
                        )}

                        <div className="space-y-2">
                           <Label htmlFor="email">Work email</Label>
                           <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="name@example.com"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 className="pl-10"
                                 autoComplete="email"
                                 required
                              />
                           </div>
                        </div>

                        <Button
                           type="submit"
                           className="w-full"
                           disabled={isSendingResetEmail}
                        >
                           {isSendingResetEmail
                              ? 'Sending reset link...'
                              : 'Send reset link'}
                        </Button>
                     </form>
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
