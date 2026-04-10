import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function AppSettingsPage() {
   const { i18n } = useTranslation();

   return (
      <section className="space-y-6">
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
               Workspace settings page.
            </CardContent>
         </Card>

         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle>Language</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
               <Button
                  variant={i18n.language === 'en' ? 'default' : 'outline'}
                  onClick={() => i18n.changeLanguage('en')}
               >
                  English
               </Button>
               <Button
                  variant={i18n.language === 'ar' ? 'default' : 'outline'}
                  onClick={() => i18n.changeLanguage('ar')}
               >
                  العربية
               </Button>
            </CardContent>
         </Card>
      </section>
   );
}
