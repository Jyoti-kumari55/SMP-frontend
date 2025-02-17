import React, { useEffect } from "react";
import Header from "../components/Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import {  NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfileSuccess } from "../features/userSlice";

const UserList = () => {
  const { profile, isLoading, error } = useSelector((state) => state.user);
  const { token, user } = useSelector((state) => state.auth);
  // console.log("uuuu", user, "pppp", profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfileSuccess(token)); 
    }
  }, [dispatch, token, user]);

  return (
    <>
      <Header />
      <div className="sidesContainer">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar />
          </div>
          <div className="col-md-6">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error occured</p>}
            <div>
              <NavLink
                to="/home"
                className="mt-4 border-0 text-black"
                style={{ fontSize: "35px", textDecoration: "none" }}
              >
                &#8592;
              </NavLink>
              <span className="ms-3 fw-bold fs-4 mb-1">
                {profile?.user?.name || user?.name}
                {/* {user?.name} */}
              </span>
              <p style={{marginLeft: "2.8rem"}}>@{profile?.user?.username || user?.username}</p>
            </div>
            <hr/>
            <div className="d-flex fs-4 fw-semibold"
              style={{justifyContent: "center", gap: "7rem", marginRight: "4rem"}}>

            <div>
              
            </div>
              <NavLink
                className="text-decoration-none text-black"
                to={`followers`}
              >
                Followers
              </NavLink>
              <NavLink
                className="text-decoration-none text-black"
                to={`followings`}
              >
                Following
              </NavLink>
            </div>
            {/* <FollowersUserList/> */}
            {/* <div>
              {location.pathname.includes("followers") && (
                <FollowersUserList />
              )}
              {location.pathname.includes("followings") && (
                <FollowingsUserList />
              )}
            </div> */}

            <Outlet />

          </div>
          <div className="col-md-3">
            <RightSideBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
