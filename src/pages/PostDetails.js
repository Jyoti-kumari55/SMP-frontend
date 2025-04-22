import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import Tweets from "./Tweets";
import Header from "../components/Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { fetchPostByIdSuccess } from "../features/postSlice";

const PostDetails = () => {
  const { token, user } = useSelector((state) => state.auth);
  const { postId } = useParams();
  const [postDetail, setPostDetail] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(
           `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        dispatch(fetchPostByIdSuccess(response.data));
        setPostDetail(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) {
      fetchPostDetail();
    }
  }, [dispatch, postId, token, user]);

  return (
    <>
      <Header />
      <div className="sidesContainer">
        <div className="row">
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
              <span className="mt-2 fw-bold fs-3">Post</span>
            </div>
            {postDetail ? (
              <div>
                {/* <h4> {postDetail?.post?.desc}</h4> */}
                <Tweets key={postDetail?.post?._id} post={postDetail?.post} />
                <hr />
                {postDetail?.comments?.length > 0 ? (
                  <>
                    <h3 className="mb-3">Comments: </h3>
                    {postDetail?.comments?.map((data) => (
                      <Tweets key={data?._id} post={data} />
                    ))}
                  </>
                ) : (
                  <p></p>
                )}
              </div>
            ) : (
              <p className="fs-5">Loading post comments... ↻</p>
            )}
          </div>
          <div className="col-md-3">
            <RightSideBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
