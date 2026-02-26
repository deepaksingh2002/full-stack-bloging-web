import React, { useState } from "react";

function ChangePasswordForm({ loading, onSubmit }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    onSubmit?.({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white shadow-md p-6 dark:bg-slate-800 dark:border-slate-700">
      <h2 className="text-xl font-black text-gray-900 mb-5 dark:text-slate-100">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-slate-300">Current Password</label>
          <input
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-slate-300">New Password</label>
          <input
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-slate-300">Confirm New Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gray-900 text-white py-2.5 font-semibold hover:opacity-90 disabled:opacity-60 dark:bg-slate-700"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}

export default React.memo(ChangePasswordForm);
