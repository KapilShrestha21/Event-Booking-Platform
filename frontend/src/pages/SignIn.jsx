import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signinSchema } from '../schemas/auth.schema.js';
import { useAuth } from '@/hooks/useAuth.js';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve intended destination from ProtectedRoute if available
  const from = location.state?.from?.pathname;

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const loggedInUser = await login(data);

      toast.success("Welcome back!", {
        description: `Signed in as ${loggedInUser?.email ?? 'User'}`
      });

      // 1. Return user to attempted protected route if available
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // 2. Fallback navigation based on user role matching AppRoutes.jsx
      if (loggedInUser?.role === 'organizer' || loggedInUser?.role === 'admin') {
        navigate('/organizer/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (error) {
      toast.error("Sign in failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          'Invalid email or password'
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/50 via-slate-50 to-emerald-50/30 p-4">
      <Card className="w-full sm:max-w-md shadow-xl border border-emerald-100/80 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pt-8 pb-4 px-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <form id="signin-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="space-y-4">
              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email" className="text-xs sm:text-sm font-medium text-slate-700">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-500 text-xs mt-1" />
                    )}
                  </Field>
                )}
              />

              {/* Password Field with Toggle */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password" className="text-xs sm:text-sm font-medium text-slate-700">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="pr-10 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-500 text-xs mt-1" />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-8 px-6 pt-2">
          <Button
            type="submit"
            form="signin-form"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-700 transition-colors">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;