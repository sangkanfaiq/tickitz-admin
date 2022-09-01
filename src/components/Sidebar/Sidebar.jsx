import React, { useEffect } from "react";
import "./styles.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MovieIcon from "@mui/icons-material/Movie";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { AuthLogout } from "../../redux/actions/Auth";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, error, loading } = useSelector((state) => state.movies);
  const { isLogin } = useSelector((state) => state.auth); //required
  useEffect(() => {
    if (isLogin == false) {
      navigate("/", { replace: true });
    }
  }, [isLogin]);

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">ADMIN</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">List</p>
          <li>
            <MovieIcon className="icon" />
            <span>
              <Link to="/">Movies</Link>
            </span>
          </li>
          <li>
            <Link to="/booking">
              <BookmarkAddIcon className="icon" />
              <span>Booking</span>
            </Link>
          </li>
          <li>
            <CalendarMonthIcon className="icon" />
            <span>Schedule</span>
          </li>
          <li>
            <PersonIcon className="icon" />
            <span>Users</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <ul>
          <p className="title">Settings</p>
          <li
            onClick={() => {
              dispatch(AuthLogout());
            }}
          >
            <LogoutIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
