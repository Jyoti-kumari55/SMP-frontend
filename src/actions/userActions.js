// src/actions/userActions.js

import axios from "axios";
import {
  followUserSuccess,
  unfollowUserSuccess,
  toggleFollowSuccess,
  updateUserProfileSuccess,
} from "../features/userSlice";

// This function handles the toggle follow/unfollow logic
export const toggleFollowHandler = async (
  followUserId,
  user,
  token,
  dispatch
) => {
  try {
    const response = await axios.put(
       `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/toggleFollow/${followUserId}`,
      { userId: user?._id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("follow user: ", response.data); // log success response
    window.location.reload();

    // Dispatch the success action to update the local state
    dispatch(toggleFollowSuccess(followUserId));
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to toggle follow status.");
  }
};

export const updateUserHandler = async (userId, userData, token, dispatch) => {
  try {
    const response = await axios.put(
       `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("User Updated Successfully", response.data);
    dispatch(updateUserProfileSuccess(response.data.user));

    window.location.reload();
  } catch (error) {
    console.log("Error updating user:", error.message);
    throw error;
  }
};





// export const followUserHandler = async (
//   followUserId,
//   user,
//   token,
//   dispatch
// ) => {
//   try {
//     const response = await axios.post(
//       `http://localhost:8080/api/users/follow/${followUserId}`,
//       { userId: user?._id },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       }
//     );
//     console.log("Follow User", response.data);
//     window.location.reload();
//     dispatch(followUserSuccess(followUserId));
//   } catch (error) {
//     console.log(error.message);
//     // throw new Error("Failed to follow the user.");
//   }
// };

// export const unfollowUserHandler = async (
//   followUserId,
//   user,
//   token,
//   dispatch
// ) => {
//   try {
//     console.log("==followUserId==", followUserId, user?._id);
//     const response = await axios.post(
//       `http://localhost:8080/api/users/unfollow/${followUserId}`,
//       { userId: user?._id },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       }
//     );
//     console.log("UnFollow User", response.data);
//     window.location.reload();
//     dispatch(unfollowUserSuccess({ unfollowUserId: followUserId }));
//   } catch (error) {
//     console.log(error.message);
//     throw new Error("Failed to unfollow the user.");
//   }
// };