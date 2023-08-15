import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Protected from "./components/Protected";
import Register from "./components/Register";
import Content from "./components/Content";

export const UserContext = React.createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logOutCallback = async () => {
    // Implement your logout logic here
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include", // Needed to include the cookie
    });
    // Clear user from context
    setUser({});
    // Navigate back to startpage
    Navigate("/");
  };


  //First things, get a new accesstoken if a refreshtoken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:4005/refresh_token', {
        method: 'POST',
        credentials: 'include', // Needed to include the cookies
        headers: {
          'Content-Type': 'applicaiton/json',
        }
      })).json();
      setUser({
        accessToken: result.accessToken,
      });
      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...........</div>

  return (
    <BrowserRouter>
      <UserContext.Provider value={[user, setUser]}>
        <div className="App">
          <Navigation logOutCallback={logOutCallback} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/protected" element={<Protected />} />
            <Route path="/" element={<Content />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
