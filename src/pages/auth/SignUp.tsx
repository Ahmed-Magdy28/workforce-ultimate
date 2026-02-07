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

export default function Signup() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Validation
      if (!email || !password || !confirmPassword) {
         setError('All fields are required');
         return;
      }

      if (password !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      if (password.length < 8) {
         setError('Password must be at least 8 characters long');
         return;
      }

      setLoading(true);

      try {
         // Add your signup logic here
         console.log('Signup:', { email, password });

         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err: unknown) {
         console.log(err);
         setError('An error occurred during signup. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
         <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">
                  Create an account
               </CardTitle>
               <CardDescription className="text-center">
                  Enter your email and password to sign up
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
                     <Label htmlFor="password">Password</Label>
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

                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                           id="confirmPassword"
                           type={showConfirmPassword ? 'text' : 'password'}
                           placeholder="••••••••"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className="pl-10 pr-10"
                           required
                        />
                        <button
                           type="button"
                           onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                           }
                           className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                           {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                           ) : (
                              <Eye className="h-4 w-4" />
                           )}
                        </button>
                     </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Creating account...' : 'Sign up'}
                  </Button>
               </form>
            </CardContent>
            <CardFooter className="flex justify-center">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                     to="/login"
                     className="font-medium text-primary hover:underline"
                  >
                     Sign in
                  </Link>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
}
