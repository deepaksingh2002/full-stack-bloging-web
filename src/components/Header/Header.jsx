import React from "react";
import { Logo, Contaner, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthUser} from '../../features/auth/authSlice';

function Header() {
  const authStatus = useSelector(selectIsAuthenticated);
  const userData = useSelector(selectAuthUser);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-post",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];


  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <header className="py-4 shadow bg-primary text-white w-full z-50">
      <Contaner>
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="mr-4">
            <Link to="/">
              <Logo width="50px" />
            </Link>
          </div>

          <ul className="flex flex-col sm:flex-row items-center gap-3">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="border-2 border-white text-black font-bold px-6 py-2 rounded-xl hover:bg-white hover:text-primary transition"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {authStatus && (
              <>
                <li>
                  <LogoutBtn />
                </li>

                <li>
                  <img
                    src={userData?.avatar || defaultAvatar}
                    onClick={() => navigate("/profile")}
                    className="w-12 h-12 rounded-full border-2 border-white cursor-pointer hover:scale-105 transition"
                    alt="User Avatar"
                  />
                </li>
              </>
            )}
          </ul>
        </nav>
      </Contaner>
    </header>
  );
}

export default Header;
