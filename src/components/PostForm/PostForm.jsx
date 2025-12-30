/**
 * PostForm Component
 * Form for creating and updating blog posts
 * Features: Auto-slug generation, image upload, rich text editor, status selection
 */

import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index.js";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../features/post/postThunks";
import { selectPostError, selectPostMessage } from "../../features/post/postSlice";
import { useNavigate } from "react-router-dom";

/**
 * PostForm Component
 * @component
 * @param {object} props - Component props
 * @param {object} props.post - Existing post object (for edit mode), undefined for create mode
 * @returns {JSX.Element} - Form component
 */
export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const userData = useSelector((state) => state.auth?.user);
  const error = useSelector(selectPostError);
  const message = useSelector(selectPostMessage);

  // React Hook Form setup with initial values
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || post?._id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  /**
   * Convert title to URL-friendly slug
   * Removes special characters and spaces, converts to lowercase
   * @param {string} value - Title string
   * @returns {string} - Slug string
   */
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    }
    return "";
  }, []);

  /**
   * Auto-update slug when title changes
   * Uses watch to monitor title field changes
   */
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        const newSlug = slugTransform(value.title);
        setValue("slug", newSlug, { shouldValidate: true });
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  /**
   * Handle form submission - Create or Update post
   * @param {object} data - Form data from react-hook-form
   */
  const submit = async (data) => {
    try {
      // Validate user is authenticated
      if (!userData || !userData._id) {
        alert("Please log in to create/edit posts");
        return;
      }

      // Create FormData for file upload support
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);
      formData.append("status", data.status);

      // Only append image if new file is selected
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      if (post) {
        // ============ UPDATE POST ============
        // Dispatch updatePost thunk
        const result = await dispatch(
          updatePost({
            postId: post._id,
            data: formData,
          })
        ).unwrap();

        // Navigate to updated post detail page on success
        if (result) {
          navigate(`/post/${post._id}`);
        }
      } else {
        // ============ CREATE POST ============
        // Add userId to FormData for new posts
        formData.append("userId", userData._id);

        // Dispatch createPost thunk
        const result = await dispatch(createPost(formData)).unwrap();

        // Navigate to posts list on success
        if (result) {
          navigate("/posts");
        }
      }
    } catch (err) {
      // Error is handled by Redux state and displayed below form
      console.error("Form submission error:", err);
    }
  };

  /**
   * Handle manual slug input with transformation
   * Allows user to customize slug if needed
   */
  const handleSlugInput = (e) => {
    const transformedSlug = slugTransform(e.currentTarget.value);
    setValue("slug", transformedSlug, { shouldValidate: true });
  };

  // ============ RENDER FORM ============
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-4">
      {/* ============ ERROR DISPLAY ============ */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ============ SUCCESS MESSAGE DISPLAY ============ */}
      {message && (
        <div className="w-full bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* ============ LEFT COLUMN - Main Content (2/3 width) ============ */}
      <div className="w-full lg:w-2/3 px-2">
        {/* Title Input */}
        <Input
          label="Title:"
          placeholder="Enter post title"
          className="mb-4"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
          })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-4">{errors.title.message}</p>
        )}

        {/* Slug Input */}
        <Input
          label="Slug:"
          placeholder="URL-friendly slug (auto-generated from title)"
          className="mb-4"
          {...register("slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: "Slug can only contain lowercase letters, numbers, and hyphens",
            },
          })}
          onInput={handleSlugInput}
          readOnly={false}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm mb-4">{errors.slug.message}</p>
        )}

        {/* Rich Text Editor for Content */}
        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          rules={{
            required: "Content is required",
            minLength: {
              value: 10,
              message: "Content must be at least 10 characters",
            },
          }}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      {/* ============ RIGHT COLUMN - Sidebar (1/3 width) ============ */}
      <div className="w-full lg:w-1/3 px-2">
        {/* Image Upload */}
        <Input
          label="Featured Image:"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
          {...register("image", {
            required: !post ? "Image is required for new posts" : false,
          })}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mb-4">{errors.image.message}</p>
        )}

        {/* Display existing featured image in edit mode */}
        {post?.featuredImage && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Current Featured Image:
            </p>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
              loading="lazy"
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload a new image to replace it
            </p>
          </div>
        )}

        {/* Post Status Select */}
        <Select
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          label="Status"
          className="mb-4"
          {...register("status", { required: "Status is required" })}
        />
        {errors.status && (
          <p className="text-red-500 text-sm mb-4">{errors.status.message}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : "bg-blue-500"}
          className="w-full text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition duration-200"
        >
          {post ? "Update Post" : "Create Post"}
        </Button>

        {/* Additional Info */}
        {post && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Last updated: {new Date(post.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </form>
  );
}