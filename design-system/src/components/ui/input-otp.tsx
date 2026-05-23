import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
))
InputOTP.displayName = 'InputOTP'

export const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center', className)} {...props} />
  )
)
InputOTPGroup.displayName = 'InputOTPGroup'

export const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ index, className, style, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const slot = inputOTPContext?.slots[index]
  const { char, hasFakeCaret, isActive } = slot ?? { char: null, hasFakeCaret: false, isActive: false }

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-12 w-10 items-center justify-center border text-[18px] font-bold transition-all',
        'first:rounded-l-md last:rounded-r-md',
        index !== 0 && '-ml-px',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: isActive ? 'var(--brand)' : 'var(--line-2)',
        color: 'var(--text)',
        boxShadow: isActive ? '0 0 0 2px var(--brand-soft)' : 'none',
        zIndex: isActive ? 2 : 1,
        ...style,
      }}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-pulse" style={{ background: 'var(--brand)' }} />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'

export function InputOTPSeparator() {
  return (
    <span role="separator" style={{ color: 'var(--text-mute)' }}>
      <Minus size={14} />
    </span>
  )
}
