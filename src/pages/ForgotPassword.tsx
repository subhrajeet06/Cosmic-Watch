import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarBackground } from '@/components/cosmic/StarBackground';
import { FloatingAsteroids } from '@/components/cosmic/FloatingAsteroids';
import { CosmicCard } from '@/components/cosmic/CosmicCard';
import { CosmicLogo } from '@/components/cosmic/CosmicLogo';
import { CosmicInput } from '@/components/cosmic/CosmicInput';
import { CosmicButton } from '@/components/cosmic/CosmicButton';
import { ArrowLeft, Check } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const isFormValid = email && !errors.email && validateEmail(email);

  return (
    <div className="min-h-screen relative overflow-hidden bg-cosmic flex items-center justify-center p-4">
      <StarBackground />
      <FloatingAsteroids />

      <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <CosmicCard>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <CosmicLogo size="md" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-cosmic mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to receive recovery instructions
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 bg-cosmic-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-cosmic-green" />
              </div>
              <p className="text-cosmic-green font-medium mb-6">
                Reset link sent to {email}
              </p>
              <Link to="/">
                <CosmicButton>
                  Return to Sign In
                </CosmicButton>
              </Link>
            </div>
          ) : (
            /* Form */
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

              {/* Submit Button */}
              <CosmicButton
                type="submit"
                disabled={!isFormValid}
                isLoading={isLoading}
              >
                {isLoading ? 'Transmitting...' : 'Send Reset Link'}
              </CosmicButton>

              {/* Back to Sign In */}
              <div className="text-center mt-6">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CosmicCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
