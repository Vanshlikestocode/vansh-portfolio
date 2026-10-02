import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="label text-signal">Error 404</p>
      <h1 className="display mt-6 text-[clamp(4rem,14vw,11rem)] text-paper">
        Route <span className="serif-accent text-signal">not found.</span>
      </h1>
      <p className="mt-6 max-w-md text-mute">
        This path doesn&apos;t exist in the system — yet. Everything that does is one click away.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-white"
      >
        Back to the workshop
      </Link>
    </section>
  );
}
