// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { toast } from "react-toastify";
// import { Toaster } from "../ui/toaster";

// interface RegisterFormData {
//     full_name: string;
//     email: string;
//     password: string;
//     otp?: string;
// }

// const GOOGLE_CLIENT_ID = "1044650935526-ihv7m03630csntjbh3sj85nn1bev4noh.apps.googleusercontent.com";

// export function LoginPage() {
//     const [step, setStep] = useState<"register" | "verify" | "login">("login");
//     const [loading, setLoading] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         getValues,
//         formState: { errors },
//         reset
//     } = useForm<RegisterFormData>();

//     // Axios cookies
//     axios.defaults.withCredentials = true;

//     // ================= REGISTER =================
//     const handleRegister = async (data: RegisterFormData) => {
//         try {
//             setLoading(true);
//             toast.success("Creating your account...");
//             await axios.post(
//                 "http://54.206.3.97/api/users/register",
//                 new URLSearchParams({
//                     full_name: data.full_name,
//                     email: data.email,
//                     password: data.password,
//                 })
//             );
//             toast.success("Registration successful! Please check your email for OTP.");
//             setStep("verify");
//         } catch (err: any) {
//             toast(err.response?.data?.detail || "Registration failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ================= VERIFY OTP =================
//     const handleVerifyOtp = async (data: RegisterFormData) => {
//         try {
//             setLoading(true);
//             toast.warning("Verifying OTP...");
//             await axios.post(
//                 "http://54.206.3.97/api/users/verify-otp",
//                 new URLSearchParams({
//                     email: getValues("email"),
//                     otp: data.otp || "",
//                 })
//             );
//             toast.success("Email verified successfully! You can now login.");
//             setStep("login");
//             reset();
//         } catch (err: any) {
//             toast.error(err.response?.data?.detail || "Invalid OTP");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ================= LOGIN =================
//     const handleLogin = async (data: RegisterFormData) => {
//         try {
//             setLoading(true);
//             toast.loading("Logging you in...");

//             const response = await axios.post(
//                 "http://54.206.3.97/api/users/login",
//                 new URLSearchParams({
//                     email: data.email,
//                     password: data.password,
//                 }),
//                 { withCredentials: true }
//             );

//             // Save tokens in sessionStorage
//             const accessToken = response.data.access_token;
//             const refreshToken = response.data.refresh_token;
//             const user_id = response.data.user_id;

//             sessionStorage.setItem("access_token", accessToken);
//             sessionStorage.setItem("refresh_token", refreshToken);
//             localStorage.setItem("user_id", user_id);

//             console.log("user_id:", user_id);
//             console.log("Access Token:", accessToken);
//             console.log("Refresh Token:", refreshToken);

//             toast.success("Login successful! Redirecting...");
//             window.location.href = "/";
//         } catch (err: any) {
//             toast.error(err.response?.data?.detail || "Invalid credentials");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ================= GOOGLE LOGIN ==================
//     const handleGoogleLogin = async (credentialResponse: any) => {  
//         try {
//             setLoading(true);
//             toast("Logging in with Google...");
//             const token = credentialResponse.credential;

//             const response = await axios.post(
//                 "http://54.206.3.97/api/users/google-login",
//                 { token },
//                 { withCredentials: true }
//             );

//             const accessToken = response.data.access_token;
//             const refreshToken = response.data.refresh_token;
//             const user_id = response.data.user_id;

//             sessionStorage.setItem("access_token", accessToken);
//             sessionStorage.setItem("refresh_token", refreshToken);
//             localStorage.setItem("user_id", user_id);

//             console.log("user_id:", user_id);
//             console.log("Access Token:", accessToken);
//             console.log("Refresh Token:", refreshToken);
            
//             toast.success("Google login successful! Redirecting...");
//             // window.location.href = "/";
//         } catch (err: any) {
//             toast.error(err.response?.data?.detail || "Google login failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
//                 <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border">
//                     <div className="text-center">
//                         <h2 className="text-2xl font-bold text-gray-800">
//                             {step === "login"
//                                 ? "Login"
//                                 : step === "register"
//                                     ? "Create Account"
//                                     : "Verify Email"}
//                         </h2>
//                     </div>

