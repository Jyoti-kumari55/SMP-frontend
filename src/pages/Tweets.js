import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentSuccess,
  deletePostSuccess,
  likePostSuccess,
  updatePostSuccess,
} from "../features/postSlice";
import { bookmarkPostSuccess } from "../features/userSlice";

function Tweets({ post }) {
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 // console.log("posts: ", post);

  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes(user?._id) || false
  );

  const [likeBtnClr, setLikeBtnClr] = useState(isLiked ? "red" : "black");
  const [showPopUp, setShowPopUp] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.desc);
  const [isBookmark, setIsBookmark] = useState(
    user?.bookmarks?.filter((markPost) => markPost === post?._id).length > 0
  );
  const [commentCount, setCommentCount] = useState(post?.commentCount || null);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);
  
  const popUpHandler = () => {
    setShowPopUp(!showPopUp);
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/${post?._id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers for authorization
          },
          withCredentials: true,
        }
      );
      // setAlert("Post deleted successfully.")
      //dispatch(deletePostSuccess(post));
      // window.location.reload();
      navigate(0);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const editPostHandler = async () => {
    if (!editedContent.trim()) return;
    const formData = new FormData();
    formData.append("desc", editedContent);

    try {
      const response = await axios.put(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/edit/${post?._id}`,

        {
          desc: editedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      console.log(", hhh", response.data);
      setEditedContent(editedContent);
      setIsEdit(false);
      dispatch(updatePostSuccess(response.data));
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const likePostClickHandler = async () => {
    try {
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      setLikeBtnClr(!isLiked ? "red" : "black");
      setIsLiked((prev) => !prev);
      const response = await axios.post(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/like/${post?._id}`,

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
      console.log("3334445", response.data.message);
      dispatch(likePostSuccess(post));
      navigate(0);

      //setAlert(`${post?.userId?.name} liked the post.`);
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkedPostHandler = async () => {
    try {
      // setIsBookmark((prev) => !prev);
      // setBookmarkedCounts((prev) => (isBookmark ? prev - 1 : prev + 1))
      const response = await axios.put(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/bookmark/${post?._id}`,
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

      console.log("yuyuyu: ", response);
      setIsBookmark((prev) => !prev);
      // setBookmarkedCounts((prev) => (isBookmark ? prev - 1 : prev + 1))
      dispatch(bookmarkPostSuccess(post));
      navigate(0);

      // if(response.message === "User removed bookmarked post.") {
      //   window.location.reload();
      // }

      setError("");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error || "Login failed. Please try again!"
      );
    }
  };

  const commentPostHandler = async () => {
    try {
      //console.log("id", post?._id, commentText, user?._id);
      const response = await axios.post(
        //`http://localhost:8080/api/comments/create/${post?._id}`,
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/create`,

        {
          postId: post?._id,
          desc: commentText,
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
      setCommentText(" ");
      setCommentCount((prevCount) => prevCount + 1);
      setShowCommentInput((prev) => !prev);
      console.log("Comment", response.data);
      navigate(0);
      dispatch(createCommentSuccess(response.date));
    } catch (error) {
      console.error(error);
    }
  };

  const isDescNotEmpty = commentText.trim() !== "";
  const buttonClass = isDescNotEmpty
    ? "btn ms-4 px-4 rounded-2 mt-4 createPostBtn text-white bg-primary" 
    : "btn ms-4 px-4 rounded-2 mt-4 createPostBtn text-muted btn btn-secondary";

  const formattedDate = post?.createdAt
    ? formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })
    : "";

  

  return (
    <>
      {error && <p>Error occured while fetching all the tweets.</p>}
      <div className="my-3 ">
        <div
          className="p-3 mt-3"
          style={{ width: "100%", backgroundColor: "white" }}
        >
          {/* to={`/myProfile/${post?.userId?._id}`}  */}
          <div className="d-flex justify-content-between align-items-center">
            <Link
              to={`/profile/${post?.userId?._id}`}
              className="d-flex gap-2 text-decoration-none"
            >
              <img
                src={post?.userId?.profilePicture || defaultProfileImg}
                alt=""
                className="tweetProfileImg img-fluid"
              />
              <div className="d-flex mt-1 gap-2">
                <h6 className="fs-5 text-black">{post?.userId?.name}</h6>
                <p className="text-secondary">
                  @{post?.userId?.username} &bull; {formattedDate}
                </p>
              </div>
            </Link>

            <div>
              {post?.userId?._id === user?._id && (
                <span className="pe-0 btn" onClick={popUpHandler}>
                  <i class="bi bi-three-dots"></i>
                </span>
              )}
              {showPopUp && post?.userId?._id === user?._id && (
                <div
                  className="row "
                  style={{ width: "2rem", paddingLeft: "1rem" }}
                >
                  <button
                    className="text-black btn border-0"
                    style={{ fontSize: "1rem" }}
                    onClick={() => setIsEdit(true)}
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="text-danger btn border-0"
                    style={{ fontSize: "1rem" }}
                    onClick={deletePostHandler}
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div style={{ marginLeft: "40px" }}>
            
            {isEdit ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={3}
                  className="form-control"
                />
                <button
                  className="btn btn-primary my-3 ms-1"
            
                  onClick={editPostHandler}
                >
                  Save
                </button>
              </div>
            ) : (
              <Link
                className="text-decoration-none text-black"
                to={`/postDetails/${post?._id}`}
              >
                <span>{post?.desc}</span>
            <img src={post?.img ? post.img : " "} alt="" className="tweetImg" />

              </Link>
            )}
            {/* <img src={post?.img ? post.img : " "} alt="" className="tweetImg" /> */}
          </div>

          <div
            className="d-flex justify-content-between"
            style={{ marginLeft: "40px" }}
          >
            <div className="d-flex gap-2">
              <div
                onClick={likePostClickHandler}
                style={{ color: likeBtnClr }}
              >
                <i className="bi bi-heart heart"></i>
              </div>
              <span>{likesCount}</span>
            </div>

            <div className="d-flex gap-2">
              <div onClick={() => setShowCommentInput((prev) => !prev)}>
                <i className="bi bi-chat-left-dots chat-dots"></i>
              </div>
              <span style={{ marginTop: "-2px" }}>{commentCount}</span>
            </div>

            <div className="d-flex gap-2">
              <i className="bi bi-share share"></i>
              <span>{post?.share}</span>
            </div>

            <div className="d-flex gap-2">
              <div
                onClick={bookmarkedPostHandler}
              >
                {isBookmark ? (
                  <span style={{ cursor: "pointer" }}>
                    <i className="bi bi-bookmark-fill bookmark"></i>
                  </span>
                ) : (
                  <span style={{ cursor: "pointer" }}>
                    <i className="bi bi-bookmark bookmark"></i>
                  </span>
                )}
              </div>
            </div>
          </div>
          {showCommentInput && (
            <div className="my-3">
              <div className="d-flex justify-content-between align-items-center">
                <Link
                  to={`/profile/${post?.userId?._id}`}
                  className="text-decoration-none"
                >
                  <img
                    src={user?.profilePicture || " "}
                    alt=""
                    className="tweetProfileImg img-fluid"
                  />
                </Link>
                <textarea
                  value={commentText}
                  placeholder="Post your reply"
                  onChange={(e) => setCommentText(e.target.value)}
                  className="form-control border-0 "
                  rows={3}
                ></textarea>
              </div>
              <button
                type="submit"
                className={buttonClass}
                onClick={commentPostHandler}
                disabled={!commentText.trim()}
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Tweets;
