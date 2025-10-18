import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react'; // Import icons for better visuals

// Helper component for input field with icon (reused from the Signup component for consistency)
const IconInput = ({ Icon, label, ...props }: any) => (
  <div className="space-y-2">
    <Label htmlFor={props.id} className="text-sm font-medium text-gray-700">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className="pl-10 h-10" {...props} />
    </div>
  </div>
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // **BACKEND LOGIC REMAINS UNTOUCHED**
      const user = await login(username, password);
      toast.success('Login successful!');
      
      // **NAVIGATION LOGIC REMAINS UNTOUCHED**
      const userType = user?.profile?.user_type || user?.user_type || user?.profile?.userType;
      if (userType && userType.toString().toLowerCase() === 'warden') {
        navigate('/warden-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 sm:px-6 flex items-center justify-center min-h-screen py-12 bg-gray-50"> {/* Enhanced background, responsive padding */}
      <Card className="w-full max-w-sm shadow-2xl border-t-4 border-blue-600 transition-all duration-300 hover:shadow-3xl"> {/* Enhanced card style */}
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back!</CardTitle>
          <CardDescription className="text-md text-gray-600">Sign in to your HostelHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased vertical spacing */}
            
            <IconInput
              Icon={User}
              label="Username"
              id="username"
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              required
            />

            <IconInput
              Icon={Lock}
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />

            <Button 
              type="submit" 
              className="w-full h-10 text-base font-semibold transition-all duration-300 flex items-center justify-center" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Log In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <span className="mr-1">Don't have an account?</span>
            <Link 
              to="/signup" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;