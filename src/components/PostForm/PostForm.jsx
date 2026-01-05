import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createPost, updatePost, deletePost } from "../../features/post/postThunks";
import { useNavigate } from "react-router-dom";
import RTE from "../RTE";

export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      catagry: post?.catagry || "",
      content: post?.content || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("catagry", data.catagry);

      if (data.thumbnail?.[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      if (post?._id) {
        await dispatch(
          updatePost({ postId: post._id, formData })
        ).unwrap();
      } else {
        await dispatch(createPost(formData)).unwrap();
      }

      navigate("/all-post");
    } catch (err) {
      console.error("Submit error:", err);
      alert(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await dispatch(deletePost(post._id)).unwrap();
      navigate("/all-post");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 space-y-4"
    >
      <h1 className="text-2xl font-bold">
        {post ? "Edit Post" : "Create Post"}
      </h1>

      <input
        className="w-full border p-2"
        placeholder="Title"
        {...register("title", { required: true })}
      />

      <select
        className="w-full border p-2"
        {...register("catagry", { required: true })}
      >
        <option value="">Select category</option>
        <option value="Tech">Tech</option>
        <option value="Technology">Technology</option>
        <option value="Health">Health</option>
        <option value="Science">Science</option>
        <option value="Sports">Sports</option>
        <option value="Entertainment">Entertainment</option>
      </select>

      <RTE name="content" label="Content" control={control} />

      <input
        type="file"
        accept="image/*"
        {...register("thumbnail")}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {post ? "Update Post" : "Create Post"}
      </button>

      {post && (
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded ml-4"
        >
          Delete
        </button>
      )}
    </form>
  );
}
