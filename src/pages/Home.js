import React, { useEffect, useState } from "react";
import LeftSideBar from "./LeftSideBar";
import MiddleContent from "./MiddleContent";
import RightSideBar from "./RightSideBar";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loadPosts, setLoadPosts] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const loadPostHandler = () => {
    setLoadPosts((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="sidesContainer ">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar />
          </div>
          <div className="col-md-6 ">
            <MiddleContent />
          </div>
          <div className="col-md-3 d-none d-xl-block">
            <RightSideBar onFollowChange={loadPostHandler} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
