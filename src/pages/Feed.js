import React, { useEffect, useState } from "react";
import Tweets from "./Tweets";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchPostsSuccess } from "../features/postSlice";

const Feed = () => {
  const { token } = useSelector((state) => state.auth);
  const { posts, isloading } = useSelector((state) => state.post)
  const dispatch = useDispatch();
  const [filterPostType, setFilterPostType] = useState("Date");
  const [showSortType, setShowSortType] = useState(false);
    
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
           `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/allPosts`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          }
        );
        dispatch(fetchPostsSuccess(response.data));
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [token, isloading, dispatch]);
    
    // Sorting of Date and trending done in descending order( recent to oldest)
      const filterPosts = (posts) => {
        if (filterPostType === "Date") {
          return [...posts].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (filterPostType === "Trending") {
          return [...posts].sort((a, b) => b.likes.length - a.likes.length);
    
        }
        return posts;
      };
    
      const filteredPosts = filterPosts(posts);
      return (
        <div>
          <div className="d-flex mt-4">
            <h2 className="fw-bold">Latest Posts</h2>
            <span
              className="btn pt-0 ms-auto fw-semibold"
              onClick={() => setShowSortType(!showSortType)}
            >
              Sort by
              <h2>
                {" "}
                <i class="bi bi-sliders2"></i>
              </h2>
            </span>
            {showSortType && filteredPosts && filteredPosts.length > 0 && (
              <div className="row" >
                <p
                  className="btn mb-0 pb-0 fs-5 fw-medium"
                  onClick={() => setFilterPostType("Date")}
                >
                  Date
                </p>
                <p
                  className="btn pt-0 fs-5 fw-medium"
                  onClick={() => setFilterPostType("Trending")}
                >
                  Trending
                </p>
              </div>
            )}
          </div>    
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((tweet) => <Tweets key={tweet._id} post={tweet} />)
          ) : (
            <p>There is no post. </p>
          )}   
        </div>
      );
    };

export default Feed
