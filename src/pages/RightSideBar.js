import React, { useEffect, useState } from 'react'
import AllUsers from './AllUsers';
import { useSelector } from 'react-redux';
import SuggestedUsers from './SuggestedUsers';

const RightSideBar = ({ onFollowChange }) => {

  // const [friends, setFriends] = useState([]);
  const { user, token , isLoading, error} = useSelector((state) => state.auth);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(
  //         "http://localhost:8080/api/users/friends",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       setFriends(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchFriends();
  // }, [token, user?.followings]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='my-5 ms-4'>    
      {/* <AllUsers onFollowChange={onFollowChange} /> */}
      {/* <AllUsers /> */}
      <SuggestedUsers/>
    </div>
  )
}

export default RightSideBar
