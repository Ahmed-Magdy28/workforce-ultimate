import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MorePage() {
   return (
      <Card className="shadow-sm">
         <CardHeader>
            <CardTitle>More</CardTitle>
         </CardHeader>
         <CardContent className="text-sm leading-6 text-muted-foreground">
            More section placeholder for future tools.
         </CardContent>
      </Card>
   );
}
