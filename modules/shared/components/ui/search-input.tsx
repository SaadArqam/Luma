import { Input } from './input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  className?: string
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className={cn('pl-9', className)}
        {...props}
      />
    </div>
  )
}
