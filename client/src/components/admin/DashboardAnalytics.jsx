import React from 'react';
import { FaChartBar, FaDollarSign, FaChartLine, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

const DashboardAnalytics = () => {
  const { analytics, loading, error } = useAnalyticsData();

  if (loading) {
    return <LoadingSpinner />; // Show spinner while data is loading
  }

  if (error) {
    return <div className="text-red-500 text-sm text-center mt-4">Error fetching analytics data: {error}</div>;
  }

  // Data for Users KPIs
  const userData = [
    { name: 'Total Users', value: analytics.totalUsers },
    { name: 'Verified Users', value: analytics.totalVerifiedUsers },
  ];

  // Data for Payments KPIs
  const paymentData = [
    { name: 'One-Time Payments', value: analytics.totalOneTimePayUsers },
    { name: 'Subscription Payments', value: analytics.totalSubscriptions },
  ];

  // Calculate total users to compute percentage
  const total = userData.reduce((sum, entry) => sum + entry.value, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-3 sm:p-2 dark:bg-darkBackground dark:text-darkText flex-1 max-w-screen-lg mx-auto pb-20">
      <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pt-4 flex items-center">
        <FaChartBar className="mr-2" /> {/* Add margin to the right of the icon */}
        Analytics
      </h1>

      {/* Stripe Link */}
      <div className="text-right mb-3">
        <a 
          href="https://dashboard.stripe.com/test/dashboard" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 text-xs sm:text-sm"
        >
          Go to Stripe Dashboard
        </a>
      </div>  

      {/* Combined KPIs Section */}
      <div className="bg-transparent">
        <h2 className="text-lg sm:text-xl text-center font-bold text-gray-800 dark:text-gray-100 mb-4">Performance Dashboard</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Subscriptions KPIs */}
          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaChartLine className="text-green-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.totalSubscriptions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Subscriptions</p>
          </div>
          
          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaChartLine className="text-green-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.activeSubscriptions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Subscriptions</p>
          </div>

          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaChartLine className="text-red-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.inactiveSubscriptions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inactive Subscriptions</p>
          </div>

          {/* One-Time Payments KPIs */}
          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaDollarSign className="text-blue-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.totalOneTimePayUsers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total One-Time Pay Users</p>
          </div>
          
          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaDollarSign className="text-blue-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.activeOneTimePayUsers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active One-Time Pay Users</p>
          </div>

          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaDollarSign className="text-blue-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${typeof analytics.totalRevenue === 'number' ? analytics.totalRevenue.toFixed(2) : '0.00'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</p>
          </div>

          {/* Users KPIs */}
          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaUsers className="text-purple-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.totalUsers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</p>
          </div>
          
          <div className="bg-white dark:bg-darkCard p-3 flex flex-col items-center justify-center shadow-sm transition-transform transform hover:scale-105">
            <FaUsers className="text-purple-600 text-2xl mb-2" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{analytics.totalVerifiedUsers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verified Users</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-300 dark:border-gray-700 my-4 sm:my-5" />

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-darkCard border border-gray-300 dark:border-gray-700 p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.revenueOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="_id" tick={{ fill: '#555', fontSize: 8 }} />
              <YAxis tick={{ fill: '#555', fontSize: 8 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-darkCard border border-gray-300 dark:border-gray-700 p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Payments Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={50} // Creates the donut shape
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Show both name and percentage
                position="inside"
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: '12px' }} // Slightly increase font size to 12px
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <div className="bg-white dark:bg-darkCard border border-gray-300 dark:border-gray-700 p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">User Analytics Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 8 }} />
              <YAxis tick={{ fill: '#555', fontSize: 8 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
              <Bar dataKey="value" fill="#4f46e5">
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-darkCard border border-gray-300 dark:border-gray-700 p-2 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#4f46e5"
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const percentage = ((value / total) * 100).toFixed(0); // Calculate percentage

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      style={{ fontSize: '8px', fontWeight: 'bold' }}  // Keeping label font size compact
                    >
                      {`${name}: ${percentage}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }} />
              <Legend
                verticalAlign="bottom"
                height={24}
                wrapperStyle={{ fontSize: '11px', color: '#fff' }}  // Setting the legend font size to extra small
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Registrations Over Time */}
      <div className="bg-white dark:bg-darkCard border border-gray-300 dark:border-gray-700 p-2 sm:p-3 mt-6 sm:mt-8 shadow-sm hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">User Registrations Over Time</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={analytics.userGrowthOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="_id" tick={{ fill: '#555', fontSize: 8 }} />
            <YAxis tick={{ fill: '#555', fontSize: 8 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', color: '#fff' }} />
            <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
            <Line type="monotone" dataKey="count" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="px-0 py-4">
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
