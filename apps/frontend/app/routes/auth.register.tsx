import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import type { ActionFunction, MetaFunction } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Register - Goal Tracker' },
];

export const action: ActionFunction = async ({ request }) => {
  const { User } = await import('../models/User');
  const { UserPsychologyProfile } = await import('../models/Analytics');
  const { hashPassword, isValidEmail, validatePasswordStrength } = await import('../utils/auth');
  const { createUserSession } = await import('../services/auth.server');

  if (request.method !== 'POST') {
    return null;
  }

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (!isValidEmail(email)) {
    return { error: 'Invalid email format' };
  }

  const passwordStrength = validatePasswordStrength(password);
  if (!passwordStrength.valid) {
    return { error: 'Password is too weak', feedback: passwordStrength.feedback };
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    const password_hash = await hashPassword(password);

    const user = new User({
      email: email.toLowerCase(),
      password_hash,
      total_points: 0,
      current_level: 1,
      streak_count: 0,
    });

    await user.save();

    const profile = new UserPsychologyProfile({
      user_id: user._id,
      chronotype: 'afternoon',
      emotional_baseline: 5,
      energy_baseline: 5,
    });

    await profile.save();

    return createUserSession({
      request,
      userId: user._id.toString(),
      remember: true,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'An error occurred. Please try again.' };
  }
};

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isLoading = navigation.state === 'submitting';

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg">
              GT
            </div>
            <span className="text-2xl font-bold text-white">Goal Tracker</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Start your journey<br />
            <span className="text-emerald-200">to better habits.</span>
          </h2>
          <p className="mt-6 text-lg text-emerald-100/80 max-w-md">
            Join thousands of high achievers who use science-backed tools to crush their goals every day.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">✓</div>
              <span>Psychology-based goal frameworks</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">✓</div>
              <span>Energy & mood tracking</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">✓</div>
              <span>Gamification & rewards system</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">✓</div>
              <span>Free forever for individuals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                GT
              </div>
              <span className="text-xl font-bold text-gray-900">Goal Tracker</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">Create account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
              Sign in
            </Link>
          </p>

          <Form method="post" className="mt-8 space-y-5">
            {actionData?.error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                <span className="text-lg">⚠️</span>
                {actionData.error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password <span className="font-normal text-gray-400">(min 8 characters)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  minLength={8}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength={8}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>

            <p className="text-center text-xs text-gray-400">
              By creating an account, you agree to our Terms of Service
            </p>
          </Form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
