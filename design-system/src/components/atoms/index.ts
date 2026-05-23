/**
 * ATOMS · Atomic Design level 1
 *
 * Building blocks indivisíveis. Não compõem outros componentes — só usam
 * tokens (CSS variables, font-family, radius). Stand-alone, sem dependência
 * de outros componentes do design system.
 *
 * Cada atom representa uma UI primitive única e reutilizável.
 *
 * Uso: import { Button } from '@/components/atoms'
 */

export { Button, buttonVariants } from '../ui/button'
export type { ButtonProps } from '../ui/button'

export { Badge } from '../ui/badge'
export type { BadgeProps, BadgeTone } from '../ui/badge'

export { Input } from '../ui/input'
export type { InputProps } from '../ui/input'

export { Textarea } from '../ui/textarea'
export type { TextareaProps } from '../ui/textarea'

export { Label } from '../ui/label'

export { Checkbox } from '../ui/checkbox'

export { Switch } from '../ui/switch'

export { Slider } from '../ui/slider'

export { Spinner } from '../ui/spinner'
export type { SpinnerProps, SpinnerSize, SpinnerTone } from '../ui/spinner'

export { Kbd, KbdCombo } from '../ui/kbd'

export { Separator } from '../ui/separator'

export { Skeleton } from '../ui/skeleton'

export { Progress } from '../ui/progress'
export type { ProgressProps } from '../ui/progress'

export { AspectRatio } from '../ui/aspect-ratio'

export { ScrollArea, ScrollBar } from '../ui/scroll-area'

export { Toggle } from '../ui/toggle'

export { Icon, iconSize, iconTone } from '../ui/icon'
export type { IconProps, IconSize, IconTone } from '../ui/icon'
