import { useState } from "react";
import { supabase } from "../services/supabase";

interface AuthForm {
  email: string;
  password: string;
  confirm?: string;
}

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState<AuthForm>({
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    confirmError: "",
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      emailError: "",
      passwordError: "",
      confirmError: "",
    };

    if (formData.email.length === 0) {
      newErrors.emailError = "Email field cannot be empty";
    }
    if (formData.password.length === 0) {
      newErrors.passwordError = "Password field cannot be empty";
    } else if (formData.password.length < 8) {
      newErrors.passwordError = "Password cannot have less than 8 characters";
    }
    if (mode === "signup" && formData.confirm !== formData.password) {
      newErrors.confirmError = "Passwords don't match";
    }
    setErrors(newErrors);
    if (
      newErrors.emailError ||
      newErrors.confirmError ||
      newErrors.passwordError
    ) {
      return;
    }
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        let message = error.message;
        if (message.includes("already registered")) {
          message = "User already exists";
        }

        setErrors((current) => ({
          ...current,
          emailError: "Invalid credentials",
        }));
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        setErrors((current) => ({
          ...current,
          passwordError: error.message,
        }));
      }
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-300 ">
      <div className="max-w-md w-full border border-gray-500 rounded-lg p-5 mx-5 overflow-hidden">
        <h1 className="font-bold text-2xl pb-3">
          {mode === "login" ? "Login" : "Signup"}
        </h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="email">Email</label>
              <span className="text-red-800">{errors.emailError}</span>
            </div>
            <input
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, email: e.target.value });
              }}
              id="email"
              type="email"
              placeholder="Please enter email"
              className="border border-gray-500 rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            {" "}
            <div className="flex justify-between">
              <label htmlFor="password">Password</label>
              <span className="text-red-800">{errors.passwordError}</span>
            </div>
            <input
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              id="password"
              type="password"
              placeholder="Please enter password"
              className="border border-gray-500 rounded p-2 "
            />
          </div>
          {mode === "signup" && (
            <div className="flex flex-col">
              <div className="flex justify-between">
                {" "}
                <label htmlFor="confirm">Confirm Password</label>{" "}
                <span className="text-red-800">{errors.confirmError}</span>
              </div>
              <input
                value={formData.confirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, confirm: e.target.value });
                }}
                id="confirm"
                type="password"
                className="border border-gray-500 rounded p-2"
              />
            </div>
          )}
          <button className="bg-gray-500 rounded mt-3 p-2 cursor-pointer shadow active:scale-95 transition-transform">
            {mode === "login" ? "Login" : "Signup"}
          </button>
          <p className="mx-auto">
            {mode === "login" ? (
              <>
                Don't have an account yet ?{" "}
                <span
                  onClick={() => {
                    setMode("signup");
                    setErrors({
                      emailError: "",
                      passwordError: "",
                      confirmError: "",
                    });
                    setFormData({
                      email: "",
                      password: "",
                      confirm: "",
                    });
                  }}
                  className="underline cursor-pointer"
                >
                  Signup
                </span>
              </>
            ) : (
              <>
                Already have an account ?{" "}
                <span
                  onClick={() => {
                    setMode("login");
                    setErrors({
                      emailError: "",
                      passwordError: "",
                      confirmError: "",
                    });
                    setFormData({
                      email: "",
                      password: "",
                      confirm: "",
                    });
                  }}
                  className="underline cursor-pointer"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </main>
  );
};
