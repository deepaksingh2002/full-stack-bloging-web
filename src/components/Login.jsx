import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../features/auth/authThunks";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");

    try {
      const res = await dispatch(loginUser(data)).unwrap();

      if (res) {
        await dispatch(getCurrentUser()).unwrap();

        // Redirect
        navigate("/");
      }
    } catch (err) {
      setError(err || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 m-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Create new account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-8 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit(login)}>
          <div className="space-y-5">
            <Input
              label="Email:"
              placeholder="Enter your email or username"
              type="email"
              {...register("email", {
                required: "Email or username is required",
              })}
            />

            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white px-5 py-2 rounded-xl hover:bg-secondary transition"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
