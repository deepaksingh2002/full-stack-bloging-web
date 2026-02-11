import React, { memo } from "react";
import { Link } from "react-router-dom";
import { 
  HiTag, 
  HiEye, 
  HiUserCircle, 
  HiArrowRight,
  HiHeart 
} from 'react-icons/hi2';

const PostCard = memo(function PostCard({ post, onLike, likes = 0, liked = false }) {
  if (!post) return null;

  const {
    title,
    thumbnail,
    createdAt,
    owner,
    category,
    views
  } = post;

  const author = owner?.username || "Unknown Author";
  const safeCategory = category || "";

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

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
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..."
      : text;
  };

  return (
    <Link
      to={`/post/${post._id}`}
      className="group relative block h-[360px] w-full focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-xl border border-primary/10 hover:border-primary/20 shadow-lg hover:shadow-xl"
      aria-label={`Read post: ${title || "Untitled"}`}
    >
      <div className="relative h-[42%] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/5 to-transparent">
        <img
          src={optimizeImageUrl(thumbnail)}
          alt={title || "Post thumbnail"}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
        />
        
        {safeCategory && (
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 border border-primary/20">
              <HiTag className="w-3 h-3 flex-shrink-0" />
              <span>{safeCategory}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[58%] p-5 space-y-3 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex items-start justify-between h-14">
          <h2 className="flex-1 text-base font-bold text-black leading-tight line-clamp-2 pr-6 group-hover:text-primary transition-colors duration-300">
            {truncateText(title)}
          </h2>
          <div className="flex-shrink-0 ml-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-primary/90 backdrop-blur-sm rounded-full hover:bg-primary hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md">
              <HiEye className="w-3 h-3 flex-shrink-0" />
              <span>{views || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/20 pb-2 text-xs">
          <div className="flex items-center gap-2 text-gray-700 flex-shrink-0">
            <div className="p-1.5 rounded-full bg-primary/10 border border-primary/20">
              <HiUserCircle className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold max-w-20 truncate">{author}</span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike?.(post._id);
            }}
            className="group/like flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-primary/90 backdrop-blur-sm rounded-full border border-primary/20 hover:bg-primary hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 active:scale-95 shadow-md"
            title="Like post"
          >
            <HiHeart 
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                liked 
                  ? 'text-white/90 fill-white scale-110 shadow-sm' 
                  : 'text-white/70 group-hover/like:scale-110'
              }`} 
            />
            <span className={`${liked ? 'text-white font-bold' : 'text-white/80 group-hover/like:text-white'}`}>
              {likes}
            </span>
          </button>
        </div>

        <div className="flex-1 flex items-end pb-2">
          <div className="w-full flex justify-center">
            <div className="flex items-center gap-1.5 text-black/90 hover:text-primary font-bold text-sm group-hover:gap-2.5 transition-all duration-300">
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
