import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ src, alt, fallback, className, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn('rounded-full object-cover bg-surface', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div className={cn(
      'rounded-full bg-surface border border-border flex items-center justify-center font-medium text-text',
      sizeClasses[size],
      className
    )}>
      {fallback?.charAt(0).toUpperCase()}
    </div>
  )
}
