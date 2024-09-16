import React, { useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import soccerImage from '../assets/1.jpg';
import fieldImage from '../assets/2.jpg';
import ballImage from '../assets/3.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('developers');
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    appendDots: (dots) => (
      <div style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
        <ul style={{ display: 'flex', justifyContent: 'center', padding: 0 }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className="w-4 h-2 opacity-50 rounded-full bg-gray-100 hover:bg-blue-100 transition-all duration-300 ease-in-out transform hover:scale-110"
        style={{
          display: 'inline-block',
          margin: '0 16px',
        }}
      ></div>
    ),
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'developers':
        return (
          <>
            <div className="relative flex-shrink-0 mb-8 md:mb-0 md:mr-8 md:w-6/12 flex flex-col items-center md:items-start">
              <div className="relative mb-4">
                <img src={soccerImage} alt="For Developers" className="rounded-full w-40 h-40 object-cover" />
              </div>
              <div className="relative mb-4">
                <img src={fieldImage} alt="For Developers 2" className="rounded-full w-28 h-28 object-cover" />
              </div>
              <div className="relative mb-4">
                <img src={ballImage} alt="For Developers 3" className="rounded-full w-32 h-32 object-cover" />
              </div>
            </div>
            
            <div className="text-center md:text-left max-w-lg md:w-6/12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Enrichment Through Development</h2>
              <p className="text-lg md:text-2xl mb-4">FUN and educational web developer Programs</p>
              <p className="mt-4 mb-12 text-base md:text-lg">
              Our high-energy programs are creative, engaging, and designed to foster skill development, teamwork, and healthy competition. The proven Web Development Curriculum provides a safe and fun environment for both learning and collaboration.
              </p>
              <div className="mt-6">
                <Link to="/about" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full font-bold text-lg transition duration-300 ease-in-out">
                  Learn More
                </Link>
                <Link to="/register" className="ml-4 text-white border-b-2 border-blue-600 font-bold text-lg transition duration-300 ease-in-out hover:border-blue-700">
                  Get Started
                </Link>
              </div>
            </div>
          </>
        );
      case 'freelancers':
        return (
          <>
            <div className="relative flex-shrink-0 mb-8 md:mb-0 md:mr-8 md:w-6/12 flex flex-col items-center justify-center">
              <div className="relative flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <img src={ballImage} alt="For Freelancers" className="rounded-full w-full h-full object-cover" />
                </div>
                <div className="relative w-40 h-40 ml-4">
                  <img src={soccerImage} alt="For Freelancers 2" className="rounded-full w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative w-28 h-28 mt-4">
                <img src={fieldImage} alt="For Freelancers 3" className="rounded-full w-full h-full object-cover mx-auto" />
              </div>
            </div>
            
            <div className="text-center md:text-left max-w-lg md:w-6/12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Support for Freelancers</h2>
              <p className="text-lg md:text-2xl mb-4">Guidance, Community, and Resources</p>
              <p className="mt-4 mb-12 text-base md:text-lg">
                We offer comprehensive support and resources for freelancers, helping you navigate your web dev journey. From expert advice to community engagement, we've got you covered.
              </p>
              <div className="mt-6">
                <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full font-bold text-lg transition duration-300 ease-in-out">
                  Learn More
                </Link>
                <Link to="/get-started" className="ml-4 text-white border-b-2 border-blue-600 font-bold text-lg transition duration-300 ease-in-out hover:border-blue-700">
                  Get Started
                </Link>
              </div>
            </div>
          </>
        );
      case 'businesses':
        return (
          <>
            <div className="relative flex-shrink-0 mb-8 md:mb-0 md:mr-8 md:w-6/12 flex flex-col items-center justify-center">
              <div className="relative flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <img src={fieldImage} alt="Businesses" className="rounded-full w-full h-full object-cover" />
                </div>
                <div className="relative w-40 h-40 ml-4">
                  <img src={ballImage} alt="Businesses 2" className="rounded-full w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative w-28 h-28 mt-4">
                <img src={soccerImage} alt="Businesses 3" className="rounded-full w-full h-full object-cover mx-auto" />
              </div>
            </div>
            
            <div className="text-center md:text-left max-w-lg md:w-6/12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Businesses</h2>
              <p className="text-lg md:text-2xl mb-4">Quality Programs for Business Development</p>
              <p className="mt-4 mb-12 text-base md:text-lg">
                Our programs are designed to support early business development in your online start-up, providing structured and secure practices that promote safe and protected growth.
              </p>
              <div className="mt-6">
                <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full font-bold text-lg transition duration-300 ease-in-out">
                  Learn More
                </Link>
                <Link to="/get-started" className="ml-4 text-white border-b-2 border-blue-600 font-bold text-lg transition duration-300 ease-in-out hover:border-blue-700">
                  Get Started
                </Link>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-gray-100 min-h-screen"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(240, 240, 240, 0.2) 1px, transparent 1px),
          linear-gradient(rgba(240, 240, 240, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(240, 240, 240, 0.2) 1px, transparent 1px),
          linear-gradient(rgba(240, 240, 240, 0.2) 1px, transparent 1px)`,
        backgroundSize: '10px 10px',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Slider Section */}
      <Slider {...settings} className="relative mb-12">
        <div className="relative h-[500px] md:h-[700px] overflow-hidden rounded-b-extra-large">
          <img src={fieldImage} alt="Soccer field" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-2 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Join the Team</h2>
            <p className="text-lg text-center md:text-xl">Experience the joy of web-development and being part of a secure team.</p>
          </div>
        </div>
        <div className="relative h-[500px] md:h-[700px] overflow-hidden rounded-b-extra-large">
          <img src={ballImage} alt="Soccer ball" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Think, Think, Think</h2>
            <p className="text-lg text-center md:text-xl">Master the fundamentals with our expert developers and practice coding.</p>
          </div>
        </div>
        <div className="relative h-[500px] md:h-[700px] overflow-hidden rounded-b-extra-large">
          <img src={soccerImage} alt="Soccer kids" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Train Like a Computer</h2>
            <p className="text-lg text-center md:text-xl">Develop skills and teamwork on our state-of-the-art soccer fields.</p>
          </div>
        </div>
      </Slider>

      {/* Intro Section */}
      <section className="bg-transparent text-gray-900 py-10 px-8 text-center">
        <div className="container mx-auto">
          <div className="mx-auto w-full md:w-3/4 lg:w-2/3">
            <p className="text-blue-600 text-xl md:text-m font-bold mb-6">
              Inspiring Web Designs for Coders
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Premier Design <br /> Modernly Developed UI/UX
            </h1>
            <p className="text-gray-800 text-xl md:text-xl">
              Our secure designs offer unparalleled training, development, and fun for coders of all ages.
              Join us and be part of a community that fosters both creative and analytical growth.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="container mx-auto p-6">
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={soccerImage} alt="School Enrichment Programs" className="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h3 className="text-2xl font-bold mb-2">Developer Programs</h3>
            <p className="text-blue-600 text-sm mb-4">Intermediate / Advanced</p>
            <p className="text-gray-600 mb-6">Introducing our comprehensive developer program designed to bring the joy and excitement of web design directly to your workspace.</p>
            <button className="bg-blue-600 w-full text-white py-2 px-4 rounded-full font-bold transition duration-300 ease-in-out hover:bg-blue-700">
              Learn More
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={fieldImage} alt="Park Programs" className="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h3 className="text-2xl font-bold mb-2">Freelancer Programs</h3>
            <p className="text-blue-600 text-sm mb-4">Intermediate / Advanced</p>
            <p className="text-gray-600 mb-6">Embrace the thrill of freelancing with our program, designed to introduce modern UI/UX principles and beautiful web design in a fun, engaging, and educational environment.</p>
            <button className="bg-blue-600 w-full text-white py-2 px-4 rounded-full font-bold transition duration-300 ease-in-out hover:bg-blue-700">
              Learn More
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={ballImage} alt="Recreational Leagues" className="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h3 className="text-2xl font-bold mb-2">Business Inquires</h3>
            <p className="text-blue-600 text-sm mb-4">Intermediate / Advanced</p>
            <p className="text-gray-600 mb-6">Our business program offers a fun and engaging environment for any level web developer to enjoy coding, develop their skills, and make new connections.</p>
            <button className="bg-blue-600 w-full text-white py-2 px-4 rounded-full font-bold transition duration-300 ease-in-out hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </section>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-950 text-white py-16">
        <section className="bg-gray-950 text-white py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-full md:w-1/3">
                <p className="text-blue-400 text-lg md:text-lg font-bold mb-2">WHAT WE DO</p>
                <h2 className="text-3xl md:text-3xl font-bold">Why Our Business?</h2>
              </div>
              <div className="w-full md:w-2/3 mt-4 md:mt-0 md:pl-8">
                <p className="text-lg md:text-base text-gray-200">
                  Our business programs are the perfect choice for developers looking to ignite a lifelong passion for web design. 
                  Join us today and experience the joy of [Your Business Name]—it's more than just a business program, it's a journey 
                  of growth and empowerment for developer.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Secure MERN Stack? section */}
        <div className="container mx-auto max-w-screen-lg">
          <div className="bg-gray-900 p-4 rounded-t-lg">
            <div className="flex justify-center space-x-8 mb-2">
              <button
                className={`text-white py-2 px-4 font-bold text-base relative transition duration-300 ease-in-out ${
                  activeTab === 'developers' ? 'text-indigo-950' : ''
                }`}
                onClick={() => setActiveTab('developers')}
              >
                For Developers
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white transition-all duration-300 ease-in-out ${
                    activeTab === 'developers' ? 'w-full' : 'w-10'
                  }`}
                ></span>
              </button>
              <button
                className={`text-white py-2 px-4 font-bold text-base relative transition duration-300 ease-in-out ${
                  activeTab === 'freelancers' ? 'text-indigo-950' : ''
                }`}
                onClick={() => setActiveTab('freelancers')}
              >
                For Freelancers
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white transition-all duration-300 ease-in-out ${
                    activeTab === 'freelancers' ? 'w-full' : 'w-10'
                  }`}
                ></span>
              </button>
              <button
                className={`text-white py-2 px-4 font-bold text-base relative transition duration-300 ease-in-out ${
                  activeTab === 'businesses' ? 'text-indigo-950' : ''
                }`}
                onClick={() => setActiveTab('businesses')}
              >
                Businesses
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white transition-all duration-300 ease-in-out ${
                    activeTab === 'businesses' ? 'w-full' : 'w-10'
                  }`}
                ></span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-b-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </section>

      {/* End Section */}
      <section className="bg-transparent text-gray-900 py-10 px-8 text-center">
        <div className="container mx-auto">
          <div className="mx-auto w-full md:w-3/4 lg:w-2/3">
            <p className="text-blue-600 text-LG md:text-m font-bold mb-6">
            LEARN, PLAY, EARN!
            </p>
            <h1 className="text-4xl md:text-4xl font-bold mb-6">
              Find Your Business <br /> Located in [City, State]
            </h1>
            <p className="text-gray-800 text-lg md:text-base">
            You can find [Your Business] in [City, State]. <br/>Don’t wait, find a [your business] service here today!
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Text Section on the Left */}
            <div>
              <p className="text-blue-600 text-xl font-bold mb-2">CONNECT WITH US</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Looking To Connect? Let's Get In Touch!</h2>
              <p className="text-gray-700">
                Please feel free to reach out to us using the contact form. We value your feedback, inquiries, and suggestions.
                Our team is dedicated to addressing your concerns promptly and providing assistance whenever needed.
                Thank you for choosing to connect with us. We look forward to hearing from you soon!
              </p>
            </div>

            {/* Form Section on the Right */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">First Name <span className="text-red-500">*</span></label>
                    <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="firstName" placeholder="E.g. John" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">Last Name <span className="text-red-500">*</span></label>
                    <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="lastName" placeholder="E.g. Doe" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email Address <span className="text-red-500">*</span></label>
                  <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="email" placeholder="E.g. john@doe.com" />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">How can we help?</label>
                  <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="subject">
                    <option>Developer Programs</option>
                    <option>Freelancer Programs</option>
                    <option>Business Inquiry</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="message">Text</label>
                  <textarea className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="message" rows="5" placeholder="Leave us a message"></textarea>
                </div>

                <div className="text-center">
                  <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg transition duration-300 ease-in-out hover:bg-blue-600">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
