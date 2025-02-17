import React, { useEffect } from 'react';
import { useSelector } from "react-redux"

const OtherUsers = () => {
    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        
    })

  return (
    <div>
      
    </div>
  )
}

export default OtherUsers
