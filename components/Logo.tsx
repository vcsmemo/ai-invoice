import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  className?: string;
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <Link href="/" className={`flex items-center gap-2 ${className}`}>
        <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg glow-accent">
          <span className="text-primary-foreground font-bold text-sm">AI</span>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href="/" className={`flex items-center gap-2 ${className}`}>
        <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg glow-accent">
          <span className="text-primary-foreground font-bold text-sm">AI</span>
        </div>
        <span className="font-bold text-base tracking-tight">
          <span className="text-primary">AI</span> Invoice Generator
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg glow-accent">
        <span className="text-primary-foreground font-bold text-lg">AI</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight leading-none">
          <span className="text-primary">AI</span> Invoice Generator
        </span>
      </div>
    </Link>
  );
}
