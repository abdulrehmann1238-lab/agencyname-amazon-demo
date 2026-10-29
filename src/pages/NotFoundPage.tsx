import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl mb-4 shadow-soft">
        A
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-md leading-relaxed">
        The requested operational route is not recognized within this AUREL demonstration workspace.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary bg-card border border-border rounded-btn transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Landing Page</span>
        </Link>
      </div>
    </div>
  );
};
