import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../features/authSlice";
import CreatePost from "./CreatePost";
const LeftSideBar = () => {
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const { token, user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);
  const [logoutBtn, setLogoutBtn] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/auth/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      dispatch(logoutSuccess());
      navigate("/login");
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
      {/* <button type="submit" className="btn mt-2 px-5 createPostBtn">
        Create New Post
      </button> */}

      <button
        type="button"
        className="btn mt-2 px-5 createPostBtn"
        onClick={() => setShowCreatePostModal(true)} 
      >
        Create New Post
      </button>

      <div className="d-flex gap-4 mt-5 ml-0" style={{ paddingTop: "6rem" }}>
        <img
          src={user?.profilePicture || defaultProfileImg}
          alt="user"
          className="img-fluid rounded-circle "
          // style={{ width: "15%", height: "15%" }}
          style={{
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "50%",
  }}
        />
        <div className="row mt-2">
          <h6 className="mb-0">{user?.name}</h6>
          <p className="mt-0">@{user?.username}</p>
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
      </div>

      {showCreatePostModal && (
        <div className="modal show d-block createPostModal" style={{ zIndex: 1050 }}>
          <div className="modal-dialog createPostDialog">
            <div className="modal-content createPostContent">
              <div className="modal-header createPostHeader">
                <h5 className="modal-title createPostTitle">Create Post</h5>
                <button
                  type="button"
                  className="btn-close createPostCloseBtn"
                  onClick={() => setShowCreatePostModal(false)} 
                ></button>
              </div>
              <div className="modal-body createPostBody">
                <CreatePost />  
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSideBar;
