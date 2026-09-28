'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/Navbar';
import { BoardArt } from '@/components/BoardArt';
import { PageLoader, Spinner, Wordmark } from '@/components/ui';

type Mode = 'signin' | 'register';
type FormState = { name: string; username: string; email: string; password: string; confirmPassword: string };
type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME = /^[a-zA-Z0-9._-]+$/;
const TRACE_COUNT = 5;

function safeNext(value: string | null) {
  // Only allow in-app paths so the redirect cannot be pointed at another site.
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

/** Fields that currently pass validation, used to light the board. */
function readyFields(mode: Mode, form: FormState) {
  const checks =
    mode === 'signin'
      ? [form.username.trim().length > 0, form.password.length > 0]
      : [
          form.name.trim().length >= 2,
          form.username.trim().length >= 3 && USERNAME.test(form.username.trim()),
          EMAIL.test(form.email.trim()),
          form.password.length >= 8,
          form.confirmPassword.length > 0 && form.confirmPassword === form.password,
        ];
  return { ready: checks.filter(Boolean).length, total: checks.length };
}

function passwordStrength(password: string) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1;
  if (password.length < 8) score = 0;
  const levels = [
    { label: 'Too short', tone: 'bg-danger', text: 'text-danger' },
    { label: 'Weak', tone: 'bg-danger', text: 'text-danger' },
    { label: 'Fair', tone: 'bg-warn', text: 'text-warn' },
    { label: 'Good', tone: 'bg-ok', text: 'text-ok' },
    { label: 'Strong', tone: 'bg-ok', text: 'text-ok' },
  ];
  return { score, ...levels[score] };
}

/** Animates a block open and closed; hidden fields are disabled so they are skipped. */
function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className={`overflow-hidden transition-[visibility] duration-300 ${open ? 'visible' : 'invisible'}`}>
        <fieldset disabled={!open} className="pb-4">
          {children}
        </fieldset>
      </div>
    </div>
  );
}

