import React from 'react';
import { Link } from 'react-router-dom';

export const authInputClass =
  'w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/60 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all duration-200';

export const authButtonClass =
  'w-full py-3.5 rounded-xl text-on-primary font-semibold text-xs tracking-wide uppercase font-label bg-primary hover:bg-primary/95 shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all cursor-pointer active:scale-[0.99]';

// Centered card used by smaller auth screens (forgot/reset password, verify email).
const AuthCard = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background overflow-hidden relative font-body text-on-surface">
    {/* Ambient Glow Orbs */}
    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-fixed/30 blur-[100px] pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-secondary-fixed/30 blur-[80px] pointer-events-none" />

    <div className="w-full max-w-md relative z-10 animate-slide-up">
      {/* Brand Header */}
      <Link to="/login" className="flex items-center justify-center gap-3 mb-8 group" aria-label="StudyTantra Home">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-2xl">local_fire_department</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-3xl font-bold tracking-tight text-on-surface">StudyTantra</span>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
            Sahara
          </span>
        </div>
      </Link>

      <div className="relative bg-surface-container-lowest rounded-2xl p-8 sm:p-10 shadow-lg shadow-on-surface/5 border border-outline-variant/30">
        {/* Soft Accent Trim Top Line */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60" />

        <div className="text-center mb-6">
          <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-on-surface mb-1.5">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-on-surface-variant font-body">{subtitle}</p>}
        </div>

        {children}
      </div>

      {footer && <div className="text-center text-xs text-on-surface-variant font-label mt-6">{footer}</div>}
    </div>
  </div>
);

export default AuthCard;
