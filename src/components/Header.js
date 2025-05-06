import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='bg-white'>
     <div className='sidesContainer pb-1'>
        <h1 className='display-5 fw-semibold ' >
         <Link to="/landing" className='link-underline link-underline-opacity-0' >
          <span className='primaryTextClr'>My</span>
          <span className='text-black'>Website</span>
         </Link>            
        </h1>
     </div>
    </div>
  )
}

export default Header
