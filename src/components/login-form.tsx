import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "./ui/password-input";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  /**
   * Optional function to handle login submission
   * Receives email and password, should return Promise or handle navigation
   */
  onLogin?: (email: string, password: string) => Promise<void> | void;
  /**
   * Optional loading state
   */
  isLoading?: boolean;
  /**
   * Optional error message
   */
  error?: string;
}

export function LoginForm({
  className,
  onLogin,
  isLoading = false,
  error,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onLogin) {
      setIsSubmitting(true);
      try {
        await onLogin(email, password);
      } catch (err) {
        console.error("Login failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("No login handler provided - using default form submission");
    }
  };

  const isProcessing = isLoading || isSubmitting;

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isProcessing}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isProcessing}
            autoComplete="current-password"
            showToggle={true}
          />
        </div>
        <Button type="submit" className="w-full bg-[#e11d48] hover:bg-[#e11d48]/80 text-white hover:text-white" disabled={isProcessing}>
          {isProcessing ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
