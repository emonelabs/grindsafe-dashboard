import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Mail, LogIn, Loader2, ArrowLeft, Shield, Activity } from 'lucide-react';

type LoginStep = 'email' | 'otp';

export function LoginView() {
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if email is authorized
    if (email.toLowerCase() !== 'joao@emonelabs.com') {
      setError('Only verified business emails are allowed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Static OTP code
      const otpCode = '288451';
      setGeneratedOtp(otpCode);
      
      // Move to OTP step
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(v => !v);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpInputs.current[focusIndex]?.focus();
  };

  // Auto-submit when all OTP digits are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '') && !isSubmitting) {
      handleOtpSubmit();
    }
  }, [otp]);

  // Handle OTP verification
  const handleOtpSubmit = async () => {
    setError('');
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);

    try {
      // Verify OTP
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (otpValue !== generatedOtp) {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        otpInputs.current[0]?.focus();
        setIsSubmitting(false);
        return;
      }

      // OTP verified, proceed with login
      await login(email);
      // Login successful - user will be redirected by useEffect hook
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back to email
  const handleBack = () => {
    setStep('email');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setGeneratedOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-xl mb-4 shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GrindSafe</h1>
          <p className="text-gray-600 font-medium">Professional Poker Analytics Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {step === 'email' ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-sm text-gray-600">Enter your email to receive a verification code</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder-gray-400 transition-all"
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Continue
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <Shield className="w-5 h-5 text-gray-900" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                </div>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpInputs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 transition-all"
                        disabled={isSubmitting}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleOtpSubmit}
                  disabled={isSubmitting || otp.some(d => !d)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {step === 'email' 
                ? 'Secure access to your poker analytics dashboard'
                : 'Didn\'t receive the code? Check your spam folder or go back to resend.'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-medium">
            Secure · Professional · Real-time Analytics
          </p>
        </div>
      </div>
    </div>
  );
}
