import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../features/authSlice";

const LeftSideBar = () => {

  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  //const user = useSelector((state) => state.auth.user);
  const { token, user } = useSelector((state) => state.auth);
  const { profile, isLoading, error } = useSelector((state) => state.user);
  
  console.log("user: ", user, "prod: ", profile, "pname: ", profile?.user?.name);

  const [logoutBtn, setLogoutBtn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const logoutUser = async () => {
    try {
      await axios.get( `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers for authorization
        },
        withCredentials: true,
      });
      dispatch(logoutSuccess());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-5">
      <ul className="nav flex-column fw-bold ">
        <li className="nav-item">
          <NavLink className="nav-link text-dark ps-2" to="/home">
            <i className="bi bi-house-door"></i>
            <span className="ps-3">Home</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-dark ps-2" to="/explore">
            <i class="bi bi-rocket"></i>
            <span className="ps-3">Explore</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-dark ps-2" to="/bookmark">
            <i class="bi bi-bookmark"></i>
            <span className="ps-3">Bookmark</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-dark ps-2"
            to={`/profile/${user?._id}`}
          >
            <i class="bi bi-person"></i>
            <span className="ps-3">Profile</span>
          </NavLink>
        </li>
      </ul>
      <button type="submit" className="btn mt-2 px-5 createPostBtn">
        Create New Post
      </button>

      {/* <button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Top popover">
  Popover on top
</button> */}
      <div className="d-flex gap-4 mt-5 ml-0" style={{ paddingTop: "6rem" }}>
        <img
          src={user?.profilePicture || defaultProfileImg}
          // src={profile?.user?.profilePicture || defaultProfileImg}
          alt="user"
          className="rounded-circle"
          style={{ width: "15%", height: "15%" }}
        />
        <div className="row">
          <h6 className="mb-0">{user?.name}</h6>
          <p className="mt-0">@{user?.username}</p>
          {/* <h6 className="mb-0">{profile?.user?.name}</h6>
          <p className="mt-0">@{profile?.user?.username}</p> */}
        </div>
        <div className="pe-4">
          <span
            className="btn"
            type="button"
            onClick={() => setLogoutBtn(!logoutBtn)}
          >
            <i class="bi bi-three-dots"></i>
          </span>
          {logoutBtn && user && (
            <button
              className="btn btn-light text-light"
              style={{
                borderRadius: "10px",
                backgroundColor: "gray",
                padding: "8px 12px",
              }}
              onClick={logoutUser}
            >
              Logout
            </button>
          )}
        </div>
        {/* <h5 className="pe-5" >...</h5> */}
      </div>
    </div>
  );
};

export default LeftSideBar;
