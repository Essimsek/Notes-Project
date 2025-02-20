import React, { useState, useContext } from 'react';
import AuthContext from "../context/AuthContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL

const Register = ({ isClicked, handleClick }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { setIsLoggedIn } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setErrorMessage("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/register`, {email, password}, {withCredentials: true});
            setIsLoggedIn(true);
            isClicked(false);
            console.log("You are logged in!");
        } catch (err) {
            setErrorMessage(err.response.data.error);
        }
    };
    return (
        <form onSubmit={(e) => handleSubmit(e)} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 bg-white shadow-lg rounded-lg p-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email 
                </label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                </label>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm Password
                </label>
                <input onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" />
                <p className="text-red-500 text-xs italic">{errorMessage}</p>
            </div>
            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Sign Up
                </button>
                <a onClick={handleClick} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                    Login
                </a>
            </div>
        </form>
    )
};

export default Register;