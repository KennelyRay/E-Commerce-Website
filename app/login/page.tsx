'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/Navbar';
import { PageLoader, Spinner, Wordmark } from '@/components/ui';

type Mode = 'signin' | 'register';

type FieldErrors = Partial<Record<'name' | 'username' | 'email' | 'password' | 'confirmPassword', string>>;

function safeNext(value: string | null) {
  // Only allow in-app paths so the redirect cannot be pointed at another site.
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`field pr-12 ${error ? 'field-error' : ''}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`field ${error ? 'field-error' : ''}`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function LoginForm() {
  const { user, isLoading: isAuthLoading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams?.get('next') ?? null);
  const [mode, setMode] = useState<Mode>(searchParams?.get('mode') === 'register' ? 'register' : 'signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (user) {
      router.replace(next ?? (user.isAdmin ? '/admin' : '/'));
    }
  }, [user, router, next]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!form.username.trim()) {
      nextErrors.username = mode === 'signin' ? 'Enter your username or email.' : 'Choose a username.';
    }
    if (!form.password) {
      nextErrors.password = 'Enter your password.';
    }
    if (mode === 'register') {
      if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.';
      if (form.username.trim() && form.username.trim().length < 3) nextErrors.username = 'Use at least 3 characters.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.';
      if (form.password && form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
      if (form.username.trim() && !/^[a-zA-Z0-9._-]+$/.test(form.username.trim())) nextErrors.username = 'Use letters, numbers, dots, dashes or underscores.';
      if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    const result =
      mode === 'signin'
        ? await login(form.username.trim(), form.password)
        : await register(form.name.trim(), form.username.trim(), form.email.trim(), form.password);
    setIsSubmitting(false);

    if (!result.ok) {
      const field = result.field as keyof FieldErrors | undefined;
      if (field && field in form) {
        setErrors((current) => ({ ...current, [field]: result.message }));
        document.getElementById(field)?.focus();
      } else {
        setFormError(result.message);
      }
    }
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setErrors({});
    setFormError(null);
  };

  if (isAuthLoading || user) {
    return <PageLoader label={user ? 'Signing you in' : 'Loading'} />;
  }

  return (
    <div className="w-full max-w-[420px] animate-pop-in">
      <h1 className="text-3xl font-bold">{mode === 'signin' ? 'Sign in' : 'Create your account'}</h1>
      <p className="mt-2 text-muted">
        {next === '/checkout'
          ? 'Sign in to finish checking out. Your cart is saved.'
          : mode === 'signin'
            ? 'Use your username or the email you registered with.'
            : 'Takes a minute. You will need it to check out and track orders.'}
      </p>

      <div className="mt-6 grid grid-cols-2 rounded-control border border-line bg-sunken p-1" role="tablist" aria-label="Account">
        {(['signin', 'register'] as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            onClick={() => switchMode(option)}
            className={`min-h-[40px] rounded-[4px] text-sm font-semibold transition-colors ${
              mode === option ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {option === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {mode === 'register' && (
          <TextField id="name" label="Full name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        )}
        <TextField
          id="username"
          label={mode === 'signin' ? 'Username or email' : 'Username'}
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />
        {mode === 'register' && (
          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            hint="Order confirmations go here."
          />
        )}
        <PasswordField
          id="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />
        {mode === 'register' && (
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        )}

        {formError && (
          <p role="alert" className="animate-fade-in rounded-control border border-danger/40 bg-danger/5 px-3 py-2.5 text-sm text-danger">
            {formError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-dark w-full">
          {isSubmitting && <Spinner />}
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,560px)]">
      <div className="flex flex-col">
        <header className="shell flex h-16 items-center justify-between">
          <Link href="/" prefetch={false} aria-label="VertixHub home">
            <Wordmark />
          </Link>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <Suspense fallback={<PageLoader />}>
            <LoginForm />
          </Suspense>
        </div>
        <div className="shell pb-6">
          <Link href="/" prefetch={false} className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the store
          </Link>
        </div>
      </div>

      <aside className="hidden border-l border-line bg-surface lg:flex lg:flex-col lg:justify-center lg:px-14">
        <p className="spec-key">Why an account</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight">Browse freely. Sign in when you are ready to buy.</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {[
            ['Checkout', 'Orders are tied to your account so you can see them later.'],
            ['Order history', 'Totals, payment method and delivery estimate for every order.'],
            ['Saved build', 'The PC Builder remembers one saved build on this device.'],
          ].map(([term, detail]) => (
            <div key={term} className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm">
              <dt className="font-semibold">{term}</dt>
              <dd className="text-muted">{detail}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
