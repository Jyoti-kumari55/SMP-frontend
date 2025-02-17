import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  bookmarkPostSuccess,
  fetchBookmarkedPostsSuccess,
  removeBookmarkedPostSuccess,
} from "../features/userSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { likePostSuccess } from "../features/postSlice";
import Tweets from "./Tweets";

const Bookmark = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  const defaultImg =
    "https://pbs.twimg.com/profile_images/1688080694763769856/RG0UK6lY_400x400.jpg";

  useEffect(() => {
    const fetchAllBookmarkedPost = async () => {
      try {
        const response = await axios.get(
           `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/bookmark`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("hhhj", response.data);

        // const updatedBookmarksPost = response.data.bookmarks.map((userPost) => {
        //   const isLiked = userPost?.post?.likes?.includes(user?._id) || false;
        //   const isBookmarked =
        //     userPost?.owner?.bookmarks?.includes(user?._id) || false;
        //   return {
        //     ...userPost,
        //     isLiked: isLiked,
        //     likeBtnClr: isLiked ? "red" : "black",
        //     likesCount: userPost?.post?.likes?.length || 0,
        //     isBookmarked: isBookmarked,
        //   };
        // });
        // dispatch(fetchBookmarkedPostsSuccess(response.data));
        // setBookmarkedPosts(response.data.bookmarks);
        setBookmarkedPosts(response.data.bookmarks);
        dispatch(fetchBookmarkedPostsSuccess(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    if (token) {
      fetchAllBookmarkedPost();
    }
  }, [dispatch, token, user]);

  const likePostClickHandler = async (postId, isLiked, index) => {
    try {
      // Update the Post likes count and its color
      const updatedPosts = [...bookmarkedPosts];

      updatedPosts[index].isLiked = !isLiked;
      updatedPosts[index].likeBtnClr = isLiked ? "black" : "red";
      updatedPosts[index].likesCount = isLiked
        ? updatedPosts[index].likesCount - 1
        : updatedPosts[index].likesCount + 1;

      setBookmarkedPosts(updatedPosts);

      await axios.post(
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/like/${postId}`,
        {
          userId: user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(likePostSuccess(posts));
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkedPostHandler = async (postId, isBookmarked, index) => {
    try {
      const updatedPosts = [...bookmarkedPosts];
      updatedPosts[index].isBookmarked = !isBookmarked;
      setBookmarkedPosts(updatedPosts);

      const response = await axios.post(
      `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/removeBookmark/${postId}`,
        {
          userId: user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(removeBookmarkedPostSuccess(postId));
      console.log("Remove Post: ", response.data);
      navigate(0);
      setAlertMessage("Post removed from your Bookmarks.");
      dispatch(bookmarkPostSuccess(updatedPosts));
      setTimeout(() => {
        setAlertMessage(" ");
      }, 1500);
    } catch (error) {
      console.log("An error occurred while removing bookmarked post: ", error);
    }
  };
  return (
    <>
      <Header />
      <div className="sidesContainer">
        <div className="row ">
          <div className="col-md-3">
            <LeftSideBar />
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-4 mt-5">
              <NavLink
                to="/home"
                className="border-0 text-black"
                style={{ fontSize: "35px", textDecoration: "none" }}
              >
                &#8592;
              </NavLink>
              <span className="mt-2 fw-bold fs-3">Bookmarks</span>
            </div>

            <div className="d-flex flex-column ">
              {bookmarkedPosts.length > 0 ? (
                <div className="d-flex row mb-4">
                  {bookmarkedPosts?.map((userPost) => (
                    <Tweets key={userPost.post._id} post={userPost.post} />
                  ))}
                </div>
              ) : (
                <h2>No Bookmarked yet!! </h2>
              )}
            </div>
          </div>
          <div className="col-md-3 d-none d-xl-block">
            <RightSideBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookmark;
