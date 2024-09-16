import React from 'react';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import logo from '../../assets/1.jpg'; // Replace with your logo

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-6 border-t border-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Logo and Email Section */}
        <div>
          <img src={logo} alt="Secure MERN Stack Logo" className="w-24 h-24 mx-auto md:mx-0" />
          <p className="mt-4 font-bold">Email: info@youremail.com</p>
        </div>

        {/* Secure MERN Stack Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Your Business Name</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-blue-300">Why Choose Us?</a></li>
            <li><a href="/about" className="hover:text-blue-300">New Skills</a></li>
            <li><a href="/about" className="hover:text-blue-300">Development</a></li>
            <li><a href="/about" className="hover:text-blue-300">Benefits</a></li>
          </ul>
        </div>

        {/* Programs Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Programs</h3>
          <ul className="space-y-2">
            <li><a href="/programs" className="hover:text-blue-300">Enrichment Program</a></li>
            <li><a href="/programs" className="hover:text-blue-300">Learning Programs</a></li>
            <li><a href="/programs" className="hover:text-blue-300">Other Programs</a></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><a href="/resources" className="hover:text-blue-300">Frequently Asked Questions</a></li>
            <li><a href="/register" className="hover:text-blue-300">Employment</a></li>
            <li><a href="resources" className="hover:text-blue-300">Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Social Media and Copyright Section */}
      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" aria-label="Twitter" className="text-white hover:text-blue-300">
            <FaTwitter size={24} />
          </a>
          <a href="#" aria-label="Facebook" className="text-white hover:text-blue-300">
            <FaFacebook size={24} />
          </a>
        </div>
        <p>&copy; 2024 Your Business, Inc. All rights reserved.</p>
        {/* <p className="mt-2">Powered by <a href="#" className="font-bold hover:text-blue-300">YourCompany</a></p> */}
      </div>
    </footer>
  );
};

export default Footer;
