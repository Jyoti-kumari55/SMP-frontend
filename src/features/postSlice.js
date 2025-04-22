import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    fetchPostStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    },
    fetchPostsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    likePostStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    likePostSuccess: (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    likePostFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchPostByIdStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.currentPost = action.payload;
    },
    fetchPostByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createPostSuccess: (state, action) => {
      state.isLoading = false;
      state.posts.push(action.payload.post);
    },
    createPostFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCommentSuccess: (state, action) => {
      state.isLoading = false;
      const updatedPost = state.posts.map((post) => 
        post._id === action.payload.post._id  
          ?  {...post, comments: [...post.comments, action.payload.comments]}
          : post
       );
      state.posts = updatedPost;
    },

    updatePostStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updatePostSuccess: (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    updatePostFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deletePostStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deletePostSuccess: (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.filter((post) => post._id !== action.payload); 
    },
    deletePostFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  likePostStart,
  likePostSuccess,
  likePostFailure,
  fetchPostByIdStart,
  fetchPostByIdSuccess,
  fetchPostByIdFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  createCommentSuccess,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure
} = postSlice.actions;

export default postSlice.reducer;
