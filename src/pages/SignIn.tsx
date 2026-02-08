import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StarBackground } from '@/components/cosmic/StarBackground';
import { FloatingAsteroids } from '@/components/cosmic/FloatingAsteroids';
import { CosmicCard } from '@/components/cosmic/CosmicCard';
import { CosmicLogo } from '@/components/cosmic/CosmicLogo';
import { CosmicInput } from '@/components/cosmic/CosmicInput';
import { CosmicButton } from '@/components/cosmic/CosmicButton';
import { RealtimeChat } from '@/components/chat/RealtimeChat';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }
    if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return;
    }

    setIsLoading(true);

    // Store email for profile display
    localStorage.setItem('userEmail', email);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const isFormValid = email && password && !errors.email && !errors.password && validateEmail(email) && password.length >= 6;

  return (
    <div className="min-h-screen relative overflow-hidden bg-cosmic flex items-center justify-center p-4">
      <StarBackground />
      <FloatingAsteroids />

      <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <CosmicCard>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <CosmicLogo size="lg" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-cosmic mb-2">
              Welcome to
            </h1>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-cosmic mb-2">
              Cosmic Watch
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Track Near-Earth Objects in Real Time
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <CosmicInput
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              placeholder="astronaut@cosmic.space"
              error={errors.email}
            />

            <CosmicInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <CosmicButton
              type="submit"
              disabled={!isFormValid}
              isLoading={isLoading}
            >
              {isLoading ? 'Launching...' : 'Sign In'}
            </CosmicButton>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-foreground/10" />
            <span className="px-4 text-muted-foreground text-sm">OR</span>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          {/* Create Account */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <button 
                type="button"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </CosmicCard>
      </div>

      {/* Realtime Chat Widget */}
      <RealtimeChat />
    </div>
  );
};

export default SignIn;
