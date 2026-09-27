import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-16">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 max-w-xl text-balance text-4xl font-bold sm:text-5xl">This page is not in the catalog.</h1>
      <p className="mt-3 max-w-md text-muted">The link may be old or mistyped. Search from the top of the page, or start from one of these.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" prefetch={false} className="btn-dark">
          Shop all parts
        </Link>
        <Link href="/" prefetch={false} className="btn-outline">
          Store home
        </Link>
      </div>
    </div>
  );
}
