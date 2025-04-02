import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserHandler } from "../actions/userActions";
import axios from "axios";

const UserEditForm = ({ userDetail }) => {

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [coverImg, setCoverImg] = useState(userDetail.coverPicture || "");
  const [profileImg, setProfileImg] = useState(userDetail.profilePicture || "");
  const [name, setName] = useState(userDetail.name || "");
  const [username, setUsername] = useState(userDetail.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bio, setBio] = useState(userDetail.bio || "");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    console.log("Form-data: ", formData);

    try {
      const response = await axios.post(
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
      // console.log("----------", response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const coverImageChangeHandler = (e) => {
    setCoverImageFile(e.target.files[0]);
  };

  const profileImageChangeHandler = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if(newPassword && newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    let updatedCoverImg = coverImg;
    let updatedProfileImg = profileImg;

    if (coverImageFile) {
      updatedCoverImg = await uploadImage(coverImageFile);
      setCoverImg(updatedCoverImg);
    }

    if (profileImageFile) {
      updatedProfileImg = await uploadImage(profileImageFile);
      setProfileImg(updatedProfileImg);
    }

    const updatedUser = {
      coverPicture: updatedCoverImg,
      profilePicture: updatedProfileImg,
      name,
      username,
      bio,
      currentPassword,
      newPassword,
    };
    // console.log("upppp: ", updatedUser);

    // dispatch(updateUserProfileSuccess(updatedUser));
    updateUserHandler(userDetail?._id, updatedUser, token, dispatch);
  };

  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <label htmlFor="coverImg" className="form-label">
          <b>Cover Image</b>
        </label>
        <input
          type="file"
          className="form-control mb-4"
          onChange={coverImageChangeHandler}
        />
        {coverImg && (
          <img src={coverImg} alt="Cover" width="100" height="100" />
        )}
        <br />
        <label htmlFor="profileImg" className="form-label mt-2">
          <b>Profile Image</b>
        </label>
        <input
          type="file"
          className="form-control mb-4"
          onChange={profileImageChangeHandler}
        />
        {profileImg && (
          <img src={profileImg} alt="Profile" width="100" height="100" />
        )}
        <br />
        <div className="d-flex gap-3 mt-3">
          <div>
            <label htmlFor="name" className="form-label">
              <b>Name</b>
            </label>

            <input
              type="text"
              className="form-control mb-4"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="username" className="form-label">
              <b>Username</b>
            </label>
            <input
              type="text"
              className="form-control mb-4"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex gap-3 ">
          <div>
            <label htmlFor="currentPassword" className="form-label">
              <b>Old Password</b>
            </label>

            <input
              type="password"
              className="form-control mb-4"
              placeholder="old password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="username" className="form-label">
              <b>New Password</b>
            </label>
            <input
              type="password"
              className="form-control mb-4"
              placeholder="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="bio">
          {" "}
          <b>Bio</b>
        </label>
        <textarea
          rows={5}
          cols={50}
          className="form-control mb-4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>

        <button type="submit" className="btn btn-primary float-end">
          Save
        </button>
      </form>
    </div>
  );
};

export default UserEditForm;
