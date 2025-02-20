import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="text-white text-center">
        <p>&copy; {currentYear}</p>
        </footer>
    );
}

export default Footer;
