import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar";
import MiddleContent from "./MiddleContent";
import RightSideBar from "./RightSideBar";
import Header from "../components/Header";


const Home = () => {
  const [loadPosts, setLoadPosts] = useState(false);

  const loadPostHandler = () => {
    setLoadPosts((prev) => !prev);
  }

  return (
    <>
    <Header />
      <div className="sidesContainer">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar />
          </div>
          <div className="col-md-6">
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
