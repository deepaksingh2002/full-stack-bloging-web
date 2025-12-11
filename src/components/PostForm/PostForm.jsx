import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index.js";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../features/post/postThunks";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?._id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const userData = useSelector((state) => state.auth.user); // auth slice

  const submit = async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);
      formData.append("status", data.status);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]); // file upload
      }

      if (post) {
        // Update post
        await dispatch(updatePost({ id: post._id, postData: formData })).unwrap();
        navigate(`/post/${post._id}`);
      } else {
        // Create post
        await dispatch(
          createPost({ ...formData, userId: userData._id })
        ).unwrap();
        navigate("/posts"); // redirect to posts list
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title:"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug:"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />
        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image:"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post?.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={post.featuredImage} // full URL from API
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full bg-primary text-white px-5 py-2 rounded-xl hover:bg-secondary transition"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
