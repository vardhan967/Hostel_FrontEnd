import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, University, CheckCircle, Shield, Briefcase, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Helper component for input field with icon (Moved outside component for cleaner definition)
const IconInput = ({ Icon, label, ...props }: any) => (
  <div className="space-y-2">
    <Label htmlFor={props.id} className="font-medium text-gray-700">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" {...props} />
    </div>
  </div>
);


const Signup = () => {
  // FUNCTIONALITY UNTOUCHED: State definitions
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [college, setCollege] = useState('');
  const [userType, setUserType] = useState<'customer' | 'warden'>('customer');
  const [loading, setLoading] = useState(false);
  // FUNCTIONALITY UNTOUCHED: Auth context and navigation
  const { register } = useAuth();
  const navigate = useNavigate();

  const isStudent = userType === 'customer';
  const isWarden = userType === 'warden';

  // FUNCTIONALITY UNTOUCHED: Form submission logic (validation and API call)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validation for required fields
    if (!identifier || !name || !phoneNumber || !address) {
      toast.error('Please fill all required fields.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (isStudent && (!rollNo || !college)) {
      toast.error('Roll number and college are required for students.');
      setLoading(false);
      return;
    }
    try {
      // FUNCTIONALITY UNTOUCHED: register function call
      await register({
        email: identifier,
        username: identifier,
        password,
        name,
        phone_number: phoneNumber,
        address,
        user_type: isStudent ? 'STUDENT' : isWarden ? 'WARDEN' : 'STRANGER',
        roll_no: isStudent ? rollNo : undefined,
        college: isStudent ? college : undefined,
      });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 sm:px-6 flex items-center justify-center min-h-screen py-12 bg-gray-50">
      <Card className="w-full max-w-lg shadow-2xl border-t-4 border-blue-600 transition-shadow duration-300 hover:shadow-3xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-extrabold text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-lg text-gray-600">Join HostelHub today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* User Type Selection - FIX: Wrapped content in <Label> for full click area */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-inner">
              <Label className="text-sm font-bold text-blue-800 mb-3 block">Select Account Type</Label>
              <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'customer' | 'warden')} className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                
                {/* Student/Customer Option */}
                <Label 
                  htmlFor="customer" 
                  className={`flex-1 p-3 border-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center space-x-3 ${isStudent ? 'border-blue-600 bg-white' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}
                >
                  <RadioGroupItem value="customer" id="customer" className="hidden" />
                  <User className={`h-6 w-6 ${isStudent ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-semibold text-base ${isStudent ? 'text-blue-700' : 'text-gray-700'}`}>
                    Student/Customer
                  </span>
                </Label>

                {/* Hostel Warden Option */}
                <Label 
                  htmlFor="warden" 
                  className={`flex-1 p-3 border-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center space-x-3 ${isWarden ? 'border-blue-600 bg-white' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}
                >
                  <RadioGroupItem value="warden" id="warden" className="hidden" />
                  <Shield className={`h-6 w-6 ${isWarden ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-semibold text-base ${isWarden ? 'text-blue-700' : 'text-gray-700'}`}>
                    Hostel Warden
                  </span>
                </Label>

              </RadioGroup>
            </div>

            {/* Form Fields - Mobile Friendly Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              <IconInput
                Icon={Mail}
                label="Email or Username"
                id="identifier"
                type="text"
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e: any) => setIdentifier(e.target.value)}
                required
              />

              <IconInput
                Icon={User}
                label="Full Name"
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
              />

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                <Lock className="absolute left-3 top-9 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button type="button" className="absolute right-3 top-9 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(s => !s)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</Label>
                <CheckCircle className="absolute left-3 top-9 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <IconInput
                Icon={Phone}
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="e.g., +91 98765 43210"
                value={phoneNumber}
                onChange={(e: any) => setPhoneNumber(e.target.value)}
                required
              />

              <IconInput
                Icon={MapPin}
                label="Address"
                id="address"
                type="text"
                placeholder="Enter your current address"
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Student Specific Fields - Mobile Friendly Grid */}
            {isStudent && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t pt-4 mt-4 border-dashed border-gray-300">
                <IconInput
                  Icon={Briefcase}
                  label="Roll Number"
                  id="rollNo"
                  type="text"
                  placeholder="Enter your university roll number"
                  value={rollNo}
                  onChange={(e: any) => setRollNo(e.target.value)}
                  required
                />
                <IconInput
                  Icon={University}
                  label="College/University"
                  id="college"
                  type="text"
                  placeholder="Enter your college/university name"
                  value={college}
                  onChange={(e: any) => setCollege(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full text-lg h-12 mt-6 transition-all duration-300 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Log in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;