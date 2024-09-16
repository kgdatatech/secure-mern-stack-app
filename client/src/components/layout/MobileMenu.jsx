import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdStarOutline } from "react-icons/io";
import { GrResources } from "react-icons/gr";
import { GiSoccerBall } from "react-icons/gi";
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const MobileMenu = ({ toggleMobileMenu, logout }) => {
  const { auth } = useAuth();

  return (
    <div className="absolute top-full left-0 w-full bg-indigo-950 text-white p-6 shadow-lg flex flex-col items-center space-y-6 z-0">
      <Link
        to="/about"
        className="w-full text-center transition duration-300 ease-in-out transform hover:scale-105 hover:text-lime-300 flex justify-center items-center"
        aria-label="About"
        onClick={toggleMobileMenu}
      >
        Why Secure MERN Stack? <IoMdStarOutline size={18} className="ml-2" />
      </Link>
      <Link
        to="/programs"
        className="w-full text-center transition duration-300 ease-in-out transform hover:scale-105 hover:text-lime-300 flex justify-center items-center"
        aria-label="Programs"
        onClick={toggleMobileMenu}
      >
        Programs <GiSoccerBall size={18} className="ml-2" />
      </Link>
      <Link
        to="/resources"
        className="w-full text-center transition duration-300 ease-in-out transform hover:scale-105 hover:text-lime-300 flex justify-center items-center"
        aria-label="Resources"
        onClick={toggleMobileMenu}
      >
        Resources <GrResources size={18} className="ml-2" />
      </Link>
      {!auth.loading && !auth.user && (
        <>
          <Link
            to="/login"
            className="w-full text-center transition duration-300 ease-in-out transform hover:scale-105 hover:text-lime-300 flex justify-center items-center"
            aria-label="Login"
            onClick={toggleMobileMenu}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full text-center text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-lime-500 hover:text-white py-2 px-4 rounded-lg"
            aria-label="Enroll Today"
            onClick={toggleMobileMenu}
          >
            Enroll Today
          </Link>
        </>
      )}
      {!auth.loading && auth.user && (
        <>
          <Link
            to="/dashboard"
            className="w-full text-center transition duration-300 ease-in-out transform hover:scale-105 hover:text-lime-300 flex justify-center items-center"
            aria-label="Dashboard"
            onClick={toggleMobileMenu}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              toggleMobileMenu();
            }}
            className="w-full text-center transition duration-300 ease-in-out transform hover:scale-105 hover:text-lime-300 flex justify-center items-center"
            title="Logout"
            aria-label="Logout"
          >
            <FaSignOutAlt size={18} />
            <span className="ml-2">Logout</span>
          </button>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
