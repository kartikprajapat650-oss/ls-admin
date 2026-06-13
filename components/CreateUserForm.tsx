"use client";

import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axiosConfig';
import { catchResponse } from '../lib/catchResponse';
import { userValidationSchema } from '../lib/validationSchemas';

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      role: 'sub-admin',
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosInstance.post('/api/users', values);
        toast.success('User created successfully!');
        resetForm();
        onSuccess();
      } catch (error) {
        catchResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (field: keyof typeof formik.errors) => {
    return formik.touched[field] && formik.errors[field];
  };

  return (
    <div className="rounded-3xl bg-slate-900/85 p-8 shadow-xl shadow-slate-950/20">
      <h3 className="text-xl font-semibold text-white mb-6">Create New User</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Email</label>
          <input
            type="email"
            {...formik.getFieldProps('email')}
            className={`w-full rounded-2xl border px-4 py-2 text-white focus:outline-none transition ${
              getFieldError('email') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
            }`}
          />
          {getFieldError('email') && <p className="mt-1 text-xs text-rose-400">{formik.errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Name</label>
          <input
            type="text"
            {...formik.getFieldProps('name')}
            className={`w-full rounded-2xl border px-4 py-2 text-white focus:outline-none transition ${
              getFieldError('name') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
            }`}
          />
          {getFieldError('name') && <p className="mt-1 text-xs text-rose-400">{formik.errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Password</label>
          <input
            type="password"
            {...formik.getFieldProps('password')}
            className={`w-full rounded-2xl border px-4 py-2 text-white focus:outline-none transition ${
              getFieldError('password') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
            }`}
          />
          {getFieldError('password') && <p className="mt-1 text-xs text-rose-400">{formik.errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Role</label>
          <select
            {...formik.getFieldProps('role')}
            className={`w-full rounded-2xl border px-4 py-2 text-white focus:outline-none transition ${
              getFieldError('role') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
            }`}
          >
            <option value="sub-admin">Sub Admin</option>
            <option value="super-admin">Super Admin</option>
          </select>
          {getFieldError('role') && <p className="mt-1 text-xs text-rose-400">{formik.errors.role}</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60 transition"
          >
            {formik.isSubmitting ? 'Creating...' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              onCancel();
            }}
            className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
