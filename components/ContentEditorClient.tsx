"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axiosConfig';
import { catchResponse } from '../lib/catchResponse';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { contentValidationSchema } from '../lib/validationSchemas';

interface ContentEditorClientProps {
  slug: string;
  title: string;
}

interface ContentPage {
  _id: string; 
  slug: string;
  title: string;
  body: string;
  updatedBy: string;
}

export default function ContentEditorClient({ slug, title }: ContentEditorClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchContent();
    }
  }, [status, router]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/content/${slug}`);
      setContent(response.data.page);
    } catch (error) {
      catchResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: content?.title || title,
      body: content?.body || '',
    },
    validationSchema: contentValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axiosInstance.put(`/api/content/${slug}`, values);
        toast.success('Content updated successfully!');
        fetchContent();
      } catch (error) {
        catchResponse(error);
      }
     },
  });

  const getFieldError = (field: keyof typeof formik.errors) => {
    return formik.touched[field] && formik.errors[field];
  };

  if (status === 'loading') {
    return <div className="p-8 text-center text-slate-300">Loading session...</div>;
  }

  if (!session) {
    return null;
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-300">Loading content...</div>;
  }

  return (
    <section className="rounded-3xl bg-slate-900/85 p-8 shadow-xl shadow-slate-950/20">
      <h2 className="text-2xl font-semibold text-white mb-6">{title}</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Title</label>
          <input
            type="text"
            {...formik.getFieldProps('title')}
            className={`w-full rounded-2xl border px-4 py-2 text-white focus:outline-none transition ${
              getFieldError('title') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
            }`}
          />
          {getFieldError('title') && <p className="mt-1 text-xs text-rose-400">{formik.errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Content</label>
          <textarea
            {...formik.getFieldProps('body')}
            rows={12}
            className={`w-full rounded-2xl border px-4 py-2 text-white focus:outline-none transition font-mono text-sm ${
              getFieldError('body') ? 'border-rose-500 bg-rose-950/20 focus:border-rose-500' : 'border-slate-700 bg-slate-950 focus:border-sky-500'
            }`}
          />
          {getFieldError('body') && <p className="mt-1 text-xs text-rose-400">{formik.errors.body}</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-2xl bg-sky-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60 transition"
          >
            {formik.isSubmitting ? 'Saving...' : 'Save Content'}
          </button>
        </div>

        {content?.updatedBy && (
          <p className="text-xs text-slate-500">Last updated by {content.updatedBy}</p>
        )}
      </form>
    </section>
  );
}
