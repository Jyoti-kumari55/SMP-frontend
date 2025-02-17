import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  error: null,
  bookmarks: [],
  friends: [],
  suggestedUsers: [],
  followers: [],
  followings: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserProfileSuccess: (state, action) => {
      //console.log("State: ", state);
      state.isLoading = false;
      state.profile = action.payload;
      // console.log("User Pr: ", action.payload, "Statep: ", state.profile);
    },
    fetchUserProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // update user profile

    updateUserProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = { ...state.profile, ...action.payload };
    },

    //Bookmarked posts

    bookmarkPostSuccess: (state, action) => {
      const bookmarkedUser = JSON.parse(localStorage.getItem("user"));
      const postExists = bookmarkedUser.bookmarks.some(
        (post) => post === action.payload._id
      );
      // console.log("....", postExists );

      bookmarkedUser.bookmarks = postExists
        ? bookmarkedUser.bookmarks.filter((post) => post !== action.payload._id)
        : [...bookmarkedUser.bookmarks, action.payload._id];
      // console.log("user st: ", bookmarkedUser.bookmarks);
      localStorage.setItem("user", JSON.stringify(bookmarkedUser));

      //console.log("json2", JSON.parse(localStorage.getItem("user")));
      //   Set isLoading to false as the action is complete
      state.isLoading = false;
    },

    // bookmarkPostSuccess: (state, action) => {
    //   console.log("ac: ", action, "uuuu: ", state.profile)
    //   console.log("json", JSON.parse(localStorage.getItem('user')) )
    //   const postExists = state.profile.bookmarks.some(
    //     (post) => post._id === action.payload
    //   );
    //   console.log("....", postExists );

    //   Update the bookmarkedPosts list based on whether the post is already bookmarked

    //    state.profile.bookmarks = postExists ? state.profile.bookmarks.filter(
    //         (post) => post._id !== action.payload._id
    //       )
    //      : [...state.profile.bookmarks, action.payload];

    //   Set isLoading to false as the action is complete
    //   state.isLoading = false;
    // },

    //fetch all Bookmarked posts
    fetchBookmarkedPostsSuccess: (state, action) => {
      state.isLoading = false;
      state.bookmarks = action.payload;
    },

    // remove a bookmarked post
    removeBookmarkedPostSuccess: (state, action) => {
      if (Array.isArray(state.bookmarks)) {
        state.bookmarks = state.bookmarks.filter(
          (post) => post !== action.payload._id
        );
        console.log("Remove: ", state.bookmarks);
      }
    },

    //delete a user

    deleteUserSuccess: (state) => {
      state.isLoading = false;
      state.profile = null;
    },

    // Get All Users

    fetchAllUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    },

    // Get All User friends

    fetchFriendsSuccess: (state, action) => {
      state.isLoading = false;
      state.friends = action.payload;
      // console.log("friends state: ", state.friends);
    },

    // Get Suggested Users

    fetchSuggestedUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.suggestedUsers = action.payload;
      // console.log("suggestedusers state: ", state.suggestedUsers);
    },

    // Follow User

    followUserSuccess: (state, action) => {
      state.isLoading = false;
      const { followUserId } = action.payload;
      state.profile = JSON.parse(localStorage.getItem("user"));
      // console.log("st11", state.profile, );
      // console.log("spf12",  state.profile.followings)
      if (!state.profile.followings.includes(followUserId)) {
        state.profile.followings.push(followUserId);
      }
      //console.log("last11",  state.profile.followings)

      localStorage.setItem("user", JSON.stringify(state.profile));
    },

    toggleFollowSuccess: (state, action) => {
      state.isLoading = false;
      const followUserId = action.payload;
      console.log("sugg: ", action.payload);
      state.profile = JSON.parse(localStorage.getItem("user"));
      if (state.profile.followings.includes(followUserId)) {
        // Unfollow
        state.profile.followings = state.profile.followings.filter(
          (id) => id !== followUserId
        );
      } else {
        // Follow
        // state.profile.followings = [...state.profile.followings, followUserId];
        state.profile.followings.push(followUserId);
      }
      localStorage.setItem("user", JSON.stringify(state.profile));
    },
    // Unfollow User

    unfollowUserSuccess: (state, action) => {
      state.isLoading = false;
      const { unfollowUserId } = action.payload;
      state.profile = JSON.parse(localStorage.getItem("user"));

      // console.log("st", state.profile, );
      // console.log("spf",  state.profile.followings)
      state.profile.followings = state.profile.followings.filter(
        (id) => id !== unfollowUserId
      );
      // console.log("last",  state.profile.followings)

      localStorage.setItem("user", JSON.stringify(state.profile));
    },

    // toggleFollowSuccess: (state, action) => {
    //   state.isLoading = false;
    //   const { followUserId, actionType } = action.payload;
    //   if(actionType === "follow") {
    //     if(!state.profile.followings.includes(followUserId)) {
    //       state.profile.followings.push(followUserId);
    //     }
    //   } else if(actionType === "unfollow") {
    //     state.profile.followings = state.profile.followings.filter(
    //       (id) => id !== followUserId
    //     )
    //   }
    // }

    fetchUserListSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.followers = action.payload.followers;
      state.followings = action.payload.followings;
    },
  },
});

export const {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  updateUserProfileSuccess,
  bookmarkPostSuccess,
  fetchBookmarkedPostsSuccess,
  removeBookmarkedPostSuccess,
  deleteUserSuccess,
  fetchAllUsersSuccess,
  fetchFriendsSuccess,
  fetchSuggestedUsersSuccess,
  followUserSuccess,
  unfollowUserSuccess,
  toggleFollowSuccess,
  fetchUserListSuccess,
} = userSlice.actions;

export default userSlice.reducer;

// Failed to toggle follow status.
//     at toggleFollowHandler (http://localhost:3000/static/js/bundle.js:293:11)
//     at async handleFollow (http://localhost:3000/static/js/bundle.js:3365:5)
