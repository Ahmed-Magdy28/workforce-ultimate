'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
   children: ReactNode;
   fallback?: ReactNode;
};

type State = {
   hasError: boolean;
   error: Error | null;
};

export class GlobalErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false, error: null };
   }

   static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
   }

   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Unhandled UI exception:', error, errorInfo);
   }

   handleReset = () => {
      this.setState({ hasError: false, error: null });
      if (typeof window !== 'undefined') {
         window.location.reload();
      }
   };

   render() {
      if (this.state.hasError) {
         if (this.props.fallback) {
            return this.props.fallback;
         }

         return (
            <div className="flex min-h-screen items-center justify-center p-4">
               <Card className="w-full max-w-md border-destructive/20 shadow-lg">
                  <CardHeader className="text-center">
                     <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="size-6" />
                     </div>
                     <CardTitle className="text-xl">
                        Something went wrong
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                     <p className="text-sm text-muted-foreground">
                        {this.state.error?.message ||
                           'An unexpected error occurred while loading this view.'}
                     </p>
                     <Button onClick={this.handleReset} className="w-full">
                        <RefreshCcw className="mr-2 size-4" />
                        Reload Page
                     </Button>
                  </CardContent>
               </Card>
            </div>
         );
      }

      return this.props.children;
   }
}

export default GlobalErrorBoundary;
