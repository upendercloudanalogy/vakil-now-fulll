'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, Shield, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { signupUser, verifyOtp } from '../../../redux/slices/auth/authThunks';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('USER');

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user,
    loading,
    error,
    isAuthenticated,
    isOtpSend,
    accessToken,
    refreshToken
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !error) {
      if (user.type === 'ADMIN') {
        router.push('/dashboard');
      } else if (user.type === 'USER') {
        router.push('/customer/dashboard');
      } else if (user.type === 'LAWYER') {
        router.push('/customer/dashboard');
      }
    }
  }, [isAuthenticated, error, router]);

  // useEffect(() => {
  //   setIsOtpSent(isOtpSend);
  // }, [isOtpSend]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - exactly 10 digits
    if (!phone.match(/^\d{10}$/)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    const res = await dispatch(signupUser({ phone, type: userType }));

    if (signupUser.fulfilled.match(res)) {
      setIsOtpSent(true); // ✅ only here
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - exactly 6 digits
    if (!otp.match(/^\d{6}$/)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    const userPhone = user?.phone;

    setIsLoading(true);

    await dispatch(verifyOtp({ userPhone, otp, type: userType }))
    setIsLoading(false);
  };

  // Handle phone input - only allow numbers, max 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  // Handle OTP input - only allow numbers, max 6 digits
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 flex items-center justify-center'>
      <main className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
              <Shield className='w-8 h-8 text-primary' />
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Secure Login
          </h1>
          <p className='text-gray-600'>
            Enter your phone number to get started
          </p>
        </div>

        <Card className='shadow-lg border-0 p-4'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>
              {isOtpSent ? 'Enter OTP' : 'Login with Phone'}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {isOtpSent
                ? `We've sent a 6-digit code to ${phone}`
                : "We'll send you a one-time password"}
            </CardDescription>
          </CardHeader>

          {!isOtpSent && (
            <div className='flex justify-between gap-2 mb-4'>
              {['USER', 'ADMIN', 'LAWYER'].map((type) => (
                <button
                  key={type}
                  type='button'
                  onClick={() => setUserType(type)}
                  className={`
        flex-1 py-2 rounded-md font-medium text-sm
        transition-colors duration-200
        ${userType === type ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
      `}>
                  {type}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={isOtpSent ? handleLogin : handleSendOtp}>
            <CardContent className='space-y-6'>
              {!isOtpSent ? (
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='phone' className='text-sm font-medium'>
                      Phone Number
                    </Label>
                    <div className='relative'>
                      <Smartphone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                      <Input
                        id='phone'
                        type='text'
                        inputMode='numeric'
                        placeholder='Enter 10-digit number'
                        value={phone}
                        onChange={handlePhoneChange}
                        className='pl-10 h-12'
                        required
                        disabled={isLoading}
                        pattern='\d*'
                      />
                    </div>
                    <p className='text-xs text-gray-500'>
                      Enter without country code (10 digits only)
                    </p>
                  </div>
                  {error && <div className='text-sm text-red-600'>{error}</div>}
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='otp' className='text-sm font-medium'>
                      One-Time Password
                    </Label>
                    <div className='relative'>
                      <KeyRound className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                      <Input
                        id='otp'
                        type='text'
                        inputMode='numeric'
                        placeholder='000000'
                        value={otp}
                        onChange={handleOtpChange}
                        className='pl-10 h-12 text-center text-lg tracking-widest font-semibold'
                        required
                        disabled={isLoading}
                        pattern='\d*'
                        maxLength={6}
                      />
                    </div>
                    <p className='text-xs text-gray-500 text-center'>
                      Enter the 6-digit code sent to your phone
                    </p>
                    {error && (
                      <p className="text-sm text-red-600 text-center">
                        {error}
                      </p>
                    )}
                  </div>


                  <div className='pt-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtp('');
                      }}
                      className='text-sm text-gray-600 hover:text-gray-900 hover:underline flex items-center gap-1'>
                      ← Use different number
                    </button>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className='flex-col gap-3'>
              <Button
                type='submit'
                className='w-full h-12 text-base font-medium'
                disabled={
                  isLoading ||
                  (isOtpSent && otp.length !== 6) ||
                  (!isOtpSent && phone.length !== 10)
                }>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {isOtpSent ? 'Verifying...' : 'Sending...'}
                  </>
                ) : isOtpSent ? (
                  'Verify OTP'
                ) : (
                  'Send OTP'
                )}
              </Button>

              {!isOtpSent && (
                <div className='text-center w-full'>
                  <p className='text-sm text-gray-600 mt-4'>
                    By continuing, you agree to our{' '}
                    <a
                      href='#'
                      className='text-primary hover:underline font-medium'>
                      Terms
                    </a>{' '}
                    and{' '}
                    <a
                      href='#'
                      className='text-primary hover:underline font-medium'>
                      Privacy Policy
                    </a>
                  </p>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>

        <div className='mt-8 text-center'>
          <p className='text-gray-600 text-sm'>
            Need help?{' '}
            <a href='#' className='text-primary font-medium hover:underline'>
              Contact Support
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
