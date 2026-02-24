import React, { useState, useEffect, useRef, useCallback } from "react";
import { Logo, Contaner, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthUser } from '../../features/auth/authSlice';
import { searchPosts } from '../../features/post/postThunks';
import { HiOutlineBars3, HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

// Responsive app header:
// - Desktop: logo, search, nav items, and profile/logout actions
// - Mobile: compact top bar with inline search and slide-down drawer menu
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const avatar = user?.avatar;

  // Local UI state for mobile menu visibility and async search feedback.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const menuRef = useRef(null);

  // Navigation options are conditionally shown based on auth state.
  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-post", active: true },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Profile", slug: "/profile", active: authStatus },
  ];

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Executes Redux-powered search and routes user to the results page.
  const handleSearch = useCallback(async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setSearching(true);
    try {
      // Persist searched posts in Redux, then open URL-based results view.
      await dispatch(searchPosts(query)).unwrap();
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
    } finally {
      setSearching(false);
      setSearchQuery('');
    }
  }, [searchQuery, dispatch, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Close mobile drawer when user clicks outside drawer boundaries.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="py-3 mb-4 shadow-lg bg-primary text-white w-full z-50 fixed top-0 left-0 right-0 overflow-x-hidden">
      <Contaner>
        {/* Desktop layout (sm and above) */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0 h-11 w-11 border-2 border-white rounded-xl flex items-center justify-center">
            <Logo width="40px" />
          </Link>

          {/* Main search control */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search posts..."
                disabled={searching}
                className={`flex-1 pl-4 pr-12 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white focus:outline-none focus:bg-white/20 transition-all text-white placeholder-gray-300 ${
                  searching ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {searching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <HiMagnifyingGlass className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <ul className="flex items-center gap-2 flex-shrink-0">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="h-11 border-2 border-white text-black font-bold px-4 rounded-xl hover:bg-white hover:scale-[1.02] transition-all text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
          </ul>

          {authStatus && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <LogoutBtn />
              <button
                onClick={() => navigate("/profile")}
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-white hover:scale-105 transition-all"
              >
                <img
                  src={avatar || defaultAvatar}
                  className="w-full h-full object-cover"
                  alt="User Avatar"
                />
              </button>
            </div>
          )}
        </div>

        {/* Mobile layout (below sm) */}
        <div className="sm:hidden px-2 w-full overflow-hidden">
          <div className="flex items-center gap-2 w-full min-w-0">
            <Link to="/" className="h-11 w-11 border-2 border-white rounded-xl hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center flex-shrink-0">
              <Logo width="28px" />
            </Link>

            {/* Mobile inline search (between logo and menu toggle) */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="relative flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search..."
                  disabled={searching}
                  className={`h-11 w-full pl-3 pr-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white focus:outline-none focus:bg-white/20 transition-all text-white placeholder-gray-300 text-sm ${
                    searching ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-all disabled:opacity-50"
                  type="button"
                >
                  {searching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <HiMagnifyingGlass className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={toggleMenu}
              className="h-11 w-11 rounded-lg hover:bg-white/20 transition-all z-50 border border-white/20 flex items-center justify-center flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Contaner>

      {/* Mobile drawer anchored below fixed header */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="sm:hidden absolute inset-x-0 top-full px-2 pt-2 z-40"
        >
          <div className="bg-primary/95 backdrop-blur-md border border-white/20 rounded-2xl py-5 px-4 shadow-2xl space-y-3 w-full max-w-full max-h-[70vh] overflow-y-auto overflow-x-hidden">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-3">Menu</h3>

            {navItems.map((item) =>
              item.active && (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug);
                    closeMenu();
                  }}
                  className="w-full text-left p-4 rounded-xl hover:bg-white/20 transition-all border border-white/30 text-white font-semibold text-base shadow-sm"
                >
                  {item.name}
                </button>
              )
            )}

            {authStatus && (
              <>
                <div className="border-t border-white/20 pt-4">
                  <LogoutBtn />
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-white/20 transition-all border border-white/30 text-white font-semibold shadow-sm"
                >
                  <img
                    src={avatar || defaultAvatar}
                    className="w-10 h-10 rounded-full border-2 border-white flex-shrink-0"
                    alt="User Avatar"
                  />
                  <span>Profile</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
