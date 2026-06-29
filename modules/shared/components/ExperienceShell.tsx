'use client';

import { ReactNode } from 'react';
import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header';

interface ExperienceShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function ExperienceShell({ title, description, children, actions }: ExperienceShellProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <PageHeader>
        <div className="flex items-start justify-between">
          <div>
            <PageTitle>{title}</PageTitle>
            {description && <PageDescription>{description}</PageDescription>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </PageHeader>
      {children}
    </div>
  );
}
