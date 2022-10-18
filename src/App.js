import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from './context/AuthContext';

// import pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Artists from "./pages/Artists";
import Posts from "./pages/Posts";
import ThreadDetails from "./pages/ThreadDetails";
import Post from "./pages/Post";

function App() {

  const [currentUser, setCurrentUser] = useContext(AuthContext);

  return (    
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate replace to='/signup' />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/:artists_id" element={currentUser ? <Posts /> : <Login />} />
          <Route path="/:artists_id/:thread_id" element={currentUser ? <ThreadDetails /> : <Login />} />
          <Route path='/post' element={currentUser ? <Post /> : <Login />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
