import type { ReactNode } from "react";

export default function AuthSplit({
  image,
  eyebrow,
  title,
  children,
  wide = false,
}: {
  image: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,27,51,0.92)] via-[rgba(11,27,51,0.45)] to-[rgba(11,27,51,0.2)]" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            {eyebrow}
          </p>
          <h2 className="font-display mt-4 max-w-md text-4xl leading-tight">{title}</h2>
        </div>
      </div>
      <div className="flex items-start bg-[var(--surface)] px-4 py-12 sm:px-8 lg:items-center">
        <div className={`mx-auto w-full ${wide ? "max-w-xl" : "max-w-md"}`}>{children}</div>
      </div>
    </section>
  );
}