function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: React.ReactNode }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-1.5 animate-fade-in text-sm text-danger">
        {error}
      </p>
    );
  }
  return hint ? (
    <div id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
      {hint}
    </div>
  ) : null;
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
  id: keyof FormState;
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
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  hint,
}: {
  id: keyof FormState;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete: string;
  hint?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const readCaps = (event: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(event.getModifierState('CapsLock'));

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
          onKeyDown={readCaps}
          onKeyUp={readCaps}
          onBlur={() => setCapsLock(false)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`field pr-12 ${error ? 'field-error' : ''}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {capsLock && (
        <p className="mt-1.5 animate-fade-in text-xs font-medium text-warn" role="status">
          Caps Lock is on
        </p>
      )}
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

function StrengthMeter({ password }: { password: string }) {
  const strength = passwordStrength(password);
  if (!strength) return <span>At least 8 characters. Longer is stronger.</span>;

  return (
    <span className="flex items-center gap-3">
      <span className="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} className={`h-1 rounded-full transition-colors duration-300 ${index < strength.score ? strength.tone : 'bg-line'}`} />
        ))}
      </span>
      <span className={`w-16 text-right font-medium ${strength.text}`}>{strength.label}</span>
    </span>
  );
}

function LoginForm({ onProgress }: { onProgress: (lit: number) => void }) {
  const { user, isLoading: isAuthLoading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams?.get('next') ?? null);
  const [mode, setMode] = useState<Mode>(searchParams?.get('mode') === 'register' ? 'register' : 'signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const isRegister = mode === 'register';

  const progress = useMemo(() => readyFields(mode, form), [mode, form]);

  useEffect(() => {
    onProgress(Math.floor((progress.ready / progress.total) * TRACE_COUNT));
  }, [progress, onProgress]);

  useEffect(() => {
    if (user) {
      router.replace(next ?? (user.isAdmin ? '/admin' : '/'));
    }
  }, [user, router, next]);

  // Restart the shake even if the previous one has not finished.
  const shake = () => {
    setShaking(false);
    requestAnimationFrame(() => setShaking(true));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!form.username.trim()) nextErrors.username = isRegister ? 'Choose a username.' : 'Enter your username or email.';
    if (!form.password) nextErrors.password = 'Enter your password.';
    if (isRegister) {
      if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.';
      if (form.username.trim() && form.username.trim().length < 3) nextErrors.username = 'Use at least 3 characters.';
      if (form.username.trim() && !USERNAME.test(form.username.trim())) nextErrors.username = 'Use letters, numbers, dots, dashes or underscores.';
      if (!EMAIL.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.';
      if (form.password && form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
      if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(nextErrors);
    const first = (['name', 'username', 'email', 'password', 'confirmPassword'] as const).find((field) => nextErrors[field]);
    if (first) document.getElementById(first)?.focus();
    return !first;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      shake();
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    const result = isRegister
      ? await register(form.name.trim(), form.username.trim(), form.email.trim(), form.password)
      : await login(form.username.trim(), form.password);
    setIsSubmitting(false);

    if (!result.ok) {
      shake();
      const field = result.field as keyof FormState | undefined;
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
    <div className="w-full max-w-[420px]">
      <div key={mode} className="animate-pop-in">
        <p className="spec-key">{isRegister ? 'New account' : 'Welcome back'}</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{isRegister ? 'Create your account' : 'Sign in'}</h1>
        <p className="mt-2 text-muted">
          {next === '/checkout'
            ? 'Sign in to finish checking out. Your cart is saved.'
            : isRegister
              ? 'You need an account to check out and to follow your orders.'
              : 'Use your username or the email you registered with.'}
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-2 rounded-control border border-line bg-sunken p-1" role="tablist" aria-label="Account">
        <span
          aria-hidden="true"
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[4px] bg-surface shadow-sm transition-transform duration-300 ease-out ${
            isRegister ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        {(['signin', 'register'] as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            onClick={() => switchMode(option)}
            className={`relative z-10 min-h-[40px] rounded-[4px] text-sm font-semibold transition-colors ${mode === option ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            {option === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} onAnimationEnd={(event) => event.target === event.currentTarget && setShaking(false)} noValidate className={`mt-6 ${shaking ? 'animate-shake' : ''}`}>
        <Collapse open={isRegister}>
          <TextField id="name" label="Full name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        </Collapse>

        <div className="pb-4">
          <TextField
            id="username"
            label={isRegister ? 'Username' : 'Username or email'}
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            autoComplete="username"
            hint={isRegister ? 'Letters, numbers, dots, dashes or underscores.' : undefined}
          />
        </div>

        <Collapse open={isRegister}>
          <TextField id="email" label="Email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" hint="Order confirmations go here." />
        </Collapse>

        <div className="pb-4">
          <PasswordField
            id="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            hint={isRegister ? <StrengthMeter password={form.password} /> : undefined}
          />
        </div>

        <Collapse open={isRegister}>
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            hint={form.confirmPassword && form.confirmPassword === form.password ? <span className="font-medium text-ok">Passwords match</span> : undefined}
          />
        </Collapse>

        {formError && (
          <p role="alert" className="mb-4 animate-fade-in rounded-control border border-danger/40 bg-danger/5 px-3 py-2.5 text-sm text-danger">
            {formError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-dark w-full">
          {isSubmitting && <Spinner />}
          {isSubmitting ? (isRegister ? 'Creating account' : 'Signing in') : isRegister ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? 'Already have an account? ' : 'New to VertixHub? '}
        <button type="button" onClick={() => switchMode(isRegister ? 'signin' : 'register')} className="link">
          {isRegister ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </div>
  );
}

export default function LoginPage() {
  const [lit, setLit] = useState(0);
  const complete = lit >= TRACE_COUNT;

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex min-w-0 flex-col">
        <header className="shell flex h-16 items-center justify-between">
          <Link href="/" prefetch={false} aria-label="VertixHub home">
            <Wordmark />
          </Link>
          <ThemeToggle />
        </header>

        {/* Mobile: a cropped strip of the board above the form. */}
        <div className="relative mx-4 h-36 overflow-hidden rounded-card bg-panel lg:hidden">
          <BoardArt lit={lit} fit="slice" viewBox="20 300 440 240" className="absolute inset-0 h-full w-full" />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <Suspense fallback={<PageLoader />}>
            <LoginForm onProgress={setLit} />
          </Suspense>
        </div>
        <div className="shell pb-6">
          <Link href="/" prefetch={false} className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the store
          </Link>
        </div>
      </div>

      {/* Desktop: the board connects as the form is completed; the copy sits below it. */}
      <aside className="hidden min-h-screen flex-col border-l border-line bg-panel text-panel-ink lg:flex">
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-x-10 bottom-0 top-10">
            <BoardArt lit={lit} className="h-full w-full" />
          </div>
        </div>
        <div className="px-12 pb-12 pt-6">
          <p className="font-mono text-xs text-panel-muted" aria-hidden="true">
            {complete ? 'All traces connected' : `${lit} of ${TRACE_COUNT} traces connected`}
          </p>
          <h2 className="mt-2 max-w-md text-3xl font-bold leading-tight text-panel-ink">Browse freely. Sign in when you are ready to buy.</h2>
          <p className="mt-3 max-w-md text-sm text-panel-muted">Your account keeps your orders, their delivery status and a record of what you paid.</p>
        </div>
      </aside>
    </div>
  );
}
