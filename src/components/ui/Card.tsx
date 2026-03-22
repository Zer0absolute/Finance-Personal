import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cn("bg-card text-card-foreground rounded-xl border border-border shadow-sm", className)} {...props} />
);

export const CardHeader: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

export const CardContent: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);