import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Input, Logo } from "./index";
import { forgotPassword } from "../features/auth/authThunks";
import {
  clearAuthState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
} from "../features/auth/authSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    await dispatch(forgotPassword({ email: data.email.trim() }));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 px-4 py-10">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 m-10 border border-black/10 shadow-lg dark:bg-slate-800 dark:border-slate-700">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900 dark:text-slate-100">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-base text-black/60 dark:text-slate-300">
          Enter your email and we will send a reset link.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-800">
            <p className="text-red-600 font-medium text-sm">{error}</p>
          </div>
        )}

        {message && !error && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/30 dark:border-green-800">
            <p className="text-green-700 font-medium text-sm dark:text-green-300">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="space-y-5">
            <div>
              <Input
                label="Email:"
                placeholder="Enter your email"
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-secondary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
