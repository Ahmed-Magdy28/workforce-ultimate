import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
   return (
      <Card className="shadow-sm">
         <CardHeader>
            <CardTitle>Home</CardTitle>
         </CardHeader>
         <CardContent className="text-sm leading-6 text-muted-foreground">
            This will route to the correct dashboard later based on the logged-in
            user role.
         </CardContent>
      </Card>
   );
}