//                     <form
//                         onSubmit={handleSubmit(
//                             step === "register"
//                                 ? handleRegister
//                                 : step === "verify"
//                                     ? handleVerifyOtp
//                                     : handleLogin
//                         )}
//                         className="space-y-4"
//                     >
//                         {step === "register" && (
//                             <div>
//                                 <Label>Full Name *</Label>
//                                 <Input
//                                     {...register("full_name", { required: "Full name required" })}
//                                     className="mt-1"
//                                 />
//                                 {errors.full_name && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.full_name.message}
//                                     </p>
//                                 )}
//                             </div>
//                         )}

//                         <div>
//                             <Label>Email *</Label>
//                             <Input
//                                 type="email"
//                                 {...register("email", { required: "Email required" })}
//                                 className="mt-1"
//                             />
//                             {errors.email && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                             )}
//                         </div>

//                         {(step === "login" || step === "register") && (
//                             <div>
//                                 <Label>Password *</Label>
//                                 <Input
//                                     type="password"
//                                     {...register("password", { required: "Password required" })}
//                                     className="mt-1"
//                                 />
//                                 {errors.password && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.password.message}
//                                     </p>
//                                 )}
//                             </div>
//                         )}

//                         {step === "verify" && (
//                             <div>
//                                 <Label>Enter OTP *</Label>
//                                 <Input
//                                     {...register("otp", { required: "OTP required" })}
//                                     className="mt-1"
//                                 />
//                                 {errors.otp && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
//                                 )}
//                             </div>
//                         )}

//                         <Button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
//                         >
//                             {loading
//                                 ? "Please wait..."
//                                 : step === "login"
//                                     ? "Login"
//                                     : step === "register"
//                                         ? "Register"
//                                         : "Verify OTP"}
//                         </Button>
//                     </form>

//                     {step === "login" && (
//                         <>
//                             <p className="text-center text-sm">
//                                 Don't have an account?{" "}
//                                 <span
//                                     onClick={() => {
//                                         setStep("register");
//                                         toast("Switching to registration...");
//                                     }}
//                                     className="text-[#D73D32] cursor-pointer"
//                                 >
//                                     Register
//                                 </span>
//                             </p>

//                             <div className="flex items-center gap-3">
//                                 <div className="flex-1 h-px bg-gray-200" />
//                                 <span className="text-gray-400 text-sm">OR</span>
//                                 <div className="flex-1 h-px bg-gray-200" />
//                             </div>

//                             <GoogleLogin
//                                 onSuccess={handleGoogleLogin}
//                                 onError={() => toast("Google login failed")}
//                             />
//                         </>
//                     )}
//                 </div>
//                 <Toaster />
//             </div>
//         </GoogleOAuthProvider>
//     );
// }


// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { toast } from "react-toastify";
// import { Toaster } from "../ui/toaster";
// import { useAuth } from "../../context/AuthContext"; 

// interface FormData {
//   full_name: string;
//   email: string;
//   password: string;
//   otp?: string;
// }

// const GOOGLE_CLIENT_ID = "1044650935526-ihv7m03630csntjbh3sj85nn1bev4noh.apps.googleusercontent.com";

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
        "http://54.206.3.97/api/users/register",
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
        "http://54.206.3.97/api/users/verify-otp",
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

  /* ================= LOGIN (EMAIL/PASSWORD) ================= */
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
        "http://54.206.3.97/api/users/google-login",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border">

          <div className="text-center">
            <h2 className="text-2xl font-bold">
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
                <Label>Full Name</Label>
                <Input {...register("full_name", { required: true })} />
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email", { required: true })} />
            </div>

            {(step === "login" || step === "register") && (
              <div>
                <Label>Password</Label>
                <Input type="password" {...register("password", { required: true })} />
              </div>
            )}

            {step === "verify" && (
              <div>
                <Label>OTP</Label>
                <Input {...register("otp", { required: true })} />
              </div>
            )}

            <Button className="w-full" disabled={loading}>
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
                  className="text-red-500 cursor-pointer"
                >
                  Register
                </span>
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </>
          )}
        </div>
        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
}