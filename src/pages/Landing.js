import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="container mt-5 ">
      <div className="row landing">
        <div className="col-md-4">
          <h1 className="mb-5 fw-bolder display-4">
            <Link to="/landing" className="link-underline link-underline-opacity-0">
              <span className="primaryTextClr">My </span>
              <span className="text-black">Website</span>
            </Link>
          </h1>
          <div className="landing_content mb-5">
            <p className="p_text">
              FOLLOW <span className="p_subtext"> PEOPLE AROUND THE GLOBE</span>
            </p>
            <p className="p_text">
              CONNECT <span className="p_subtext">WITH YOUR FRIENDS</span>
            </p>
            <p className="p_text">
              SHARE <span className="p_subtext"> WHAT YOU THINKING</span>
            </p>
          </div>

          <Link className="btn w-100 mb-1 link1 "  to="/signup">
            {" "}
            Join Now
          </Link>

          <Link to="/login" 
            className="text-center link-underline link-underline-opacity-0 text-black">
            <p className="primaryTextClr">Already have an account?</p>
          </Link>
          
        </div>
        <div className="col-md-6">
          <img
            src="https://media.istockphoto.com/id/1340024049/photo/close-up-woman-hand-hold-using-smart-phone-with-heart-icon-at-outdoor-park-street-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=TpOUp2gqk46hkLAD236_i9NbX6JbWLZfSiKmgfwLppk="
            alt="social_img"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
