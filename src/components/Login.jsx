import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authThunks";
import { Button, Input, Logo } from "./index";
import PasswordInput from "./PasswordInput";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleLogin = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/");
    } catch (error) {
      setServerError(
        typeof error === "string"
          ? error
          : error?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 m-10 border border-black/10 shadow-lg">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Create new account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline transition"
          >
            Sign Up
          </Link>
        </p>
        {serverError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium text-sm">{serverError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(handleLogin)} className="mt-6">
          <div className="space-y-5">
            <div>
              <Input
                label="Email:"
                placeholder="Enter your email or username"
                type="email"
                disabled={loading}
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) =>
                      /^([\w.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value) ||
                      "Enter valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <PasswordInput
                label="Password:"
                placeholder="Enter your password"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-secondary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;