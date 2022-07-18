import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, Admin } from "./pages";
import Movies from "./pages/Admin/components/Movies/Movies";

const mainNavigation = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" index element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/movies" element={<Movies />} />
      </Routes>
    </div>
  );
};

export default mainNavigation;
