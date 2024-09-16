import React from 'react';
import { Link } from 'react-router-dom';
import { GiBookshelf } from 'react-icons/gi';

function Resources() {
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
            <GiBookshelf className="mr-3 text-blue-100" /> Resources
          </h1>
          <p className="text-base font-light">
            Explore a wealth of resources to enhance your developer journey. <br/> From training guides to the latest tech news, we’ve got you covered.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full bg-white shadow-xl p-8">
        <div className="space-y-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Training Guides</h2>
            <p className="text-gray-900 text-base mt-2">
              Explore our comprehensive training guides, covering everything from basic html to advanced javascript tactics. Whether you're a beginner or an experienced developer, you'll find valuable insights to improve your skills.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Video Tutorials</h2>
            <p className="text-gray-900 text-base mt-2">
              Watch our curated video tutorials to see top secure techniques in action. Our library includes videos on JWT, CSRF, Google OAUTH, and more, all demonstrated by professional developers.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Fitness Programs</h2>
            <p className="text-gray-900 text-base mt-2">
              Stay the top percentile with our secure-specific web designs. Designed to improve strength, agility, and endurance, these designs are perfect for devs who want to perform at their best in the field of tech.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Nutritional Advice</h2>
            <p className="text-gray-900 text-base mt-2">
              Proper nutrition and sleep is key to full stack developer performance. Our advice section offers tips and plans tailored for junior web devs, ensuring you have the energy and nutrients needed to excel.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-950">Tech News</h2>
            <p className="text-gray-900 text-base mt-2">
              Stay updated with the latest tech news, match reports, and analysis from around the world. Our resources keep you informed about the trends and developments in the tech community.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl w-full bg-gray-200 text-black py-8 px-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-4 flex items-center justify-center">
            Dive into More Resources
          </h1>
          <p className="text-base font-light mb-8">
            Discover more tips, tutorials, and guides to enhance your web development experience.
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

export default Resources;
