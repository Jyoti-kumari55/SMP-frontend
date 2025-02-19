import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchBookmarkedPostsSuccess,
} from "../features/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import Tweets from "./Tweets";

const Bookmark = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

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
