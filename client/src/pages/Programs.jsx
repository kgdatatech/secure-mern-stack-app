import React from 'react';
import { Link } from 'react-router-dom';
import { TiClipboard } from "react-icons/ti";

function Programs() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6"
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
      {/* Page Header */}
      <div className="max-w-4xl w-full bg-blue-950 text-white py-16 px-8 rounded-t-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-4 flex items-center justify-center">
            <TiClipboard className="mr-3 text-blue-100" /> Our Programs
          </h1>
          <p className="text-base font-light">
            Discover a wide range of web design programs designed for coders of all ages and skill levels. <br/>Whether you're just starting out or looking to elevate your game, we have the right program for you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full bg-white shadow-xl p-8">
        <div className="space-y-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Developer Program</h2>
            <p className="text-gray-900 text-base mt-2">
              Our Junior Developer Program is designed to teach the fundamentals of coding in a fun and engaging environment. Perfect for junior developerss looking to learn the programming languages and develop their skills.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Advanced Training Program</h2>
            <p className="text-gray-900 text-base mt-2">
              The Advanced Training Program is aimed at developers who want to take their skills to the next level. Our experienced devs provide focused training to help you reach your full potential.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Summer Coding Camps</h2>
            <p className="text-gray-900 text-base mt-2">
              Join us this summer for our Coder Camps, where you’ll have the opportunity to improve your skills, compete for prizes, and make new friends in a fun, competitive environment.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Adult Leagues</h2>
            <p className="text-gray-900 text-base mt-2">
              Our Business Program offer a great way to stay active and enjoy the mundane of coding. Whether you’re a seasoned business developer or just getting started, our programs provide a competitive and friendly atmosphere.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl w-full bg-gray-200 text-black py-8 px-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-4 flex items-center justify-center">
            Ready to Join a Program?
          </h1>
          <p className="text-base font-light mb-8">
            Get started today by finding the right program for you!
          </p>
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

export default Programs;
