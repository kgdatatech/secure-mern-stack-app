import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { ImStatsDots } from 'react-icons/im';
import { SiTailwindcss, SiMongodb, SiExpress, SiReact, SiNodedotjs, SiStripe } from 'react-icons/si';
import { IoIosBusiness } from "react-icons/io";
import { GiStairsGoal } from "react-icons/gi";

function About() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
        backgroundSize: '10px 10px',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Hero Banner */}
      <div className="max-w-4xl w-full bg-blue-950 text-white py-16 px-8 rounded-t-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-4 flex items-center justify-center">
            <IoIosBusiness className="mr-3 text-blue-100" /> Your Business Name
          </h1>
          <p className="text-base font-light">
            Empowering developers and supporting freelancers in a fun and engaging web design journey.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full bg-white shadow-xl  p-8">
        <h2 className="text-4xl font-bold text-gray-950 mb-6">About Our Project</h2>
        <p className="text-gray-900 text-base leading-relaxed mb-6">
          Our project is a vibrant platform dedicated to providing top-notch secure web design templates for coders, while giving them the tools and resources they need. We focus on creating a fun, safe, and engaging environment where yany coder can develop their skills and love for full stack programs.
        </p>
        
        {/* Interactive Mission Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-3xl font-semibold text-gray-950 mb-4">Our Mission <GiStairsGoal className="inline-block ml-2 text-gray-600" /></h3>
          <p className="text-gray-900 text-base leading-relaxed">
            We aim to empower web developer clubs and programs by providing a reliable and secure platform that meets all their operational needs. From program management to advanced analytics, our goal is to make coding management easier, so you can focus on what really matters—getting creative.
          </p>
        </div>

        {/* Technologies We Use */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <SiMongodb className="w-10 h-10 text-green-600" />
            <p className="text-gray-900 text-base leading-relaxed">
              MERN Stack (<SiExpress className="inline-block text-gray-600" /> MongoDB, Express, <SiReact className="inline-block text-blue-600" /> React, <SiNodedotjs className="inline-block text-lime-600" /> Node.js)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SiTailwindcss className="w-10 h-10 text-blue-500" />
            <p className="text-gray-900 text-base leading-relaxed">
              Tailwind CSS for responsive and modern UI
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SiStripe className="w-10 h-10 text-indigo-700" />
            <p className="text-gray-900 text-base leading-relaxed">
              Stripe for secure payment processing
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <FaLock className="w-10 h-10 text-yellow-500" />
            <p className="text-gray-900 text-base leading-relaxed">
              Role-based authentication and 2FA for enhanced security
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ImStatsDots className="w-10 h-10 text-blue-600" />
            <p className="text-gray-900 text-base leading-relaxed">
              Comprehensive analytics dashboard
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl w-full bg-gray-200 text-black py-8 px-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-4 flex items-center justify-center">
            Join Today!
          </h1>
          <p className="text-base font-light mb-8">
          Sign up and register for our exciting programs and start your journey with us.
          </p>
          {/* Call to Action Section */}
          <Link to="/register" className="block">
            <button className="bg-blue-950 text-lg text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 mx-auto block">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
