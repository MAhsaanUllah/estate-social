import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';
import { Building2, Mail, Lock, User, Phone, Building, Eye, EyeOff, AlertCircle, Shield, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  role: z.enum(['buyer', 'agent']),
  agencyName: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.role === 'buyer' || (data.role === 'agent' && data.agencyName && data.agencyName.trim().length > 0), {
  message: "Agency name is required for agents",
  path: ["agencyName"],
});

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'buyer'
    }
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (error) dispatch(clearError());

    const { confirmPassword, ...submitData } = data;
    const result = await dispatch(registerUser(submitData));
    
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>Create Account | EstateSocial</title>
        <meta name="description" content="Sign up for EstateSocial to discover, buy, or list properties in Pakistan." />
      </Helmet>
      <div className="max-w-[420px] w-full">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">Create your account</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Join EstateSocial today</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  error={!!errors.name}
                  className="pl-10"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-[13px] text-red-600 dark:text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  error={!!errors.email}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-[13px] text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            {/* Phone & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    error={!!errors.phone}
                    className="pl-9 text-xs"
                    placeholder="03001234567"
                  />
                </div>
                {errors.phone && <p className="mt-1.5 text-[12px] text-red-600 dark:text-red-400">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                  City
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                  <Input
                    id="city"
                    type="text"
                    {...register('city')}
                    error={!!errors.city}
                    className="pl-9 text-xs"
                    placeholder="Lahore"
                  />
                </div>
                {errors.city && <p className="mt-1.5 text-[12px] text-red-600 dark:text-red-400">{errors.city.message}</p>}
              </div>
            </div>

            {/* Account Type / Persona Selection */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-2">
                I am joining as:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setValue('role', 'buyer')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    selectedRole === 'buyer'
                      ? 'border-gray-900 dark:border-zinc-100 bg-gray-50 dark:bg-zinc-800/80 ring-1 ring-gray-900 dark:ring-zinc-100'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedRole === 'buyer' ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'}`}>
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Buyer / Direct Owner</span>
                    <span className="block text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Explore homes or list your own with 0% broker fee</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'agent')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    selectedRole === 'agent'
                      ? 'border-gray-900 dark:border-zinc-100 bg-gray-50 dark:bg-zinc-800/80 ring-1 ring-gray-900 dark:ring-zinc-100'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedRole === 'agent' ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'}`}>
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Estate Agent / Agency</span>
                    <span className="block text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Agency portfolio, Blue Shield 🛡️ & Lead CRM</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Agency Name */}
            {selectedRole === 'agent' && (
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 space-y-1.5 animate-fadeIn">
                <label htmlFor="agencyName" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300">
                  Real Estate Agency / Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                  <Input
                    id="agencyName"
                    type="text"
                    {...register('agencyName')}
                    error={!!errors.agencyName}
                    className="pl-10"
                    placeholder="e.g., Al-Haram Real Estate (DHA Phase 6)"
                  />
                </div>
                {errors.agencyName && <p className="text-[12px] text-red-600 dark:text-red-400">{errors.agencyName.message}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[13px] text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-[13px] text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded mt-0.5 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-600 dark:text-zinc-400 cursor-pointer">
                I agree to the <Link to="/terms" className="text-gray-900 dark:text-zinc-100 font-semibold underline">Terms</Link> and <Link to="/privacy" className="text-gray-900 dark:text-zinc-100 font-semibold underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full h-11 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </Button>
          </form>

          {/* Social Row */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                disabled
                className="flex justify-center items-center py-2.5 px-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-xs font-medium text-gray-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
              >
                Google (Coming soon)
              </button>
              <button
                disabled
                className="flex justify-center items-center py-2.5 px-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-xs font-medium text-gray-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
              >
                Facebook (Coming soon)
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-gray-900 dark:text-zinc-100 hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;