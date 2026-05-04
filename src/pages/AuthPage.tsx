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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gray-300">
      <div className="max-w-md w-full border border-gray-500 rounded-lg p-5">
        <h1 className="font-bold text-2xl pb-3">
          {mode === "login" ? "Login" : "Signup"}
        </h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Password</label>
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
              <label htmlFor="confirm">Confirm Password</label>
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
                  onClick={() => setMode("signup")}
                  className="underline cursor-pointer"
                >
                  Signup
                </span>
              </>
            ) : (
              <>
                Already have an account ?{" "}
                <span
                  onClick={() => setMode("login")}
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
