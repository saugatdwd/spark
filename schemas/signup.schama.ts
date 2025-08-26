import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const today = new Date();
const eighteenYearsAgo = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);
export const signupSchema = z
  .object({
    full_name: z
      .string({
        required_error: 'Full Name is required',
        invalid_type_error: 'Full Name is required',
      })
      .min(1, 'Full Name is required'),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Please enter a valid email',
      })
      .email('Please enter a valid email'),
    dob: z
      .date({
        required_error: 'Date of birth is required',
        invalid_type_error: 'Date of birth is required',
      })
      .max(eighteenYearsAgo, {
        message: 'You need to be at least 18 years old',
      }),
    gender: z.string({
      required_error: 'Gender is required',
      invalid_type_error: 'Gender is required',
    }).min(1, 'Gender is required'),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be at least 6 characters',
      })
      .min(6, 'Password must be at least 6 characters'),
    confirm_password: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password is required',
      })
      .min(1, 'Confirm Password is required'),
    location: z
      .string({
        required_error: 'Location is required',
        invalid_type_error: 'Location is required',
      })
      .min(1, 'Location is required'),
    profile_picture: z.any().optional(),
    preference: z.string({required_error: 'Preference is required', invalid_type_error: 'Preference is required',}).min(1, 'Preference is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

export type SignUpType = z.infer<typeof signupSchema>;
