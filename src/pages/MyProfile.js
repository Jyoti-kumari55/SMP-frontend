import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfileFailure,
  fetchUserProfileStart,
  fetchUserProfileSuccess,
} from "../features/userSlice";
import Tweets from "./Tweets";
import UserEditForm from "./UserEditForm";
import { toggleFollowHandler } from "../actions/userActions";

const MyProfile = () => {
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const defaultCoverImg =
    "https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg?auto=compress&cs=tinysrgb&w=400";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { profile, isLoading, error } = useSelector((state) => state.user);
  const { token, user } = useSelector((state) => state.auth);
  //console.log("User:", user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUserId = user?._id;
  
  // const currentUserId = user;
  // console.log("Current User----: ", currentUserId);

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(fetchUserProfileStart());

      const idToFetch = userId || currentUserId;
      if (!idToFetch) {
        navigate("/login"); // Redirect if no userId is available
        return;
      }
      try {
        const response = await axios.get(
           `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/profile/${idToFetch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        dispatch(fetchUserProfileSuccess(response.data));
        console.log("Profile: ", response.data);
      } catch (error) {
        console.error(error);
        dispatch(
          fetchUserProfileFailure(
            error.response?.data?.error || "Failed to fetch profile"
          )
        );
      }
    };
    fetchProfile();
  }, [dispatch, token, currentUserId, navigate, userId]);

//   const isFollowing = currentUserId && 
//   Array.isArray(profile?.user?.followings) && profile?.user?.followings.includes(currentUserId);
// const isFollowedByUser = currentUserId &&
//  Array.isArray(profile?.user?.followers) && profile?.user?.followers.includes(currentUserId);

  const isFollowing =
    currentUserId && profile?.user?.followings.includes(currentUserId);

  const isCurrentUserProfile = currentUserId === profile?.user?._id;

  const isFollowedByUser =
  currentUserId && profile?.user?.followers.includes(currentUserId);
  const filterPosts = (posts) => {
    return posts?.filter((post) => !post.postId);
  };

  const sumbitFormHandler = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleFollowClick = async () => {
    try {
      if (!isFollowing && !isFollowedByUser) {
        await toggleFollowHandler(profile?.user?._id, user, token, dispatch);
      }
      // else if (isFollowing) {
      //   await toggleFollowHandler(profile?.user?._id, user, token, dispatch);
      // }
      else if (isFollowing && !isFollowedByUser) {
        await toggleFollowHandler(profile?.user?._id, user, token, dispatch);
      }
      else if (!isFollowing && isFollowedByUser) {
        await toggleFollowHandler(profile?.user?._id, user, token, dispatch);
      }

      dispatch(fetchUserProfileStart());
      const response = await axios.get(
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/profile/${profile?.user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      dispatch(fetchUserProfileSuccess(response.data));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="sidesContainer ">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar />
          </div>
          <div className="col-md-6 mt-2">
            {isLoading && <p>Loading...</p>}
            {error && <p>An error occured while fetching data.</p>}
            <NavLink
              to="/home"
              className="mt-4 border-0 text-black"
              style={{ fontSize: "35px", textDecoration: "none" }}
            >
              &#8592;
            </NavLink>
            <span className="ms-3 fw-bold fs-4 mb-1">
              {profile?.user?.name}
            </span>
            <p className="fw-semibold ms-5 text-secondary mb-2">
              {filterPosts(profile?.posts)?.length} posts
            </p>

            <div className="profileCover">
              <img
                src={profile?.user?.coverPicture || defaultCoverImg}
                alt="cover-img"
                className="img-fluid coverImg"
              />

              <div className="profilePictureContainer">
                <img
                  src={profile?.user?.profilePicture || defaultProfileImg}
                  className="border rounded-circle profilePicture"
                  alt="Profile"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end">
              {isCurrentUserProfile ? (
                <button
                  type="button"
                  className="bg-white rounded-2 mt-2 px-3 border border-secondary-subtle"
                  onClick={sumbitFormHandler}
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  className={`bg-white rounded-2 mt-2 px-3 border border-secondary-subtle ${
                    isFollowing || isFollowedByUser ?  "text-primary" : ""
                  }`}
                  onClick={handleFollowClick}
                >
                  {isFollowing
                    ? "Following"
                    : isFollowedByUser
                    ? "Follow Back"
                    : "Follow"}
                </button>
              )}
            </div>

            <div className="d-flex flex-column align-items-center ">
              <div className="text-center">
                <h4 style={{ fontSize: "35px" }}>{profile?.user?.name}</h4>
                <p className="">@{profile?.user?.username}</p>
                <p style={{ fontWeight: "700" }}>{profile?.user?.bio || " "}</p>
                <div>
                  <span>
                    <i class="bi bi-calendar3"></i> Joined{" "}
                    {profile?.user?.createdAt
                      ? new Date(profile?.user?.createdAt).toLocaleDateString(
                          "en-us",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )
                      : " "}
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-evenly gap-5 m-4 ">
                <Link
                  to={`/userlist/${userId}/followings`}
                  className="text-decoration-none text-black"
                >
                  {profile?.user?.followings?.length} Followings
                </Link>
                <Link
                  to={`/userlist/${userId}/followers`}
                  className="text-decoration-none text-black"
                >
                  {profile?.user?.followers?.length} Followers
                </Link>
              </div>
            </div>

            <h4>Your Posts</h4>
            {profile?.posts?.length > 0 ? (
              <div className="">
                <div className="d-flex row ">
                  {filterPosts(profile?.posts).map((userPost) => (
                    <Tweets key={userPost._id} post={userPost} />
                  ))}
                </div>
              </div>
            ) : (
              <p> No post by user. </p>
            )}
          </div>
          <div className="col-md-3 d-none d-xl-block">
            <RightSideBar />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "rgba(179, 176, 176, 0.5)" }}
              >
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={sumbitFormHandler}
                ></button>
              </div>
              <div
                className="modal-body "
                style={{ backgroundColor: "rgba(232, 223, 223, 0.5)" }}
              >
                <UserEditForm userDetail={profile?.user} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfile;








