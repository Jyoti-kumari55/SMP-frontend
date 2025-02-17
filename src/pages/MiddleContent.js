import React from "react";
import CreatePost from "./CreatePost";
import Tweets from "./Tweets";
import Posts from "./Posts";
import Feed from "./Feed";

const MiddleContent = () => {
  return (
    <div>
      {/* style={{fontSize: "30px"}} */}
      {/* <CreatePost /> */}
      <Posts />
      {/* <Feed /> */}
    </div>
  );
};

export default MiddleContent;
