import React, { useEffect, useState } from "react";
import Tweets from "./Tweets";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchPostsStart, fetchPostsSuccess } from "../features/postSlice";
import CreatePost from "./CreatePost";

const Posts = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { posts, error, isloading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [filterPostType, setFilterPostType] = useState("Date");
  const [showSortType, setShowSortType] = useState(false);
  const [view, setView] = useState("forYou");
  const following = user?.followings || [];

  // const posts = useSelector((state) => state.post.posts);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/api/posts/allPosts",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );
  //       //setPost(response.data);
  //       dispatch(fetchPostsSuccess(response.data));
  //      // console.log("All Posts: ", response.data);

  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchPosts();
  // }, [token, isloading, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("55: ", );

        const apiUrl =
          view === "forYou"
            ?  `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/allPosts`
            :  `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/followingPosts`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log("5555: ", response.data);
        dispatch(fetchPostsSuccess(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [view, token, dispatch]);

  const clickTabHandler = (tab) => {
    setView(tab);
  };

  // Sorting of Date and trending done in descending order( recent to oldest)

  // const filterPosts = (posts) => {
  //   if (filterPostType === "Date") {
  //     return [...posts].sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );
  //   } else if (filterPostType === "Trending") {
  //     return [...posts].sort((a, b) => b.likes.length - a.likes.length);

  //   }
  //   return posts;
  // };

  const filterPosts = (posts) => {
    if (view === "forYou") {
      if (filterPostType === "Date") {
        return [...posts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      } else if (filterPostType === "Trending") {
        return [...posts].sort((a, b) => b.likes.length - a.likes.length);
      }
    }
    return posts;
  };

  const filteredPosts = filterPosts(posts);

  return (
    <div>
      <div className="m-3 d-flex justify-evenly border-bottom">
        <div
          className="w-100 text-center"
          onClick={() => clickTabHandler("forYou")}
        >
          <h5
            className={`hover-effect ${
              view === "forYou" ? "text-primary" : ""
            }`}
          >
            For you
          </h5>
        </div>
        <div
          className="w-100 text-center"
          onClick={() => clickTabHandler("following")}
        >
          <h5
            className={`hover-effect ${
              view === "following" ? "text-primary" : ""
            }`}
          >
            Following
          </h5>
        </div>
      </div>
      <CreatePost />
      <div className="d-flex mt-4">
        <h2 className="fw-bold">Latest Posts</h2>
        { isloading && <div> Loading posts... </div>}
        { error && <div>Error occured while fetching the posts. </div>}
        {view === "forYou" && (
          <span
            className="btn pt-0 ms-auto fw-normal"
            onClick={() => setShowSortType(!showSortType)}
          >
            Sort by
            <h4>
              {" "}
              <i className="bi bi-sliders2"></i>
            </h4>
          </span>
        )}
        {showSortType &&
          filteredPosts &&
          filteredPosts.length > 0 &&
          view === "forYou" && (
            <div className="row">
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
        <p>There are no posts.</p>
      )}
    </div>
  );
};

//  <div className="d-flex mt-4">
//     <h2 className="fw-bold">Latest Posts</h2>
//     <span
//       className="btn pt-0 ms-auto fw-normal"
//       onClick={() => setShowSortType(!showSortType)}
//     >
//       Sort by
//       <h4>
//         {" "}
//         <i class="bi bi-sliders2"></i>
//       </h4>
//     </span>
//     {showSortType && filteredPosts && filteredPosts.length > 0 && (
//       <div className="row" >
//         <p
//           className="btn mb-0 pb-0 fs-5 fw-medium"
//           onClick={() => setFilterPostType("Date")}
//         >
//           Date
//         </p>
//         <p
//           className="btn pt-0 fs-5 fw-medium"
//           onClick={() => setFilterPostType("Trending")}
//         >
//           Trending
//         </p>
//       </div>
//     )}
//   </div>
//   {filteredPosts && filteredPosts.length > 0 ? (
//     filteredPosts.map((tweet) => <Tweets key={tweet._id} post={tweet} />)
//   ) : (
//     <p>There is no post. </p>
//   )}
// </div>

export default Posts;
