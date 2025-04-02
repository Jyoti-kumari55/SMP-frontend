import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchSuggestedUsersSuccess,
  followUserSuccess,
  unfollowUserSuccess,
} from "../features/userSlice";

const AllUsers = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { friends, suggestedUsers, isLoading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [usercount, setUsercount] = useState(5);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        // Fetch suggested users
        const suggestedRes = await axios.get(
           `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/suggestedUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const suggestedUsersData = suggestedRes.data;
        // console.log("Suggested User: ", suggestedUsersData);
        //setSuggestedUsers(suggestedUsersData);
        dispatch(fetchSuggestedUsersSuccess(suggestedUsersData));
        // navigate(0);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, [dispatch, token]);

  const followUserHandler = async (followUserId) => {
    try {
      const response = await axios.post(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/follow/${followUserId}`,
        { userId: user?._id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      // console.log(response.data.message);
      dispatch(followUserSuccess({ followUserId }));
      navigate(0);

    } catch (error) {
      console.log(error.message);
      setError("Failed to unfollow the user.");
    }
  }

  const unfollowUserHandler = async (followUserId) => {
    try {
      const response = await axios.post(
     `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/users/unfollow/${followUserId}`,
        { userId: user?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,

        }
      );
      // console.log(response.data.message);
      dispatch(unfollowUserSuccess({ unfollowUserId: followUserId }));
      navigate(0);
    } catch (error) {
      console.log(error.message);
      setError("Failed to follow the user.");
    }
  }

  const showMoreUserHandler = () => {
    setUsercount((prev) => prev + 5);
  };

  const getSuggestedUsers = [
    // ...(Array.isArray(friends.Friends) ? friends.Friends : []),
    ...(Array.isArray(suggestedUsers.Users) ? suggestedUsers.Users : []),
  ];


  const filteredUsers = getSuggestedUsers.filter((user) =>
    `${user.username}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSuggestedUsers = filteredUsers.filter((people) => {
    if (!user?.followings.includes(people?._id) && people?._id !== user?._id) {
      const isFollower = user?.followers.includes(people?._id);
      const isNewUser = people?.followers.length === 0; // New user with no followers

      return (
        (isFollower && !user?.followings.includes(people?._id)) || isNewUser
      );
    }
    return false;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      {error && <p>Error occured while fetching...</p>}
      {isLoading && <p>Loading...</p>}

      <form className="d-flex" role="search">
        <div className="search-bar">
          <span>
            <i class="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="search-input form-control"
            placeholder="Search posts, person or anything..."
            aria-label="Search"
            aria-describedby="search-addon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
  

      <div className="d-flex align-items-center justify-content-between mt-4 ">
        <span className="fw-bold fs-100">
          {" "}
          <strong>Who to follow?</strong>
        </span>{" "}
        <span
          onClick={showMoreUserHandler}
          style={{ cursor: "pointer", color: "var(--primary-color)" }}
        >
          <strong className="text-danger">show more</strong>
        </span>
      </div>
      <hr />
      {filteredSuggestedUsers.slice(0, usercount).map((people) => (
        <div
          key={people?._id}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <Link
            to={`/profile/${people?._id}`}
            className="d-flex align-items-center"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={people?.profilePicture || defaultProfileImg}
              alt="user"
              className="border rounded-circle"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="ms-2">
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                {people?.name}
              </span>
            </div>
          </Link>

          <button
            onClick={() => user?.followings?.includes(people?._id) 
                ? unfollowUserHandler(people?._id) 
                : followUserHandler(people?._id)}
            className="btn btn-outline-danger"
          >
            {user?.followings.includes(people?._id)
              ? "Following"
              : user?.followers.includes(people?._id)
              ? "Follow Back"
              : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
