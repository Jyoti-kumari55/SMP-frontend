import React from 'react'
import { useSelector } from 'react-redux';
import SuggestedUsers from './SuggestedUsers';

const RightSideBar = ({ onFollowChange }) => {

  const { isLoading, error} = useSelector((state) => state.auth);
  
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
      <SuggestedUsers/>
    </div>
  )
}

export default RightSideBar
