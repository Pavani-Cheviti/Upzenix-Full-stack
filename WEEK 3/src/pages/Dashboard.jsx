import React, { useMemo } from 'react';
import { Users, Ticket, DollarSign, TrendingUp, Calendar, Film, Activity, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { useRealTime } from '../contexts/RealTimeContext';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';

const DashboardCard = ({ title, value, icon: Icon, color, bgColor, textColor, subtitle, trend }) => {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-large border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:scale-[1.02] group overflow-hidden ${bgColor}`}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className={`text-4xl font-bold mb-2 ${textColor} group-hover:scale-105 transition-transform duration-300`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                trend > 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                vs last month
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`p-4 rounded-2xl ${bgColor} shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110`}>
          <Icon className={`w-8 h-8 ${textColor}`} />
        </div>
      </div>

      {/* Decorative Element */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
    </div>
  );
};

const Dashboard = () => {
  const { bookings, revenue, activeUsers, isConnected } = useRealTime();
  const { permissions } = useAuth();

  // Mock data for charts (in a real app, this would come from an API)
  const stats = useMemo(() => ({
    users: 12345 + activeUsers,
    tickets: 8765 + bookings.reduce((sum, b) => sum + b.tickets, 0),
    revenue: 123456 + revenue,
    growth: 12.5,
  }), [activeUsers, bookings, revenue]);

  const revenueData = [
    { month: 'Jan', revenue: 12000, tickets: 800 },
    { month: 'Feb', revenue: 15000, tickets: 1000 },
    { month: 'Mar', revenue: 18000, tickets: 1200 },
    { month: 'Apr', revenue: 22000, tickets: 1400 },
    { month: 'May', revenue: 25000, tickets: 1600 },
    { month: 'Jun', revenue: 28000 + revenue, tickets: 1800 + bookings.length },
  ];

  const occupancyData = [
    { time: '10:00', occupancy: 45 },
    { time: '12:00', occupancy: 67 },
    { time: '14:00', occupancy: 89 },
    { time: '16:00', occupancy: 78 },
    { time: '18:00', occupancy: 95 },
    { time: '20:00', occupancy: 87 },
    { time: '22:00', occupancy: 56 },
  ];

  const genreData = [
    { name: 'Action', value: 35, color: '#8884d8' },
    { name: 'Comedy', value: 25, color: '#82ca9d' },
    { name: 'Drama', value: 20, color: '#ffc658' },
    { name: 'Horror', value: 12, color: '#ff7300' },
    { name: 'Romance', value: 8, color: '#00ff00' },
  ];

  const cards = [
    {
      title: 'Total Users',
      value: stats.users.toLocaleString(),
      icon: Users,
      color: 'border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      subtitle: `${activeUsers} currently online`,
      trend: 8.2,
    },
    {
      title: 'Tickets Sold',
      value: stats.tickets.toLocaleString(),
      icon: Ticket,
      color: 'border-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      subtitle: `${bookings.length} recent bookings`,
      trend: 15.3,
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      subtitle: `+$${revenue} today`,
      trend: 22.1,
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      icon: Activity,
      color: 'border-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      subtitle: 'Average across all theaters',
      trend: 5.7,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
              Dashboard Overview
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome back! Here's what's happening with your movie booking system today.
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {bookings.length} Active Bookings
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">Live Data</span>
                  <p className="text-xs text-green-600 dark:text-green-400">Real-time updates</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl border border-red-200 dark:border-red-700">
                <Activity className="w-5 h-5 text-red-500" />
                <div>
                  <span className="text-sm font-semibold text-red-700 dark:text-red-300">Offline</span>
                  <p className="text-xs text-red-600 dark:text-red-400">Check connection</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
            <DashboardCard {...card} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue & Ticket Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 hover:shadow-medium transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Revenue & Ticket Trends</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly performance overview</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: '#374151' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="tickets"
                stackId="2"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Theater Occupancy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Theater Occupancy</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy rate by time of day</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => [`${value}%`, 'Occupancy']}
              />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Genre Popularity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Genre Popularity</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Movie preferences breakdown</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Film className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Popularity']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {genreData.map((genre, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: genre.color }}
                />
                <span className="font-medium">{genre.name}</span>
                <span className="ml-1 text-gray-500">({genre.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest system events and bookings</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      New booking: {booking.movie}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {booking.tickets} ticket{booking.tickets > 1 ? 's' : ''} • ${booking.amount}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium whitespace-nowrap">
                  {moment(booking.time).fromNow()}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Peak hours analysis completed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">System maintenance</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium whitespace-nowrap">
                1 hour ago
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Monthly revenue target achieved
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">$125,000 milestone reached</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full font-medium whitespace-nowrap">
                3 hours ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;