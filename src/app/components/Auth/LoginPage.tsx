
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { useAuth } from "../../context/AuthContext";
import logo from "../../../media/logo_5.png";
/* ===================== TYPES ===================== */
export interface User {
  user_id: string;
  roles: string[];
  email?: string;
  full_name?: string;
}

interface FormData {
  full_name: string;
  email: string;
  password: string;
  otp?: string;
}

/* ===================== COMPONENT ===================== */
const GOOGLE_CLIENT_ID = "1044650935526-ihv7m03630csntjbh3sj85nn1bev4noh.apps.googleusercontent.com"; // Replace with your real ID

export function LoginPage() {
  const [step, setStep] = useState<"register" | "verify" | "login">("login");
  const [loading, setLoading] = useState(false);

  const { login, loginWithToken } = useAuth();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  /* ================= REGISTER ================= */
  const handleRegister = async (data: FormData) => {
    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8000/api/users/register",
        new URLSearchParams({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
        })
      );

      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (data: FormData) => {
    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8000/api/users/verify-otp",
        new URLSearchParams({
          email: getValues("email"),
          otp: data.otp || "",
        })
      );

      toast.success("Email verified! Please login.");
      setStep("login");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (data: FormData) => {
    try {
      setLoading(true);

      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success("Login successful!");
        window.location.href = "/";
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      setLoading(true);

      const token = credentialResponse.credential;

      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/google-login",
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      const backendToken = response.data.bearer_token;

      const backendUser: User = {
        user_id: response.data.user_id,
        roles: response.data.roles,
      };

      loginWithToken(backendToken, backendUser);

      toast.success("Google login successful!");
      window.location.href = "/";
    } catch (err: any) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.detail || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="h-full w-full bg-white flex items-center justify-center p-4 sm:p-6">

        {/* Card */}
        <div className="w-full max-w-md">

          <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] overflow-hidden">

            {/* Header */}
            <div className="relative bg-[#D73D32] px-6 sm:px-8 py-10 text-white overflow-hidden">

              {/* Decorative circles */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full border border-white" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border border-white" />
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">

                {/* Logo */}
                <div className="relative mb-5 flex items-center justify-center">

                  {/* Main Logo Box */}
                  <div className="rounded-3xl bg-white shadow-2xl flex items-center justify-center p-3">

                    <img
                      src={logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                  {step === "login"
                    ? "Welcome Back"
                    : step === "register"
                      ? "Create Account"
                      : "Verify Email"}
                </h2>

                {/* Subtitle */}
                <p className="text-white/80 mt-2 text-sm sm:text-base max-w-[280px] leading-relaxed">
                  {step === "login"
                    ? "Login to continue your journey"
                    : step === "register"
                      ? "Sign up to get started"
                      : "Enter the OTP sent to your email"}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8">

              <form
                onSubmit={handleSubmit(
                  step === "register"
                    ? handleRegister
                    : step === "verify"
                      ? handleVerifyOtp
                      : handleLogin
                )}
                className="space-y-5"
              >

                {/* Full Name */}
                {step === "register" && (
                  <div className="space-y-2">
                    <Label className="text-[#2d4863] font-medium">
                      Full Name
                    </Label>

                    <Input
                      placeholder="Enter your full name"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32]"
                      {...register("full_name", { required: true })}
                    />

                    {errors.full_name && (
                      <p className="text-xs text-red-500">
                        Full name is required
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-[#2d4863] font-medium">
                    Email Address
                  </Label>

                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 rounded-xl border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32]"
                    {...register("email", { required: true })}
                  />

                  {errors.email && (
                    <p className="text-xs text-red-500">
                      Email is required
                    </p>
                  )}
                </div>

                {/* Password */}
                {(step === "login" || step === "register") && (
                  <div className="space-y-2">
                    <Label className="text-[#2d4863] font-medium">
                      Password
                    </Label>

                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32]"
                      {...register("password", { required: true })}
                    />

                    {errors.password && (
                      <p className="text-xs text-red-500">
                        Password is required
                      </p>
                    )}
                  </div>
                )}

                {/* OTP */}
                {step === "verify" && (
                  <div className="space-y-2">
                    <Label className="text-[#2d4863] font-medium">
                      OTP Code
                    </Label>

                    <Input
                      placeholder="Enter verification code"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32] tracking-[0.4em] text-center text-lg font-semibold"
                      {...register("otp", { required: true })}
                    />

                    {errors.otp && (
                      <p className="text-xs text-red-500">
                        OTP is required
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#2d4863] hover:bg-[#24384d] text-white font-semibold text-base shadow-lg transition-all duration-300"
                >
                  {loading
                    ? "Please wait..."
                    : step === "login"
                      ? "Login"
                      : step === "register"
                        ? "Create Account"
                        : "Verify OTP"}
                </Button>
              </form>

              {/* Login Footer */}
              {step === "login" && (
                <div className="mt-6 space-y-5">

                  {/* Register */}
                  <div className="text-center text-sm text-gray-500">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setStep("register")}
                      className="font-semibold text-[#D73D32] hover:text-[#EC7063] transition-colors"
                    >
                      Register
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />

                    <span className="text-xs uppercase tracking-widest text-gray-400 whitespace-nowrap">
                      OR CONTINUE WITH
                    </span>

                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Google Login */}
                  <div className="flex justify-center">
                    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => toast.error("Google login failed")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Back Button */}
              {(step === "register" || step === "verify") && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setStep("login")}
                    className="text-sm text-[#2d4863] hover:text-[#D73D32] transition-colors font-medium"
                  >
                    ← Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
}