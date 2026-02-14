import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
   Mail,
   Send,
   Twitter,
   Github,
   Linkedin,
   MessageCircle,
   Clock,
   MapPin,
} from 'lucide-react';
import { myEmail, myGithubLink, myLinkedinLink } from '@/utils/constants';

export default function ContactPage() {
   const { t } = useTranslation('contact');

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Hero / Intro */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <MessageCircle className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('contact.title', 'Get in Touch')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               {t(
                  'contact.subtitle',
                  'I read every message personally. Whether it’s a question, feedback, bug report, feature idea — or just saying hello — I’ll get back to you (usually within 24–48 hours).',
               )}
            </p>
         </div>

         <div className="grid md:grid-cols-5 gap-12">
            {/* Left - Contact Form */}
            <div className="md:col-span-3">
               <Card className="border-2">
                  <CardHeader>
                     <CardTitle className="text-2xl">
                        {t('contact.form.title', 'Send me a message')}
                     </CardTitle>
                     <CardDescription>
                        {t(
                           'contact.form.subtitle',
                           'All fields are optional except the message — feel free to be direct.',
                        )}
                     </CardDescription>
                  </CardHeader>

                  <CardContent>
                     <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label htmlFor="name">
                                 {t(
                                    'contact.form.name',
                                    'Your name (optional)',
                                 )}
                              </Label>
                              <Input
                                 id="name"
                                 placeholder={t(
                                    'contact.form.namePlaceholder',
                                    'Ahmed Ali',
                                 )}
                              />
                           </div>

                           <div className="space-y-2">
                              <Label htmlFor="email">
                                 {t('contact.form.email', 'Email address')}
                              </Label>
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="you@example.com"
                                 required
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="subject">
                              {t('contact.form.subject', 'Subject (optional)')}
                           </Label>
                           <Input
                              id="subject"
                              placeholder={t(
                                 'contact.form.subjectPlaceholder',
                                 'Bug in employee import / Feature idea / Just saying hi',
                              )}
                           />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="message">
                              {t('contact.form.message', 'Your message')}
                           </Label>
                           <Textarea
                              id="message"
                              placeholder={t(
                                 'contact.form.messagePlaceholder',
                                 'Hi Ahmed, I really like the RTL support but I noticed…',
                              )}
                              className="min-h-40"
                              required
                           />
                        </div>

                        <Button
                           type="submit"
                           size="lg"
                           className="w-full md:w-auto"
                        >
                           <Send className="mr-2 h-5 w-5" />
                           {t('contact.form.send', 'Send Message')}
                        </Button>

                        <p className="text-sm text-muted-foreground mt-4">
                           {t(
                              'contact.form.privacy',
                              'Your email is only used to reply to you — never shared or spammed.',
                           )}
                        </p>
                     </form>
                  </CardContent>
               </Card>
            </div>

            {/* Right - Quick Links & Info */}
            <div className="md:col-span-2 space-y-8">
               <Card>
                  <CardHeader>
                     <CardTitle>
                        {t('contact.quick.title', 'Quick ways to reach me')}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-4">
                        <Button
                           variant="outline"
                           className="w-full justify-start gap-3 h-auto py-6"
                           asChild
                        >
                           <a href={`mailto:${myEmail}`}>
                              <Mail className="h-5 w-5 text-primary" />
                              <div className="text-left">
                                 <div className="font-medium">Email</div>
                                 <div className="text-sm text-muted-foreground">
                                    {myEmail}
                                 </div>
                              </div>
                           </a>
                        </Button>

                        <Button
                           variant="outline"
                           className="w-full justify-start gap-3 h-auto py-6"
                           asChild
                        >
                           <a
                              href="https://twitter.com/AhMeDMaGDY1428"
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              <Twitter className="h-5 w-5 text-sky-500" />
                              <div className="text-left">
                                 <div className="font-medium">Twitter / X</div>
                                 <div className="text-sm text-muted-foreground">
                                    @AhMeDMaGDY1428
                                 </div>
                              </div>
                           </a>
                        </Button>

                        <Button
                           variant="outline"
                           className="w-full justify-start gap-3 h-auto py-6"
                           asChild
                        >
                           <a
                              href={myGithubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              <Github className="h-5 w-5" />
                              <div className="text-left">
                                 <div className="font-medium">GitHub</div>
                                 <div className="text-sm text-muted-foreground">
                                    {myGithubLink}
                                 </div>
                              </div>
                           </a>
                        </Button>

                        <Button
                           variant="outline"
                           className="w-full justify-start gap-3 h-auto py-6"
                           asChild
                        >
                           <a
                              href={myLinkedinLink}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              <Linkedin className="h-5 w-5 text-blue-600" />
                              <div className="text-left">
                                 <div className="font-medium">LinkedIn</div>
                                 <div className="text-xs text-muted-foreground">
                                    {myLinkedinLink}
                                 </div>
                              </div>
                           </a>
                        </Button>
                     </div>
                  </CardContent>
               </Card>

               {/* Small info cards */}
               <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-muted/40">
                     <CardContent className="p-6 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <h4 className="font-medium mb-1">
                           {t('contact.responseTime', 'Response time')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                           {t(
                              'contact.responseTimeDesc',
                              'Usually 24–48 hours',
                           )}
                        </p>
                     </CardContent>
                  </Card>

                  <Card className="bg-muted/40">
                     <CardContent className="p-6 text-center">
                        <MapPin className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <h4 className="font-medium mb-1">
                           {t('contact.location', 'Based in')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                           Cairo, Egypt
                        </p>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}
