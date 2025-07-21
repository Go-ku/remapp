'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (!res.ok) {
        setError('root', { message: result.error || 'Registration failed' });
      } else {
        router.push('/signin'); // or auto-login
      }
    } catch (err) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md w-full bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Register</h2>

      {errors.root?.message && (
        <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
      )}

      <div>
        <input
          {...register('name', { required: 'Name is required' })}
          className="w-full p-2 border rounded"
          placeholder="Name"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
