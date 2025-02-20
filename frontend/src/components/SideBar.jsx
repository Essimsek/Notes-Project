import React, { useState, useContext } from "react";
import { FaPlus } from "react-icons/fa"; // Add icon
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // Sign in icon
import axios from "axios";

import Login from "./Login";
import Register from "./Register";

import AuthContext from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SideBarIcon = ({icon, handleClick, text="tool-tip"}) => {
    return (
    <div onClick={handleClick} className="sidebar-icon group">
        {icon}
        <span className="sidebar-tooltip">
            {text}
        </span>
    </div>
    );
};

const SideBar = (props) => {
    const [isClicked, setIsClicked] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [isRegister, setIsRegister] = useState(false);

    const handleSignIn = () => {
        if (isRegister && isClicked) {
            setIsRegister(!isRegister);
            setIsClicked(!isClicked);
        }
        if (!isRegister && !isClicked) {
            setIsClicked(!isClicked);
        }
        else if (isClicked) {
            setIsClicked(!isClicked);
        }
        else {
            setIsRegister(!isRegister);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${backendUrl}/api/logout`, {}, {withCredentials: true});
            setIsLoggedIn(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleIsLogin = () => {
        setIsClicked(!isClicked);
        setIsRegister(!isRegister);
    }

    return (
        <div className="fixed top-0 left-0 w-16 h-full bg-[#3e5172] flex flex-col items-center justify-between py-12 shadow-lg z-50">
            <div className="mt-10 flex flex-col gap-3">
                <SideBarIcon icon={<FaPlus/>} handleClick={props.handleAddNote} text="Add new note"/>
            </div>
            {!isLoggedIn && <SideBarIcon icon={<FaSignInAlt/>} handleClick={handleSignIn} text="Sign in"/>}
            {isLoggedIn && <SideBarIcon icon={<FaSignOutAlt/>} handleClick={handleLogout} text="Sign out"/>}
            {!isLoggedIn && isClicked && <Login isClicked={setIsClicked} handleClick={handleIsLogin} />}
            {!isLoggedIn && isRegister && <Register isClicked={setIsClicked} handleClick={handleIsLogin} />}
        </div>
    );
}

export default SideBar;
