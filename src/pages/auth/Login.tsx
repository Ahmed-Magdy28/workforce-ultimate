import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
   // TODO: when finish to remove this fake data
   const testData = {
      email: 'test@gmail.com',
      password: '123456789',
   };

   const [email, setEmail] = useState(testData.email);
   const [password, setPassword] = useState(testData.password);
   const [showPassword, setShowPassword] = useState(false);
   const [rememberMe, setRememberMe] = useState(false);
   const [error, setError] = useState('');
   const { login, isPending } = useLogin();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Validation
      if (!email || !password) {
         setError('Email and password are required');
         return;
      }

      login({ email, password });
   };
   if (isPending) return <Spinner />;

   return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
         <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">
                  Welcome back
               </CardTitle>
               <CardDescription className="text-center">
                  Enter your credentials to access your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}

                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                           id="email"
                           type="email"
                           placeholder="name@example.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="pl-10"
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                           to="/forgot-password"
                           className="text-sm text-primary hover:underline"
                        >
                           Forgot password?
                        </Link>
                     </div>
                     <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                           id="password"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="••••••••"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="pl-10 pr-10"
                           required
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                           {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                           ) : (
                              <Eye className="h-4 w-4" />
                           )}
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                           setRememberMe(checked as boolean)
                        }
                     />
                     <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Remember me
                     </label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                     {isPending ? 'Signing in...' : 'Sign in'}
                  </Button>
               </form>
            </CardContent>
            <CardFooter className="flex justify-center">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                     to="/signup"
                     className="font-medium text-primary hover:underline"
                  >
                     Sign up
                  </Link>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
}
