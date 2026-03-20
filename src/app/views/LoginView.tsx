import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { cn } from '../components/ui/utils';
import { Loader2, ArrowLeft, Shield, Mail } from 'lucide-react';
import { InputOTP, InputOTPSlot } from '../components/ui/input-otp';

type LoginStep = 'email' | 'otp';

export function LoginView() {
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (email.toLowerCase() !== 'joao@emonelabs.com') {
      setError('Only verified business emails are allowed');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otpCode = '288451';
      setGeneratedOtp(otpCode);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError('');
    const otpValue = otp;

    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (otpValue !== generatedOtp) {
        setError('Invalid verification code. Please try again.');
        setOtp('');
        setIsSubmitting(false);
        return;
      }

      await login(email);
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtp('');
    setError('');
    setGeneratedOtp('');
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-8 md:p-12" onSubmit={step === 'email' ? handleEmailSubmit : undefined}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <img src={`${import.meta.env.BASE_URL}imgs/logo.svg`} alt="GrindSafe" className="h-12 w-auto" />
                  <h1 className="text-2xl font-bold">GrindSafe</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Professional Poker Analytics Platform
                  </p>
                </div>

                {step === 'email' ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          disabled={isSubmitting}
                          autoFocus
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start mb-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                          <Shield className="size-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Verify Your Email</h2>
                          <p className="text-sm text-muted-foreground">
                            Code sent to <span className="text-foreground font-medium">{email}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          value={otp}
                          onChange={setOtp}
                          onComplete={handleOtpSubmit}
                          maxLength={6}
                          disabled={isSubmitting}
                        >
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} className="h-12 w-12 text-center text-lg font-bold border-2" />
                          ))}
                        </InputOTP>
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      type="button"
                      onClick={handleOtpSubmit}
                      disabled={isSubmitting || otp.length !== 6}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  {step === 'email'
                    ? 'Secure access to your poker analytics dashboard'
                    : "Didn't receive the code? Check your spam folder."}
                </div>
              </div>
            </form>

            <div className="relative hidden bg-muted md:block">
              <img
                src={`${import.meta.env.BASE_URL}imgs/login-preview.jpg`
                alt="GrindSafe Preview"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        <p className="px-6 py-4 text-center text-xs text-muted-foreground">
          Secure · Professional · Real-time Analytics
        </p>
      </div>
    </div>
  );
}
