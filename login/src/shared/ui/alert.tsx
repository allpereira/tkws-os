import { cn } from '@/shared/lib/utils';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  message: string;
  className?: string;
}

const icons: Record<AlertVariant, React.ElementType> = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const styles: Record<AlertVariant, string> = {
  error: 'bg-danger/10 border-danger/30 text-danger',
  success: 'bg-success/10 border-success/30 text-success',
  info: 'bg-brand-soft border-brand/20 text-brand',
};

export function Alert({ variant = 'error', message, className }: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-[10px] border px-3.5 py-3',
        'text-[13px] leading-snug',
        styles[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
