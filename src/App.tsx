import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Auctions from "./components/Auctions";
import Auction from "./components/Auction";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/users/:id" element={<Profile/>}/>
                <Route path="/users/register" element={<Register/>}/>
                <Route path="/users/login" element={<Login/>}/>
                <Route path="/auctions/:id" element={<Auction/>}/>
                <Route path="/auctions" element={<Auctions/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;