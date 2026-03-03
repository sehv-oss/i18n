import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  title: string;
  description: string;
  badge: string;
  children: ReactNode;
};

export function Section({
  id,
  title,
  description,
  badge,
  children,
}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          {badge}
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
