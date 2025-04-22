import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowHandler } from "../actions/userActions";
import { Link } from "react-router-dom";
import { fetchSuggestedUsersSuccess } from "../features/userSlice";
import axios from "axios";

const SuggestedUsers = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { suggestedUsers, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [usercount, setUsercount] = useState(5);
  const [search, setSearch] = useState("");

  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
        dispatch(fetchSuggestedUsersSuccess(suggestedUsersData));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, [dispatch, token]);

  const showMoreUserHandler = () => {
    setUsercount((prev) => prev + 5);
  };

  const getSuggestedUsers = [
    ...(Array.isArray(suggestedUsers.Users) ? suggestedUsers.Users : []),
  ];

  const filteredUsers = getSuggestedUsers.filter((user) =>
    `${user.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSuggestedUsers = filteredUsers.filter((people) => {
    if (people?._id !== user?._id) {
      // Check if the logged-in user is followed by the suggested user
      const isFollowingBack = user?.followers.includes(people?._id);
      const isNewUser = people?.followers.length === 0;
      const isNotFollowing = !user?.followings.includes(people?._id);
      return (isNotFollowing && !isFollowingBack) || isNewUser;
    }
    return false;
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <form className="d-flex" role="search">
        <div className="search-bar">
          <span>
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="search-input form-control"
            placeholder="Search posts, person or anything..."
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      <div className="d-flex align-items-center justify-content-between mt-4">
        <span className="fw-bold fs-100">
          <strong>Who to follow?</strong>
        </span>
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
            onClick={() =>
              toggleFollowHandler(people?._id, user, token, dispatch)
            }
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

export default SuggestedUsers;
