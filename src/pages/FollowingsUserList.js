// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserListSuccess } from '../features/userSlice';
// import { Link, useParams } from 'react-router-dom';
// import { followUserHandler, unfollowUserHandler } from '../actions/userActions';

// const FollowingsUserList = () => {
//   const defaultProfileImg =
//   "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

//   const {  followings, isLoading, error } = useSelector(
//     (state) => state.user
//   );
//   const { user, token } = useSelector((state) => state.auth);
//   const [followingUsers, setFollowingUsers] = useState(followings);
//   const [hoveredUserId, setHoveredUserId] = useState(null);

//  const { userId } = useParams();

//   const dispatch = useDispatch();
//   const currentUserId = user?._id;

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
//   }, [token, user?._id, dispatch]);

//   const handleFollow = async (followUserId) => {
//     if (followingUsers.some((following) => following._id === followUserId)) {
//       // Unfollow if already following
//       await unfollowUserHandler(followUserId, user, token, dispatch);
//       setFollowingUsers(followingUsers.filter((people) => people?._id !== followUserId));
//     } else {
//       // Follow the user
//       await followUserHandler(followUserId, user, token, dispatch);
//       setFollowingUsers([...followingUsers, { _id: followUserId }]);
//     }
//   };

//   return (
//     <div className="mt-4 ">
//     <div>
//     {isLoading && <p>Loading...</p>}
//     {error && <p>An error occurred while fetching user list.</p>}
//     </div>
//     {followings?.length > 0 && followings?.map((people) => (
//       <>
//       <div key={people?._id}
//         className="d-flex justify-content-between">
//           <Link
//             to={`/profile/$`}
//             className="d-flex gap-2 text-decoration-none"
//           >
//             <img
//               src={people?.profilePicture || defaultProfileImg}
//               alt=""
//               className="tweetProfileImg img-fluid"
//             />
//             <div className="d-flex flex-column gap-2">
//               <h6 className="fs-5 text-black mt-1">{people?.name}</h6>
//               <p className="text-secondary" style={{marginTop: "-15px"}}>
//                 @{people?.username}
//               </p>
//             </div>
//           </Link>
//           {/* <div className="mt-1">
//               {followings?.some((following) => following._id === people._id) ? (
//                 <button
//                   className="px-4 rounded-4 btn btn-outline-primary"
//                   onClick={() => handleFollow(people?._id)}
//                 >
//                   Unfollow
//                 </button>
//               ) : (
//                 <button
//                   className="px-4 rounded-4 btn btn-outline-primary"
//                   onClick={() => handleFollow(people?._id)}
//                 >
//                   Follow
//                 </button>
//               )}
//             </div> */}
//             <div className="mt-1">
//               <button
//                 className="px-4 rounded-4 btn btn-outline-primary"
//                 onClick={() => handleFollow(people?._id)}
//                 nMouseEnter={() => setHoveredUserId(people?._id)}  // Hover event to show "Unfollow"
//                 onMouseLeave={() => setHoveredUserId(null)}  // Reset hover when leaving
//                 style={{ position: 'relative' }}
//               >
//                 {followingUsers?.some((following) => following?._id === people?._id)
//                   ? 'Following'
//                   : hoveredUserId === people?._id
//                   ? 'Unfollow'  // Show "Unfollow" if hovered
//                   : 'Follow'}
//                   {hoveredUserId === people?._id && (
//                   <span
//                     className="unfollow-text"
//                     style={{
//                       position: 'absolute',
//                       bottom: '-25px',
//                       left: '50%',
//                       transform: 'translateX(-50%)',
//                       fontSize: '12px',
//                       opacity: hoveredUserId === people?._id ? 1 : 0,
//                       transition: 'opacity 0.3s ease',
//                     }}
//                   >
//                     Unfollow
//                   </span>
//                 )}
//               </button>
//             </div>
//         </div>

//       </>

//     ))}

//     </div>
//   );
// };

// export default FollowingsUserList

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
        dispatch(fetchUserListSuccess(response.data));
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
                {/* {followingUsers?.some(
                  (following) => following?._id === people?._id
                )
                  ? "Following"
                  : hoveredUserId === people?._id
                  ? "Unfollow"
                  : "Follow"} */}

                  {followingUsers?.some(
                  (following) => following?._id === people?._id
                )
                  ? hoveredUserId === people?._id
                    ? "Unfollow"
                    : "Following"
                  : hoveredUserId === people?._id
                  ? "Unfollow"
                  : "Follow"}

                {/* {hoveredUserId === people?._id && (
                  <span
                    className="unfollow-text position-absolute"
                    style={{
                      // position: "absolute",
                      bottom: "-25px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      opacity: hoveredUserId === people?._id ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    Unfollow
                  </span>
                )} */}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FollowingsUserList;
