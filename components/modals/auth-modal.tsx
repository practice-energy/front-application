"use client"

import type React from "react"
import {useState, useEffect, useRef} from "react"
import {Mail, Lock, Eye, EyeOff, X, Upload, Camera} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useAuth} from "@/hooks/use-auth"
import {useTranslations} from "@/hooks/use-translations"

interface AuthModalProps {
    isOpen: boolean,
    onClose: () => void,
    mode: "login" | "register",
    onSuccess?: () => void,
    initialMode?: "login" | "signup"
}

type AuthStep = 1 | 2 | 3 | 4
type PasswordStrength = "weak" | "medium" | "strong"

export function AuthModal({isOpen, onClose, mode, onSuccess, initialMode}: AuthModalProps) {
    const {login} = useAuth()

    // State management
    const [currentStep, setCurrentStep] = useState<AuthStep>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoginMode, setIsLoginMode] = useState(mode === "login")

    // Form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        profilePhoto: null as File | null,
    })

    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("weak")
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)

    // Refs
    const modalRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Password strength calculation
    const calculatePasswordStrength = (password: string): PasswordStrength => {
        if (password.length < 6) return "weak"
        if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return "strong"
        return "medium"
    }

    // Form validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateCurrentStep = () => {
        const newErrors: Record<string, string> = {}

        if (currentStep === 2) {
            if (!formData.email) newErrors.email = "Email is required"
            else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format"
        }

        if (currentStep === 3) {
            if (!formData.password) newErrors.password = "Password is required"
            else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        }

        if (currentStep === 4) {
            if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
            if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Step navigation
    const nextStep = () => {
        if (validateCurrentStep()) {
            if (currentStep < 4) {
                setCurrentStep((prev) => (prev + 1) as AuthStep)
            } else {
                handleFinish()
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as AuthStep)
        }
    }

    // Form handlers
    const handleEmailContinue = () => {
        setCurrentStep(2)
    }

    const handleGoogleAuth = async () => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            login({email: "google@example.com", name: "Google User"})
            setShowSuccess(true)
            setTimeout(() => {
                onClose()
                resetModal()
            }, 1500)
        } catch (error) {
            setErrors({general: "Google authentication failed."})
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            login({email: formData.email, name: formData.email.split("@")[0]})
            setShowSuccess(true)
            setTimeout(() => {
                onClose()
                resetModal()
            }, 1500)
        } catch (error) {
            setErrors({general: "Login failed. Please try again."})
        } finally {
            setIsLoading(false)
        }
    }

    const handleFinish = async () => {
        if (!validateCurrentStep()) return

        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            const name = `${formData.firstName} ${formData.lastName}`.trim()
            login({email: formData.email, name})
            setShowSuccess(true)
            setTimeout(() => {
                onClose()
                resetModal()
            }, 2000)
        } catch (error) {
            setErrors({general: "Registration failed. Please try again."})
        } finally {
            setIsLoading(false)
        }
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData((prev) => ({...prev, profilePhoto: file}))
            const reader = new FileReader()
            reader.onload = (e) => {
                setProfilePhotoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const resetModal = () => {
        setCurrentStep(1)
        setFormData({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            profilePhoto: null,
        })
        setErrors({})
        setShowSuccess(false)
        setIsLoading(false)
        setProfilePhotoPreview(null)
        setIsLoginMode(mode === "login")
    }

    // Effects
    useEffect(() => {
        if (formData.password) {
            setPasswordStrength(calculatePasswordStrength(formData.password))
        }
    }, [formData.password])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter" && isOpen) {
                if (isLoginMode) {
                    if (validateCurrentStep()) {
                        handleLogin()
                    }
                } else {
                    nextStep()
                }
            }
        }

        document.addEventListener("keydown", handleEscape)
        document.addEventListener("keydown", handleEnter)

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.removeEventListener("keydown", handleEnter)
        }
    }, [isOpen, onClose, isLoginMode])

    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = "hidden"
            document.body.style.paddingRight = `${scrollbarWidth}px`
            return () => {
                document.body.style.overflow = ""
                document.body.style.paddingRight = ""
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            resetModal()
        }
    }, [isOpen, mode])

    if (!isOpen) return null

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case "weak":
                return "bg-red-500"
            case "medium":
                return "bg-yellow-500"
            case "strong":
                return "bg-violet-600"
            default:
                return "bg-gray-300"
        }
    }

    const getPasswordStrengthWidth = () => {
        switch (passwordStrength) {
            case "weak":
                return "w-1/3"
            case "medium":
                return "w-2/3"
            case "strong":
                return "w-full"
            default:
                return "w-0"
        }
    }

    // Login Modal Content
    if (isLoginMode) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true"/>

                <div
                    ref={modalRef}
                    className="relative bg-white rounded-sm shadow-md w-full max-w-md mx-4 max-h-[90vh] overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="login-modal-title"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-sm hover:bg-gray-100 transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5 text-gray-600"/>
                    </button>

                    {showSuccess && (
                        <div className="absolute inset-0 bg-white rounded-sm flex items-center justify-center z-20">
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-green-100 rounded-sm flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome back!</h3>
                                <p className="text-gray-600">You've been successfully signed in</p>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 id="login-modal-title" className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back
                            </h2>
                            <p className="text-gray-600">Sign in to your account</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleLogin()
                            }}
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value}))}
                                        className={`pl-12 py-3 rounded-sm ${errors.email ? "border-red-500" : "border-gray-100"}`}
                                        placeholder="Enter your email"
                                        aria-invalid={!!errors.email}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleLogin()
                                            }
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="login-password"
                                       className="block text-sm font-medium text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <Input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData((prev) => ({...prev, password: e.target.value}))}
                                        className={`pl-12 pr-12 py-3 rounded-sm ${errors.password ? "border-red-500" : "border-gray-100"}`}
                                        placeholder="Enter your password"
                                        aria-invalid={!!errors.password}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleLogin()
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !formData.email || !formData.password}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-sm font-medium"
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                className="w-full border-gray-100 py-3 rounded-sm font-medium"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>
                        </form>

                        <div className="text-center mt-8">
                            <button onClick={() => setIsLoginMode(false)}
                                    className="text-sm text-gray-600 hover:text-gray-900">
                                Don't have an account? <span className="text-violet-600 font-medium">Sign up</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Registration Modal Content
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true"/>

            <div
                ref={modalRef}
                className="relative bg-white rounded-sm shadow-md w-full max-w-md mx-4 max-h-[90vh] overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
            >
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 rounded-sm hover:bg-gray-100 transition-colors z-10"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5 text-gray-600"/>
                </button>

                {showSuccess && (
                    <div className="absolute inset-0 bg-white rounded-sm flex items-center justify-center z-20">
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-green-100 rounded-sm flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome aboard!</h3>
                            <p className="text-gray-600">Your account has been created successfully</p>
                        </div>
                    </div>
                )}

                <div className="relative h-full">
                    <div
                        className="flex transition-transform duration-300 ease-in-out h-full"
                        style={{transform: `translateX(-${(currentStep - 1) * 100}%)`}}
                    >
                        {/* Step 1: Welcome */}
                        <div className="w-full flex-shrink-0 p-8 flex flex-col justify-center h-[500px]">
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-6">
                                    <img src="/allura-logo.svg" alt="SpecialistHub" className="h-12 w-auto"/>
                                </div>
                                <h2 id="auth-modal-title" className="text-3xl font-bold text-gray-900 mb-4">
                                    Welcome to SpecialistHub
                                </h2>
                                <p className="text-lg text-gray-600">Connect with verified specialists for all your
                                    needs</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <Button
                                    onClick={handleEmailContinue}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-sm font-medium"
                                >
                                    Continue with Email
                                </Button>

                                <Button
                                    onClick={handleGoogleAuth}
                                    variant="outline"
                                    disabled={isLoading}
                                    className="w-full border-gray-100 py-3 rounded-sm font-medium"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>

                            <div className="text-center">
                                <button onClick={() => setIsLoginMode(true)}
                                        className="text-sm text-gray-600 hover:text-gray-900">
                                    Already have an account? <span className="text-violet-600 font-medium">Log in</span>
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Email */}
                        <div className="w-full flex-shrink-0 p-8 flex flex-col justify-center h-[500px]">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your email?</h2>
                                <p className="text-gray-600">We'll use this to create your account</p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value}))}
                                        className={`pl-12 py-3 rounded-sm ${errors.email ? "border-red-500" : "border-gray-100"}`}
                                        placeholder="Enter your email"
                                        aria-invalid={!!errors.email}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                nextStep()
                                            }
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-gray-600 mb-8">
                                We'll never share your email with anyone else. By continuing, you agree to our Terms of
                                Service and
                                Privacy Policy.
                            </p>

                            <Button
                                onClick={nextStep}
                                disabled={!formData.email || !validateEmail(formData.email)}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Continue
                            </Button>
                        </div>

                        {/* Step 3: Password */}
                        <div className="w-full flex-shrink-0 p-8 flex flex-col justify-center h-[500px]">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your password</h2>
                                <p className="text-gray-600">Choose a strong password to secure your account</p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData((prev) => ({...prev, password: e.target.value}))}
                                        className={`pl-12 pr-12 py-3 rounded-sm ${errors.password ? "border-red-500" : "border-gray-100"}`}
                                        placeholder="Create a password"
                                        aria-invalid={!!errors.password}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                nextStep()
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                </div>

                                {formData.password && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                            <span>Password strength</span>
                                            <span className="capitalize font-medium">{passwordStrength}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-sm h-2">
                                            <div
                                                className={`h-2 rounded-sm transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}
                                                role="progressbar"
                                                aria-valuenow={passwordStrength === "weak" ? 33 : passwordStrength === "medium" ? 66 : 100}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label={`Password strength: ${passwordStrength}`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <Button
                                    onClick={prevStep}
                                    variant="outline"
                                    className="flex-1 border-gray-100 py-3 rounded-sm font-medium"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={nextStep}
                                    disabled={!formData.password || formData.password.length < 6}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>

                        {/* Step 4: Personal Details */}
                        <div className="w-full flex-shrink-0 p-8 flex flex-col justify-center h-[500px]">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
                                <p className="text-gray-600">Help us personalize your experience</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName"
                                               className="block text-sm font-medium text-gray-900 mb-2">
                                            First name
                                        </label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData((prev) => ({
                                                ...prev,
                                                firstName: e.target.value
                                            }))}
                                            className={`py-3 rounded-sm ${errors.firstName ? "border-red-500" : "border-gray-100"}`}
                                            placeholder="First name"
                                            aria-invalid={!!errors.firstName}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    nextStep()
                                                }
                                            }}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600" role="alert">
                                                {errors.firstName}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="lastName"
                                               className="block text-sm font-medium text-gray-900 mb-2">
                                            Last name
                                        </label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData((prev) => ({
                                                ...prev,
                                                lastName: e.target.value
                                            }))}
                                            className={`py-3 rounded-sm ${errors.lastName ? "border-red-500" : "border-gray-100"}`}
                                            placeholder="Last name"
                                            aria-invalid={!!errors.lastName}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    nextStep()
                                                }
                                            }}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600" role="alert">
                                                {errors.lastName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Profile photo
                                        (optional)</label>
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {profilePhotoPreview ? (
                                                <img
                                                    src={profilePhotoPreview || "/placeholder.svg"}
                                                    alt="Profile preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Camera className="w-8 h-8 text-gray-400"/>
                                            )}
                                        </div>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-gray-100 rounded-sm"
                                            >
                                                <Upload className="w-4 h-4 mr-2"/>
                                                Upload photo
                                            </Button>
                                            <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 5MB</p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        aria-label="Upload profile photo"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <Button
                                    onClick={prevStep}
                                    variant="outline"
                                    className="flex-1 border-gray-100 py-3 rounded-sm font-medium"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={nextStep}
                                    disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim()}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    {isLoading ? "Creating account..." : "Finish"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
