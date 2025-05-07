import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import Tweets from "./Tweets";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Explore = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { posts,  isloading } = useSelector((state) => state.post);
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("forYou");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/allUsersPosts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllPosts(response.data.posts);
        setIsLoading(false);
      } catch (error) {
      console.error(error);
      setError(error.message || "Error loading posts");
      setIsLoading(false);
      }
    };
    fetchUserPosts();
   
  }, [token, navigate]);

  const clickTabHandler = (tab) => {
    setView(tab);
  };

  const newsKeywords = ["news", "breaking", "headline", "death", "alert", "report", "media"];
  const entertainmentKeywords = ["entertainment", "movie", "show", "fun", "series", ];
  const sportsKeywords = [
    "sports",
    "football",
    "basketball",
    "game",
    "cricket",
    "players",
    "exercise"
  ];
  return (
    <>
      <Header />
      <div className="sidesContainer">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar />
          </div>
          <div className="col-md-6">
            <div className="m-3 d-flex justify-evenly border-bottom explore-tabs">
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
                onClick={() => clickTabHandler("trending")}
              >
                <h5
                  className={`hover-effect ${
                    view === "trending" ? "text-primary" : ""
                  }`}
                >
                  Trending
                </h5>
              </div>
              <div
                className="w-100 text-center"
                onClick={() => clickTabHandler("sports")}
              >
                <h5
                  className={`hover-effect ${
                    view === "sports" ? "text-primary" : ""
                  }`}
                >
                  Sports
                </h5>
              </div>
              <div
                className="w-100 text-center"
                onClick={() => clickTabHandler("entertainment")}
              >
                <h5
                  className={`hover-effect ${
                    view === "entertainment" ? "text-primary" : ""
                  }`}
                >
                  Entertainment
                </h5>
              </div>
              <div
                className="w-100 text-center"
                onClick={() => clickTabHandler("news")}
              >
                <h5
                  className={`hover-effect ${
                    view === "news" ? "text-primary" : ""
                  }`}
                >
                  News
                </h5>
              </div>
            </div>
            <div>
            {isLoading && <div className="mt-3 fs-5">Loading posts...  ↻</div>}
            {error && <div>Error occured while fetching posts. </div>}
              {view === "forYou" &&
                allPosts?.map((tweet) => <Tweets key={tweet?._id} post={tweet} />)}

              {view === "trending" &&
                allPosts?.map((tweet) => (
                  <div>
                    {tweet?.likes?.length > 4 && (
                      <Tweets key={tweet?._id} post={tweet} />
                    )}
                  </div>
                ))}
              {view === "news" &&
                allPosts
                  ?.filter((post) =>
                    newsKeywords.some((keyword) =>
                      post?.desc?.toLowerCase().includes(keyword)
                    )
                  )
                  .map((tweet) => <Tweets key={tweet?._id} post={tweet} />)}

              {view === "entertainment" &&
                allPosts
                  ?.filter((post) =>
                    entertainmentKeywords.some((keyword) =>
                      post?.desc?.toLowerCase().includes(keyword)
                    )
                  )
                  .map((tweet) => <Tweets key={tweet?._id} post={tweet} />)}

              {view === "sports" &&
                allPosts
                  ?.filter((post) =>
                    sportsKeywords.some((keyword) =>
                      post?.desc?.toLowerCase().includes(keyword)
                    )
                  )
                  .map((tweet) => <Tweets key={tweet?._id} post={tweet} />)}
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

export default Explore;
