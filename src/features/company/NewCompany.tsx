import { useState, type JSX } from 'react';
import { ArrowRight, Building2, Sparkles, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import CompanyCreateForm from '@/features/company/CompanyCreateForm';
import CompanyJoinForm from '@/features/company/CompanyJoinForm';

type CompanyFlow = 'create' | 'join';

const flowCards: {
   id: CompanyFlow;
   icon: typeof Building2;
   badge: string;
   title: string;
   description: string;
   buttonLabel: string;
}[] = [
   {
      id: 'create',
      icon: Building2,
      badge: 'Start here',
      title: 'Create company',
      description:
         'Build the core workspace profile first so all future invites and joins have a real destination.',
      buttonLabel: 'Open create form',
   },
   {
      id: 'join',
      icon: UserPlus,
      badge: 'Employee flow',
      title: 'Join company',
      description:
         'Use an invitation code to join an existing workspace after HR or admin shares it with you.',
      buttonLabel: 'Open join form',
   },
];

const flowContent: Record<
   CompanyFlow,
   {
      eyebrow: string;
      title: string;
      description: string;
      component: JSX.Element;
   }
> = {
   create: {
      eyebrow: 'Company creation',
      title: 'Create the workspace foundation',
      description:
         'Add your company profile and operating details before inviting the rest of the team.',
      component: <CompanyCreateForm />,
   },
   join: {
      eyebrow: 'Join workspace',
      title: 'Join an existing company',
      description:
         'Use the employee join flow when you already have an invitation code from your company admin or HR team.',
      component: <CompanyJoinForm />,
   },
};

export default function NewCompany() {
   const [activeFlow, setActiveFlow] = useState<CompanyFlow | null>(null);
   const activeContent = activeFlow ? flowContent[activeFlow] : null;

   function handleFlowToggle(flowId: CompanyFlow) {
      setActiveFlow((currentFlow) => (currentFlow === flowId ? null : flowId));
   }

   return (
      <section className="bg-linear-to-br from-background via-background to-muted/30 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
         <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            <div className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="size-3.5" />
                  Company setup
               </div>
               <div className="max-w-3xl space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                     Choose how you want to set up the company workspace.
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                     Start by choosing one flow. The forms stay collapsed until
                     you open the one you need.
                  </p>
               </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
               {flowCards.map(
                  ({
                     id,
                     icon: Icon,
                     badge,
                     title,
                     description,
                     buttonLabel,
                  }) => {
                     const isActive = activeFlow === id;

                     return (
                        <Card
                           key={id}
                           className={
                              isActive
                                 ? 'border-primary/40 bg-primary/5 shadow-sm'
                                 : 'shadow-sm'
                           }
                        >
                           <CardHeader className="space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                 <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                 </div>
                                 <div className="rounded-full border border-primary/20 bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    {badge}
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <CardTitle className="text-xl">
                                    {title}
                                 </CardTitle>
                                 <CardDescription className="text-sm leading-6 sm:text-base">
                                    {description}
                                 </CardDescription>
                              </div>
                           </CardHeader>
                           <CardContent>
                                 <Button
                                 type="button"
                                 variant={isActive ? 'default' : 'outline'}
                                 className="w-full"
                                 onClick={() => handleFlowToggle(id)}
                              >
                                 {isActive ? 'Close form' : buttonLabel}
                                 <ArrowRight
                                    className={
                                       isActive
                                          ? 'size-4 rotate-90 transition-transform'
                                          : 'size-4 transition-transform'
                                    }
                                 />
                              </Button>
                           </CardContent>
                        </Card>
                     );
                  },
               )}
            </div>

            {activeContent ? (
               <div className="space-y-4">
                  <div className="space-y-2">
                     <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        {activeContent.eyebrow}
                     </p>
                     <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {activeContent.title}
                     </h2>
                     <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {activeContent.description}
                     </p>
                  </div>

                  {activeContent.component}
               </div>
            ) : null}
         </div>
      </section>
   );
}
