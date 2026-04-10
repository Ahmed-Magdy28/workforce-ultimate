import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpPage() {
   return (
      <Card className="shadow-sm">
         <CardHeader>
            <CardTitle>Help</CardTitle>
         </CardHeader>
         <CardContent className="text-sm leading-6 text-muted-foreground">
            Help page placeholder.
         </CardContent>
      </Card>
   );
}
