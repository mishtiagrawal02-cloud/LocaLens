import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-[1.5rem] border border-slate-200/80 bg-white/85 shadow-sm shadow-slate-950/5 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
};
