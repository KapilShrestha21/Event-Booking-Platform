import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema } from '../schemas/auth.schema.js';
import { useAuth } from '@/hooks/useAuth.js';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'customer' // Defaults to customer
    }
  });

  const onSubmit = async (data) => {
    try {
      const registerUser = await register(data);

      toast.success("Account created successfully!", {
        description: `Welcome aboard, ${registerUser?.name ?? "User"}!`
      });

      // Redirect based on role if applicable
      if (registerUser?.role === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error("Sign up failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/50 via-slate-50 to-emerald-50/30 p-4">
      <Card className="w-full sm:max-w-md shadow-xl border border-emerald-100/80 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pt-8 pb-4 px-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <form id="signup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="space-y-4">
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name" className="text-xs sm:text-sm font-medium text-slate-700">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      aria-invalid={fieldState.invalid}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-500 text-xs mt-1" />
                    )}
                  </Field>
                )}
              />

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
                        placeholder="Create a strong password"
                        autoComplete="new-password"
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

              {/* Role Selection Field */}
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-xs sm:text-sm font-medium text-slate-700">I am signing up as a:</FieldLabel>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => field.onChange('customer')}
                        className={`rounded-xl border p-2.5 text-xs font-medium transition-all ${
                          field.value === 'customer'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-500 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange('organizer')}
                        className={`rounded-xl border p-2.5 text-xs font-medium transition-all ${
                          field.value === 'organizer'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-500 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Event Organizer
                      </button>
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-8 px-6 pt-2">
          <Button
            type="submit"
            form="signup-form"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-700 transition-colors">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;