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
      state.isLoading = false;
      state.profile = action.payload;
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

      bookmarkedUser.bookmarks = postExists
        ? bookmarkedUser.bookmarks.filter((post) => post !== action.payload._id)
        : [...bookmarkedUser.bookmarks, action.payload._id];
      localStorage.setItem("user", JSON.stringify(bookmarkedUser));

      state.isLoading = false;
    },

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
    },

    // Get Suggested Users
    fetchSuggestedUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.suggestedUsers = action.payload;
    },

    // Follow User
    followUserSuccess: (state, action) => {
      state.isLoading = false;
      const { followUserId } = action.payload;
      state.profile = JSON.parse(localStorage.getItem("user"));

      if (!state.profile.followings.includes(followUserId)) {
        state.profile.followings.push(followUserId);
      }

      localStorage.setItem("user", JSON.stringify(state.profile));
    },

    //toggle follow and unfollow
    toggleFollowSuccess: (state, action) => {
      state.isLoading = false;
      const followUserId = action.payload;
      state.profile = JSON.parse(localStorage.getItem("user"));
      if (state.profile.followings.includes(followUserId)) {
        // Unfollow
        state.profile.followings = state.profile.followings.filter(
          (id) => id !== followUserId
        );
      } else {
        // Follow
        state.profile.followings.push(followUserId);
      }
      localStorage.setItem("user", JSON.stringify(state.profile));
    },

    // Unfollow User
    unfollowUserSuccess: (state, action) => {
      state.isLoading = false;
      const { unfollowUserId } = action.payload;
      state.profile = JSON.parse(localStorage.getItem("user"));

      state.profile.followings = state.profile.followings.filter(
        (id) => id !== unfollowUserId
      );

      localStorage.setItem("user", JSON.stringify(state.profile));
    },

    //User lists
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
