"use client";

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { catchResponse } from '../lib/catchResponse';
import { loginValidationSchema } from '../lib/validationSchemas';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
          device: 'web',
          browser: 'Next.js',
          callbackUrl: '/dashboard',
        });

        if (result?.ok) {
          toast.success('Login successful!');
          router.push('/dashboard');
          return;
        }

        toast.error(result?.error || 'Invalid credentials');
      } catch (error) {
        catchResponse(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const getFieldError = (field: string) => {
    return formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors];
  };

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md w-full mx-auto rounded-3xl bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
      <h1 className="text-3xl font-semibold mb-6">Admin Login</h1>

      <label className="block mb-4">
        <span className="text-sm text-slate-300">Email</span>
        <input
          type="email"
          {...formik.getFieldProps('email')}
          className={`mt-2 block w-full rounded-2xl border px-4 py-3 text-white focus:outline-none transition ${
            getFieldError('email') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
          }`}
        />
        {getFieldError('email') && <p className="mt-1 text-xs text-rose-400">{formik.errors.email}</p>}
      </label>

      <label className="block mb-6">
        <span className="text-sm text-slate-300">Password</span>
        <input
          type="password"
          {...formik.getFieldProps('password')}
          className={`mt-2 block w-full rounded-2xl border px-4 py-3 text-white focus:outline-none transition ${
            getFieldError('password') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
          }`}
        />
        {getFieldError('password') && <p className="mt-1 text-xs text-rose-400">{formik.errors.password}</p>}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="mt-6 text-xs text-slate-500">
        Demo credentials: <br />
        Super Admin: admin@gmail.com / Admin123 <br />
        Sub Admin: subadmin@gmail.com / SubAdmin123
      </p>
    </form>
  );
}
