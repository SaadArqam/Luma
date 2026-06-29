'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DeepLinkCardProps {
  title: string;
  description?: string;
  deepLink: string;
  module?: string;
  icon?: React.ReactNode;
}

export function DeepLinkCard({ title, description, deepLink, module, icon }: DeepLinkCardProps) {
  return (
    <Link
      href={deepLink}
      className="block p-4 bg-background border border-border rounded-xl hover:border-accent/50 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h3 className="font-semibold text-text">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {module && (
            <span className="text-xs px-2 py-1 bg-surface text-muted-foreground rounded-full mt-2 inline-block">
              {module}
            </span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}
