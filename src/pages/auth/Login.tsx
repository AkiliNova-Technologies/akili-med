// src/pages/LoginPage.tsx
import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { images } from "@/assets/images"
import { useReduxAuth } from "@/hooks/useReduxAuth"

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  
  // Use the auth hook
  const { 
    signin, 
    loading: authLoading, 
    error: authError, 
    clearError,
    isAuthenticated 
  } = useReduxAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  // Handle login with Redux
  const handleLogin = async (email: string, password: string) => {
    // Clear any previous errors
    setError("")
    clearError()
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      // Call the signin function from auth hook
      await signin(email, password)
      
      // If successful, navigation will happen via useEffect above
      // or you can navigate immediately:
      navigate("/dashboard")
      
    } catch (error: any) {
      // Error is already handled in the auth hook with toast
      // You can set additional error state if needed
      console.error("Login failed:", error)
      
      // Optionally, you can display the error in the form
      // if you want to show it differently than the toast
      setError(authError || "Login failed. Please try again.")
    }
  }

  // Combine errors: local validation errors + auth errors
  const displayError = error || authError

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 text-xl font-medium">
            <div className="text-primary-foreground flex size-12 items-center justify-center rounded-md">
              <img src={images.Logo} alt="Logo image" />
            </div>
            Akili Med
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm 
              onLogin={handleLogin} 
              isLoading={authLoading}
              error={displayError}
            />
          </div>
        </div>
        
        {/* Optional: Demo credentials info */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo credentials:</p>
          <p className="mt-1">admin@example.com / password123</p>
          <p className="mt-1">doctor@example.com / password123</p>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={images.Background}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}