import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserListSuccess } from "../features/userSlice";
import { Link, useParams } from "react-router-dom";
import { toggleFollowHandler } from "../actions/userActions";

const FollowingsUserList = () => {
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const { followings, isLoading, error } = useSelector((state) => state.user);
  const { user, token } = useSelector((state) => state.auth);
  const [followingUsers, setFollowingUsers] = useState(followings);
  const [hoveredUserId, setHoveredUserId] = useState(null);

  const { userId } = useParams();

  const dispatch = useDispatch();
  const currentUserId = user?._id;

  useEffect(() => {
    const fetchUserList = async () => {
      const idToFetch = userId || currentUserId;

      try {
        const response = await axios.get(
           `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/userList/${idToFetch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("UserList", response.data);
        // const validFollowings = response.data.followings.filter((person) => person !== null || person._id !== undefined);
        // const validFollowers = response.data.followers.filter((person) => person !== null || person._id !== undefined);


        dispatch(fetchUserListSuccess(response.data));
        // dispatch(fetchUserListSuccess({...response.data, followers: validFollowers, followings: validFollowings}));

      } catch (error) {
        console.error(error);
      }
    };
    fetchUserList();
  }, [token, user._id, dispatch, userId, currentUserId]);

  const handleFollow = async (followUserId) => {
    await toggleFollowHandler(followUserId, user, token, dispatch);

    if (followingUsers.some((following) => following._id === followUserId)) {
      setFollowingUsers(
        followingUsers.filter((people) => people?._id !== followUserId)
      );
    } else {
      setFollowingUsers([...followingUsers, { _id: followUserId }]);
    }
  };

  return (
    <div className="mt-4 ">
      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>An error occurred while fetching user list.</p>}
      </div>
      {followings?.length > 0 &&
        followings?.map((people) => (
          <div key={people?._id} className="d-flex justify-content-between">
            <Link
              to={`/profile/${people?._id}`}
              className="d-flex gap-2 text-decoration-none"
            >
              <img
                src={people?.profilePicture || defaultProfileImg}
                alt=""
                className="tweetProfileImg img-fluid"
              />
              <div className="d-flex flex-column gap-2">
                <h6 className="fs-5 text-black mt-1">{people?.name}</h6>
                <p className="text-secondary" style={{ marginTop: "-15px" }}>
                  @{people?.username}
                </p>
              </div>
            </Link>
            <div className="mt-1">
              <button
                className="px-4 rounded-4 btn btn-outline-primary position-relative"
                onClick={() => handleFollow(people?._id)}
                onMouseEnter={() => setHoveredUserId(people?._id)}
                onMouseLeave={() => setHoveredUserId(null)}
                // style={{ position: "relative" }}
              >
              
                  {followingUsers?.some(
                  (following) => following?._id === people?._id
                )
                  ? hoveredUserId === people?._id
                    ? "Unfollow"
                    : "Following"
                  : hoveredUserId === people?._id
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FollowingsUserList;
