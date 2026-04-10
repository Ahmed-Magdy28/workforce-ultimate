import { Link } from 'react-router';

import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import SignupForm from './SignupForm';

export default function Signup() {
   return (
      <section className="bg-linear-to-br from-background via-background to-muted/30 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
         <div className="mx-auto w-full max-w-6xl">
            <Card className="overflow-hidden border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-xl">
               <div className="grid lg:min-h-[calc(100vh-12rem)] lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="hidden bg-muted/40 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
                     <div className="space-y-6">
                        <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
                           Workforce Ultimate
                        </p>
                        <div className="space-y-4">
                           <h1 className="max-w-xl text-4xl font-bold tracking-tight xl:text-5xl">
                              Create your workspace account in one clean step.
                           </h1>
                           <p className="max-w-lg text-base leading-7 text-muted-foreground">
                              This layout keeps the form focused while using the
                              desktop space in a more balanced way.
                           </p>
                        </div>
                     </div>

                     <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border bg-background/80 p-5">
                           <p className="text-sm font-medium text-foreground">
                              Fast setup
                           </p>
                           <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              Create your account and move into the app without
                              a crowded form.
                           </p>
                        </div>
                        <div className="rounded-2xl border bg-background/80 p-5">
                           <p className="text-sm font-medium text-foreground">
                              Responsive by default
                           </p>
                           <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              Mobile stays compact while desktop feels full and
                              intentional.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center rounded-2xl bg-card p-4 shadow-sm sm:p-8 sm:shadow-none lg:rounded-none lg:bg-transparent lg:p-10 xl:p-14">
                     <div className="w-full">
                        <CardHeader className="space-y-2 px-0 pb-5 text-center sm:pb-6 lg:text-left">
                           <div className="mx-auto inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground lg:hidden">
                              Workforce Ultimate
                           </div>
                           <CardTitle className="text-xl font-bold sm:text-3xl">
                              Create an account
                           </CardTitle>
                           <CardDescription className="text-sm sm:text-base">
                              Enter your name, email, and password to sign up.
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                           <SignupForm />
                        </CardContent>
                        <CardFooter className="justify-center px-0 pt-5 lg:justify-start">
                           <p className="text-center text-sm text-muted-foreground lg:text-left">
                              Already have an account?{' '}
                              <Link
                                 to="/login"
                                 className="font-medium text-primary hover:underline"
                              >
                                 Sign in
                              </Link>
                           </p>
                        </CardFooter>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </section>
   );
}
