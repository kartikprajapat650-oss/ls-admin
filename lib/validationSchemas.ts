import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const userValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['super-admin', 'sub-admin']).required('Role is required'),
});

export const contentValidationSchema = Yup.object({
  title: Yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  body: Yup.string().min(10, 'Body must be at least 10 characters').required('Body is required'),
});

export const permissionValidationSchema = Yup.object({
  key: Yup.string().required('Permission key is required'),
  name: Yup.string().required('Permission name is required'),
  description: Yup.string().required('Description is required'),
});
