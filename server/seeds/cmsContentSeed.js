require('dotenv').config();
const mongoose = require('mongoose');
const CmsContent = require('../models/CmsContent');

const seedHomepageContent = async () => {
  try {
    // Use the MONGO_URI from your environment variables
    await mongoose.connect(process.env.MONGO_URI);

    const homepageContent = new CmsContent({
      type: 'homepage',
      sections: {
        slider: [
          { imageUrl: '/assets/field.png', title: 'Join the Team', subtitle: 'Experience the joy of playing soccer and being part of a team.' },
          { imageUrl: '/assets/ball.png', title: 'Kick, Pass, Score', subtitle: 'Master the fundamentals with our expert coaching and practice drills.' },
          { imageUrl: '/assets/soccer.png', title: 'Train Like a Champion', subtitle: 'Develop skills and teamwork on our state-of-the-art soccer fields.' },
        ],
        features: [
          { icon: 'FaUserShield', title: 'Top-Notch Security', description: 'Our application implements the latest security measures to ensure your data is always safe and secure.' },
          { icon: 'FaUserFriends', title: 'User-Friendly Interface', description: 'Experience a clean and intuitive interface that makes navigation a breeze for all users.' },
          { icon: 'FaChartLine', title: 'Performance Metrics', description: 'Track your performance with our detailed analytics and reporting tools.' },
        ],
        joinUs: {
          title: 'Join Us Today',
          description: 'Sign up now to take advantage of our secure and user-friendly application. It\'s free and easy to get started.',
          buttonText: 'Get Started',
          buttonLink: '/register',
        },
      },
    });

    await homepageContent.save();
    console.log('Homepage content seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding homepage content:', error);
    mongoose.connection.close(); // Ensure the connection is closed on error
  }
};

seedHomepageContent();
