import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  /**
   * Optional class name for the wrapper
   */
  wrapperClassName?: string
  /**
   * Show the toggle button for password visibility
   * @default true
   */
  showToggle?: boolean
  /**
   * Initial visibility state
   * @default false
   */
  defaultVisible?: boolean
}

function PasswordInput({
  className,
  wrapperClassName,
  showToggle = true,
  defaultVisible = false,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = React.useState(defaultVisible)
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Input
        type={isVisible ? "text" : "password"}
        className={cn(showToggle ? "pr-10" : "", className)}
        {...props}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={toggleVisibility}
          tabIndex={-1}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {isVisible ? "Hide password" : "Show password"}
          </span>
        </Button>
      )}
    </div>
  )
}

export { PasswordInput }