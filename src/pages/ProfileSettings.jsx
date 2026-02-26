import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  changeUserPassword,
  getUserProfile,
  updateUserProfile,
} from "../features/auth/authThunks";
import {
  clearAuthState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  selectAuthUser,
} from "../features/auth/authSlice";
import { Contaner } from "../components";
import ProfileDetailsForm from "../components/Profile/ProfileDetailsForm";
import ChangePasswordForm from "../components/Profile/ChangePasswordForm";

function ProfileSettings() {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);

  useEffect(() => {
    dispatch(getUserProfile());
    return () => {
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  const handleUpdateProfile = async (data) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
    } catch {
      // error handled by slice/UI
    }
  };

  const handleChangePassword = async (data) => {
    try {
      await dispatch(changeUserPassword(data)).unwrap();
    } catch {
      // error handled by slice/UI
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950">
      <Contaner>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-slate-100">Profile Settings</h1>
            <Link
              to="/profile"
              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Back to Profile
            </Link>
          </div>

          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-medium dark:bg-red-950/30 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <ProfileDetailsForm user={user} loading={loading} onSubmit={handleUpdateProfile} />
          <ChangePasswordForm loading={loading} onSubmit={handleChangePassword} />
        </div>
      </Contaner>
    </div>
  );
}

export default React.memo(ProfileSettings);
