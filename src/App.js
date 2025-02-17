import { Link } from "react-router-dom";
import "./App.css";
import Posts from "./pages/Posts";

function App() {
  return (
    <div className="App ">
      <>
      {/* <Posts/> */}
        <div className="container text-center">
          <div className="ui-title">
            <h1>Social Media UI Screens</h1>
          </div>
          <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3 landing-screen">
            <div className="col">
              <Link className="btn links" to="/landing">Landing Page</Link>
            </div>
            <div className="col">
              <Link className="btn links" to="/home">Home Page</Link>
            </div>
            <div className="col">
              <Link className="btn links" to="/profile">Profile Page</Link>
            </div>
            <div className="col">
              <Link className="btn links">Profile Page 1</Link>
            </div>
            <div className="col">
              <Link className="btn links">Profile Page 2</Link>
            </div>
            <div className="col">
              <Link className="btn links" to="/login">Login Page</Link>
            </div>
            <div className="col">
              <Link className="btn links" to="/signup">Signup Page</Link>
            </div>
            <div className="col">
              <Link className="btn links" to="/explore">Explore Page</Link>
            </div>

            <div>             
            </div>
            <div className="col">
              <Link className="btn links">Bookmark Page</Link>
            </div>
            <div className="col">
              <Link className="btn links">Post Page</Link>
            </div>
           
          </div>
        </div>
      </>
    </div>
  );
}

export default App;
