// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserListSuccess } from "../features/userSlice";
// import { Link, useParams } from "react-router-dom";
// import { followUserHandler, unfollowUserHandler } from "../actions/userActions";

// const FollowersUserList = () => {
//   const defaultProfileImg =
//     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

//   const { followings, followers, isLoading, error } = useSelector((state) => state.user);
//   const { user, token } = useSelector((state) => state.auth);
//   const [hoveredUserId, setHoveredUserId] = useState(null);
//   const { userId } = useParams();

//   const dispatch = useDispatch();
//   const currentUserId = user?._id;
//   //const otherUserId = user?.followers

//   useEffect(() => {
//     const fetchUserList = async () => {
//       const idToFetch = userId || currentUserId;

//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/users/userList/${idToFetch}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true,
//           }
//         );
//         console.log("UserList", response.data);
//         dispatch(fetchUserListSuccess(response.data));
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchUserList();
//   }, [token, userId, dispatch, currentUserId]);

//   const handleFollow = async (followUserId) => {
//     console.log("followers", followers)
//     if (followings?.some((follower) => follower._id === followUserId)) {
//       // Unfollow if already following
//       console.log("===unfollowUserHandler==")
//       await unfollowUserHandler(followUserId, user, token, dispatch);
//     } else {
//       // Follow back
//       await followUserHandler(followUserId, user, token, dispatch);
//     }
//   };

//   const isMutualFollow = (people) => {
//    // console.log("kkkkk",  people?.followers?.includes(user?._id), user?.followers?.includes(people?._id))
//     return (

//       people?.followers?.includes(user?._id) && user?.followers?.includes(people?._id)
//     );
//   };

//   return (
//     <div className="mt-4 ">
//       <div>
//         {isLoading && <p>Loading...</p>}
//         {error && <p>An error occurred while fetching user list.</p>}
//       </div>
// {/* {console.log(followers.length, followings.length)} */}
//       {followers?.length > 0 &&
//         followers?.map((people) => (
//           <>
//             <div key={people?._id} className="d-flex justify-content-between">
//               <Link
//                 to={`/profile/${people?._id}`}
//                 className="d-flex gap-2 text-decoration-none"
//               >
//                 <img
//                   src={people?.profilePicture || defaultProfileImg}
//                   alt="userImg"
//                   className="tweetProfileImg img-fluid"
//                 />
//                 <div className="d-flex flex-column gap-2">
//                   <h6 className="fs-5 text-black mt-1">{people?.name}</h6>
//                   <p className="text-secondary" style={{ marginTop: "-15px" }}>
//                     @{people?.username}
//                   </p>
//                 </div>
//               </Link>
//               {/* <div className="">
//                 {people?.followers?.includes(user?._id) ? (
//                   <button
//                     className="px-4 rounded-4 btn btn-outline-primary"
//                     onClick={() => handleFollow(people?._id)}
//                   >
//                     Following
//                   </button>
//                 ) : (
//                   <button
//                     className="px-4 rounded-4 btn btn-outline-primary "
//                     onClick={() => handleFollow(people?._id)}
//                   >
//                     Follow
//                   </button>
//                 )}
//               </div> */}

//               <div className="">
//               {isMutualFollow(people) ? (
//                 <button
//                   className="px-4 rounded-4 btn btn-outline-primary"
//                   onClick={() => handleFollow(people?._id)}
//                   onMouseEnter={() => setHoveredUserId(people?._id)}
//                   onMouseLeave={() => setHoveredUserId(null)}
//                 >
//                   {hoveredUserId === people?._id ? "Unfollow" : "Following"}
//                 </button>
//               ) : (
//                 <button
//                   className="px-4 rounded-4 btn btn-outline-primary"
//                   onClick={() => handleFollow(people?._id)}
//                   // onMouseEnter={() => setHoveredUserId(people?._id)}
//                   // onMouseLeave={() => setHoveredUserId(null)}
//                 >
//                   {/* {hoveredUserId === people?._id ? "Unfollow" : "Follow"} */}
//                   {/* {hoveredUserId === people?._id ? "Following" : "Follow"} */}
//                   follow
//                 </button>
//               )}
//             </div>
//             </div>
//           </>
//         ))}
//     </div>
//   );
// };

// export default FollowersUserList;


import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserListSuccess } from "../features/userSlice";
import { Link, useParams } from "react-router-dom";
import { toggleFollowHandler } from "../actions/userActions";  // Updated import for toggleFollowHandler

const FollowersUserList = () => {
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const { followers, isLoading, error } = useSelector(
    (state) => state.user
  );
  const { user, token } = useSelector((state) => state.auth);
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
        dispatch(fetchUserListSuccess(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserList();
  }, [token, userId, dispatch, currentUserId]);

  const handleFollow = async (followUserId) => {
    // Call the toggleFollowHandler to toggle follow/unfollow
    await toggleFollowHandler(followUserId, user, token, dispatch);
  };

  const isMutualFollow = (people) => {
    return (
      people?.followers?.includes(user?._id) && user?.followers?.includes(people?._id)
    );
  };

  return (
    <div className="mt-4 ">
      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>An error occurred while fetching user list.</p>}
      </div>

      {followers?.length > 0 &&
        followers?.map((people) => (
          <div key={people?._id} className="d-flex justify-content-between">
            <Link to={`/profile/${people?._id}`} className="d-flex gap-2 text-decoration-none">
              <img
                src={people?.profilePicture || defaultProfileImg}
                alt="userImg"
                className="tweetProfileImg img-fluid"
              />
              <div className="d-flex flex-column gap-2">
                <h6 className="fs-5 text-black mt-1">{people?.name}</h6>
                <p className="text-secondary" style={{ marginTop: "-15px" }}>
                  @{people?.username}
                </p>
              </div>
            </Link>

            <div className="">
              {isMutualFollow(people) ? (
                <button
                  className="px-4 rounded-4 btn btn-outline-primary"
                  onClick={() => handleFollow(people?._id)}
                  onMouseEnter={() => setHoveredUserId(people?._id)}
                  onMouseLeave={() => setHoveredUserId(null)}
                >
                  {hoveredUserId === people?._id ? "Unfollow" : "Following"}
                </button>
              ) : (
                <button
                  className="px-4 rounded-4 btn btn-outline-primary"
                  onClick={() => handleFollow(people?._id)}
                  onMouseEnter={() => setHoveredUserId(people?._id)}
                  onMouseLeave={() => setHoveredUserId(null)}
                >
                  {hoveredUserId === people?._id ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default FollowersUserList;
