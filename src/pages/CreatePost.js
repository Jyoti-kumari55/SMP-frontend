import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostStart, createPostSuccess } from "../features/postSlice";

const CreatePost = () => {
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const [desc, setDesc] = useState(" ");
  const { token, user } = useSelector((state) => state.auth);
  const [viewImage, setViewImage] = useState(null);
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const dispatch = useDispatch();

  const emojiList = [
    "😀",
    "😃",
    "🤩",
    "😘",
    "😝",
    "😆",
    "😅",
    "😉",
    "😊",
    "😇",
    "😍",
    "😋",
    "🤔",
    "👋",
    "👍",
    "👎",
    "🙏",
    "🧒",
    "🐶",
    "🌞",
    "🌹", "🫠", "😡", 
    "❤️",
    "❣️",
    "💞",
    "🩵",
  ];

  const imageViewHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const filetype = file.type;
      if (
        filetype === "image/jpeg" ||
        filetype === "image/jpg" ||
        filetype === "image/png" ||
        filetype === "image/gif"
      ) {
        setImage(file);
        setViewImage(URL.createObjectURL(file));
      } else if (filetype === "application/pdf") {
        setImage(file);
        setViewImage(URL.createObjectURL(file));
      } else {
        alert("Please select valid image, GIF or PDF file.");
      }
    }
  };

  const handleEmojiClick = (emojiClass) => {
    setDesc((prevDesc) => prevDesc + emojiClass);
    setShowEmoji(false);
  };

  const createPost = async () => {
    if (!desc.trim() && !image) {
      alert("Please write something before posting!!");
      return;
    }
    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await axios.post(
          `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (uploadRes.status === 200) {
          imageUrl = uploadRes.data.imageUrl;
        } else {
          console.error("Image upload failed", uploadRes.data.error);
          return;
        }
      }

      const response = await axios.post(
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/posts/create`,
        {
          desc,
          userId: user?._id,
          img: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      response.data.post.userId = user;

      dispatch(createPostSuccess(response.data));
      dispatch(createPostStart());
      setDesc("");
      setImage(null);
      setViewImage(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const isDescNotEmpty = desc.trim() !== "";
  const buttonClass = isDescNotEmpty
    ? "btn ms-auto mx-3 px-5 rounded-2 createPostBtn text-white bg-danger"
    : "btn ms-auto mx-3 px-5 rounded-2 createPostBtn text-muted btn btn-secondary";

  return (
    <div>
      <div
        style={{ width: "100%", backgroundColor: "white" }}
        className="pb-4 shadow-lg rounded-3"
      >
        <div className="m-3 pt-4 d-flex">
          <img
            src={user?.profilePicture || defaultProfileImg}
            alt="user-img"
            className="img-fluid tweetProfileImg"
          />
          {/* <input
            type="text"
            className="border-0 ms-4 form-control shadow"
            placeholder="Write something interesting..."
            style={{ paddingBottom: "5rem", backgroundColor: "#f0f0f0" }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          /> */}

          <textarea
            className="border-0 ms-4 form-control shadow"
            placeholder="Write something interesting..."
            style={{
              paddingBottom: "5rem",
              backgroundColor: "#f0f0f0",
              resize: "none",
            }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows="2"
            required
          />
        </div>

        <div className="d-flex" style={{ marginLeft: "4.4rem", gap: "1rem" }}>
          <label
            htmlFor="photoUpload"
            className="bi bi-card-image"
            style={{ cursor: "pointer" }}
          ></label>
          <input
            type="file"
            id="photoUpload"
            style={{ display: "none" }}
            onChange={imageViewHandler}
          />
          <label
            htmlFor="giftUpload"
            className="bi bi-filetype-gif"
            title="Max GIF size: 5MB"
            style={{ cursor: "pointer" }}
          ></label>
          <input
            type="file"
            id="giftUpload"
            style={{ display: "none" }}
            onChange={imageViewHandler}
          />
          <label
            htmlFor="emoji"
            className="bi bi-emoji-smile"
            style={{ cursor: "pointer" }}
            onClick={() => setShowEmoji(!showEmoji)}
          ></label>
        </div>

        {showEmoji && (
          <div
            className="emoji-picker-box mt-3"
            style={{
              marginLeft: "4.4rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              maxWidth: "400px",
            }}
          >
            {emojiList.map((emoji, index) => (
              <span
                key={index}
                // className={`bi ${emoji} emoji-icon`}
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => handleEmojiClick(emoji)} 
              > {emoji} </span>
            ))}
          </div>
        )}
        {viewImage && (
          <div className="mt-3">
            <img
              src={viewImage}
              alt="preview"
              className="img-fluid px-4"
              style={{ width: "400px", maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}
        <div
          className="d-flex mt-4"
          style={{ marginLeft: "4.4rem", gap: "1rem" }}
        >
          <button
            type="submit"
            style={{
              fontSize: "1.2rem",
              boxShadow: "5px 5px 2px 5px rgba(178, 178, 239, 0.2)",
            }}
            // className={`shadow-lg ${buttonClass}`}
            className={buttonClass}
            onClick={createPost}
            disabled={!desc.trim() && !image}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
