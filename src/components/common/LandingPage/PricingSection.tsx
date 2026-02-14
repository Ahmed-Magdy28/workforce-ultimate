import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';

export function PricingSection() {
   const { t } = useTranslation('landing');

   const plans = [
      {
         name: t('pricing Section.starter.name', 'Starter'),
         description: t(
            'pricing Section.starter.description',
            'Perfect for small teams getting started',
         ),
         price: t('pricing Section.starter.price', '$29'),
         period: t('pricing Section.period', '/month'),
         popular: false,
         features: [
            t('pricing Section.starter.feature1', 'Up to 10 team members'),
            t('pricing Section.starter.feature2', '5 active projects'),
            t('pricing Section.starter.feature3', 'Basic task management'),
            t('pricing Section.starter.feature4', 'Email notifications'),
            t('pricing Section.starter.feature5', 'Daily work logs'),
            t('pricing Section.starter.feature6', '5GB file storage'),
            t('pricing Section.starter.feature7', 'Email support'),
         ],
      },
      {
         name: t('pricing Section.professional.name', 'Professional'),
         description: t(
            'pricing Section.professional.description',
            'For growing teams with advanced needs',
         ),
         price: t('pricing Section.professional.price', '$79'),
         period: t('pricing Section.period', '/month'),
         popular: true,
         features: [
            t('pricing Section.professional.feature1', 'Up to 50 team members'),
            t('pricing Section.professional.feature2', 'Unlimited projects'),
            t(
               'pricing Section.professional.feature3',
               'Advanced task management',
            ),
            t(
               'pricing Section.professional.feature4',
               'Real-time notifications',
            ),
            t('pricing Section.professional.feature5', 'Performance analytics'),
            t('pricing Section.professional.feature6', 'Team communication'),
            t('pricing Section.professional.feature7', '50GB file storage'),
            t(
               'pricing Section.professional.feature8',
               'GitHub & Gmail integration',
            ),
            t('pricing Section.professional.feature9', 'Priority support'),
         ],
      },
      {
         name: t('pricing Section.enterprise.name', 'Enterprise'),
         description: t(
            'pricing Section.enterprise.description',
            'For large organizations with custom requirements',
         ),
         price: t('pricing Section.enterprise.price', 'Custom'),
         period: '',
         popular: false,
         features: [
            t('pricing Section.enterprise.feature1', 'Unlimited team members'),
            t('pricing Section.enterprise.feature2', 'Unlimited projects'),
            t(
               'pricing Section.enterprise.feature3',
               'All Professional features',
            ),
            t('pricing Section.enterprise.feature4', 'Custom integrations'),
            t(
               'pricing Section.enterprise.feature5',
               'Advanced security & compliance',
            ),
            t(
               'pricing Section.enterprise.feature6',
               'Dedicated account manager',
            ),
            t('pricing Section.enterprise.feature7', 'Unlimited storage'),
            t(
               'pricing Section.enterprise.feature8',
               'Custom training & onboarding',
            ),
            t('pricing Section.enterprise.feature9', '24/7 phone support'),
            t('pricing Section.enterprise.feature10', 'SLA guarantee'),
         ],
      },
   ];

   return (
      <section id="pricing" className="py-20 sm:py-24 lg:py-32">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center mb-16">
               <Badge variant="outline" className="mb-4">
                  {t('pricing Section.badge', 'Pricing')}
               </Badge>
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
                  {t('pricing Section.heading', 'Simple, Transparent')} <br />
                  <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                     {t(
                        'pricing Section.headingHighlight',
                        'Pricing for Everyone',
                     )}
                  </span>
               </h2>
               <p className="text-lg text-muted-foreground">
                  {t(
                     'pricing Section.subheading',
                     'Choose the perfect plan for your team. All plans include a 14-day free trial.',
                  )}
               </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
               {plans.map((plan, index) => (
                  <Card
                     key={index}
                     className={`relative flex flex-col ${
                        plan.popular
                           ? 'border-primary shadow-xl scale-105 lg:scale-110'
                           : 'border-2'
                     }`}
                  >
                     {/* Popular Badge */}
                     {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                           <Badge className="px-4 py-1 bg-primary text-primary-foreground flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              {t('pricing Section.popular', 'Most Popular')}
                           </Badge>
                        </div>
                     )}

                     <CardHeader className="text-center pb-8 pt-8">
                        <CardTitle className="text-2xl mb-2">
                           {plan.name}
                        </CardTitle>
                        <CardDescription className="text-base">
                           {plan.description}
                        </CardDescription>
                        <div className="mt-6">
                           <span className="text-4xl font-bold">
                              {plan.price}
                           </span>
                           {plan.period && (
                              <span className="text-muted-foreground ml-1">
                                 {plan.period}
                              </span>
                           )}
                        </div>
                     </CardHeader>

                     <CardContent className="flex-1">
                        <ul className="space-y-3">
                           {plan.features.map((feature, featureIndex) => (
                              <li
                                 key={featureIndex}
                                 className="flex items-start gap-3"
                              >
                                 <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                                 <span className="text-sm text-muted-foreground">
                                    {feature}
                                 </span>
                              </li>
                           ))}
                        </ul>
                     </CardContent>

                     <CardFooter className="pt-6">
                        <Button
                           asChild
                           variant={plan.popular ? 'default' : 'outline'}
                           className="w-full"
                           size="lg"
                        >
                           <Link to="/signup">
                              {plan.price === 'Custom'
                                 ? t(
                                      'pricing Section.contactSales',
                                      'Contact Sales',
                                   )
                                 : t(
                                      'pricing Section.getStarted',
                                      'Get Started',
                                   )}
                           </Link>
                        </Button>
                     </CardFooter>
                  </Card>
               ))}
            </div>

            {/* FAQ or Additional Info */}
            <div className="mt-16 text-center">
               <p className="text-muted-foreground mb-6">
                  {t(
                     'pricing Section.allPlans',
                     'All plans include 14-day free trial. No credit card required.',
                  )}
               </p>
               <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-primary" />
                     <span>
                        {t('pricing Section.benefit1', 'Cancel anytime')}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-primary" />
                     <span>
                        {t('pricing Section.benefit2', 'Secure payments')}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-primary" />
                     <span>
                        {t('pricing Section.benefit3', 'Money-back guarantee')}
                     </span>
                  </div>
               </div>
            </div>

            {/* Enterprise CTA */}
            <div className="mt-16 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 p-8 text-center">
               <h3 className="text-2xl font-bold mb-3">
                  {t(
                     'pricing Section.enterprise.cta.title',
                     'Need a Custom Solution?',
                  )}
               </h3>
               <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {t(
                     'pricing Section.enterprise.cta.description',
                     'Our Enterprise plan can be tailored to your specific needs. Contact our sales team for a personalized quote and demo.',
                  )}
               </p>
               <Button size="lg" asChild>
                  <Link to="/contact">
                     {t(
                        'pricing Section.enterprise.cta.button',
                        'Schedule a Demo',
                     )}
                  </Link>
               </Button>
            </div>
         </div>
      </section>
   );
}
