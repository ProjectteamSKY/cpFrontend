import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RegisterFormData {
    full_name: string;
    email: string;
    password: string;
    otp?: string;
}

const GOOGLE_CLIENT_ID = "1044650935526-ihv7m03630csntjbh3sj85nn1bev4noh.apps.googleusercontent.com";

export function LoginPage() {
    const [step, setStep] = useState<"register" | "verify" | "login">("login");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<RegisterFormData>();

    // Axios cookies
    axios.defaults.withCredentials = true;

    // ================= REGISTER =================
    const handleRegister = async (data: RegisterFormData) => {
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
            setStep("verify");
        } catch (err: any) {
            alert(err.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= VERIFY OTP =================
    const handleVerifyOtp = async (data: RegisterFormData) => {
        try {
            setLoading(true);
            await axios.post(
                "http://127.0.0.1:8000/api/users/verify-otp",
                new URLSearchParams({
                    email: getValues("email"),
                    otp: data.otp || "",
                })
            );
            alert("Email verified! Please login.");
            setStep("login");
        } catch (err: any) {
            alert(err.response?.data?.detail || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // ================= LOGIN =================
    // ================== LOGIN ==================
    const handleLogin = async (data: RegisterFormData) => {
        try {
            setLoading(true);

            const response = await axios.post(
                "http://127.0.0.1:8000/api/users/login",
                new URLSearchParams({
                    email: data.email,
                    password: data.password,
                }),
                { withCredentials: true } // send cookies too
            );

            // Save tokens in sessionStorage
            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
            const user_id = response.data.user_id;

            sessionStorage.setItem("access_token", accessToken);
            sessionStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("user_id", user_id);

            console.log("user_id:", user_id);
            console.log("Access Token:", accessToken);
            console.log("Refresh Token:", refreshToken);

            window.location.href = "/";
        } catch (err: any) {
            alert(err.response?.data?.detail || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    // ================== GOOGLE LOGIN ==================
    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            setLoading(true);
            const token = credentialResponse.credential;

            const response = await axios.post(
                "http://127.0.0.1:8000/api/users/google-login",
                { token },
                { withCredentials: true }
            );

            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
            const user_id = response.data.user_id;

            sessionStorage.setItem("access_token", accessToken);
            sessionStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("user_id", user_id);

            console.log("user_id:", user_id);
            console.log("Access Token:", accessToken);
            console.log("Refresh Token:", refreshToken);
            // window.location.href = "/";
        } catch (err: any) {
            alert(err.response?.data?.detail || "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {step === "login"
                                ? "Login"
                                : step === "register"
                                    ? "Create Account"
                                    : "Verify Email"}
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit(
                            step === "register"
                                ? handleRegister
                                : step === "verify"
                                    ? handleVerifyOtp
                                    : handleLogin
                        )}
                        className="space-y-4"
                    >
                        {step === "register" && (
                            <div>
                                <Label>Full Name *</Label>
                                <Input
                                    {...register("full_name", { required: "Full name required" })}
                                    className="mt-1"
                                />
                                {errors.full_name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.full_name.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                {...register("email", { required: "Email required" })}
                                className="mt-1"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {(step === "login" || step === "register") && (
                            <div>
                                <Label>Password *</Label>
                                <Input
                                    type="password"
                                    {...register("password", { required: "Password required" })}
                                    className="mt-1"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {step === "verify" && (
                            <div>
                                <Label>Enter OTP *</Label>
                                <Input
                                    {...register("otp", { required: "OTP required" })}
                                    className="mt-1"
                                />
                                {errors.otp && (
                                    <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
                        >
                            {loading
                                ? "Please wait..."
                                : step === "login"
                                    ? "Login"
                                    : step === "register"
                                        ? "Register"
                                        : "Verify OTP"}
                        </Button>
                    </form>

                    {step === "login" && (
                        <>
                            <p className="text-center text-sm">
                                Don’t have an account?{" "}
                                <span
                                    onClick={() => setStep("register")}
                                    className="text-[#D73D32] cursor-pointer"
                                >
                                    Register
                                </span>
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-gray-400 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => alert("Google login failed")}
                            />
                        </>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}