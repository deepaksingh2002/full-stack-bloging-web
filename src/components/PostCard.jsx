import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  HiTag,
  HiEye,
  HiArrowRight,
  HiHeart,
  HiChatBubbleOvalLeft,
} from "react-icons/hi2";
import {
  formatDisplayDate,
  getPostCommentsCount,
  getPostLikesCount,
  getPostOwner,
  getUserDisplayName,
  resolvePostCategory,
} from "../utils/postHelpers";

const PostCard = memo(function PostCard({ post }) {
  if (!post) return null;

  const { title, thumbnail, createdAt, views } = post;
  const postOwner = getPostOwner(post);
  const author = getUserDisplayName(postOwner, "Unknown Author");
  const safeCategory = resolvePostCategory(post);
  const authorAvatar =
    postOwner?.avatar?.url ||
    postOwner?.avatar?.secure_url ||
    postOwner?.avatar ||
    postOwner?.profilePic?.url ||
    postOwner?.profilePic ||
    postOwner?.profileImage ||
    postOwner?.image ||
    postOwner?.avatarUrl ||
    "";

  const likesCount = getPostLikesCount(post);
  const commentsCount = getPostCommentsCount(post);

  const optimizeImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("cloudinary.com")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/q_80,w_350,c_fill,ar_16:9/${parts[1]}`;
      }
    }
    return url;
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "Untitled Post";
    return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
  };

  const authorInitial = author?.charAt(0)?.toUpperCase() || "U";

  return (
    <Link
      to={`/post/${post._id}`}
      className="group relative block h-[370px] w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-3xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white/90 via-white to-primary/5 border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/15 dark:from-slate-800/90 dark:via-slate-900/90 dark:to-slate-900 dark:border-slate-700"
      aria-label={`Read post: ${title || "Untitled"}`}
    >
      <div className="relative h-[44%] w-full overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/10 to-transparent">
        <img
          src={optimizeImageUrl(thumbnail)}
          alt={title || "Post thumbnail"}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {safeCategory && (
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary bg-white/95 backdrop-blur-sm rounded-full shadow-md transition-all duration-300 border border-primary/20">
              <HiTag className="w-3 h-3 flex-shrink-0" />
              <span>{safeCategory}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[56%] p-5 space-y-3 bg-white/60 backdrop-blur-md border-t border-white/40 dark:bg-slate-900/70 dark:border-slate-700">
        <div className="flex items-start justify-between h-14">
          <h2 className="flex-1 text-base font-extrabold text-black leading-tight line-clamp-2 pr-6 group-hover:text-primary transition-colors duration-300 dark:text-slate-100">
            {truncateText(title)}
          </h2>
          <div className="flex-shrink-0 ml-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-primary rounded-full transition-all duration-300 shadow-md">
              <HiEye className="w-3 h-3 flex-shrink-0" />
              <span>{views || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200/70 pb-2 text-xs dark:border-slate-700">
          <div className="flex items-center gap-2 text-gray-700 flex-shrink-0 dark:text-slate-300">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={`${author} avatar`}
                className="w-8 h-8 rounded-full object-cover border border-primary/20"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                {authorInitial}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-semibold max-w-20 truncate">{author}</span>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">{formatDisplayDate(createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 h-8 px-3 text-xs font-bold rounded-full border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-300">
              <HiHeart className="w-3.5 h-3.5" />
              {likesCount}
            </span>
            <span className="inline-flex items-center gap-1 h-8 px-3 text-xs font-bold rounded-full border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300">
              <HiChatBubbleOvalLeft className="w-3.5 h-3.5" />
              {commentsCount}
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-end pb-2">
          <div className="w-full flex justify-center">
            <div className="flex items-center gap-1.5 text-black/90 hover:text-primary font-bold text-sm group-hover:gap-2.5 transition-all duration-300 dark:text-slate-200">
              <span>Read More</span>
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

PostCard.displayName = "PostCard";
export default PostCard;
