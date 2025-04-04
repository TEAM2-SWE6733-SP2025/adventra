"use client"; // Ensure this file is treated as a client component in Next.js

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import {
  FaUsers,
  FaMountain,
  FaChartLine,
  FaUserPlus,
  FaExclamationCircle,
  FaBell,
} from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamically import Chart.js components to avoid SSR issues
const BarChart = dynamic(() => import("@/app/components/BarChart"), {
  ssr: false,
});
const PieChart = dynamic(() => import("@/app/components/PieChart"), {
  ssr: false,
});

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 1200,
    totalAdmins: 10,
    totalAdventures: 350,
    activeAdventures: 120,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      icon: FaUserPlus,
      message: "John Doe signed up on April 3, 2025",
      color: "text-yellow-500",
    },
    {
      icon: FaMountain,
      message: "New adventure `Hiking in Yosemite` created",
      color: "text-green-500",
    },
    {
      icon: FaChartLine,
      message: "Active adventures increased by 10%",
      color: "text-blue-500",
    },
  ]);

  const [topAdventures, setTopAdventures] = useState([
    { name: "Hiking in Yosemite", rating: 4.9 },
    { name: "Climbing Mount Everest", rating: 4.8 },
    { name: "Kayaking in the Amazon", rating: 4.7 },
  ]);

  const [notifications, setNotifications] = useState([
    {
      icon: FaExclamationCircle,
      message: "3 flagged adventures need review",
      color: "text-red-500",
    },
    {
      icon: FaBell,
      message: "5 pending user approvals",
      color: "text-yellow-500",
    },
  ]);

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <p className="text-gray-400">
          Overview of Adventra&#39;s key metrics and activity.
        </p>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 text-white p-6">
          <div className="flex items-center gap-4">
            <FaUsers className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 text-white p-6">
          <div className="flex items-center gap-4">
            <FaMountain className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Adventures</h3>
              <p className="text-3xl font-bold">{stats.totalAdventures}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 text-white p-6">
          <div className="flex items-center gap-4">
            <FaChartLine className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Active Adventures</h3>
              <p className="text-3xl font-bold">{stats.activeAdventures}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 text-white p-6">
          <div className="flex items-center gap-4">
            <FaUserPlus className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Admins</h3>
              <p className="text-3xl font-bold">{stats.totalAdmins}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity and System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-800 text-white p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-center gap-4">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <p>{activity.message}</p>
              </li>
            ))}
          </ul>
        </Card>

        {/* System Health Overview */}
        <Card className="bg-gray-800 text-white p-6">
          <h3 className="text-lg font-semibold mb-4">System Health Overview</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <p>Server Uptime</p>
              <p className="text-green-500 font-bold">99.9%</p>
            </li>
            <li className="flex justify-between">
              <p>API Response Time</p>
              <p className="text-yellow-500 font-bold">120ms</p>
            </li>
            <li className="flex justify-between">
              <p>Error Rate</p>
              <p className="text-red-500 font-bold">0.2%</p>
            </li>
          </ul>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white p-6">
          <h3 className="text-lg font-semibold mb-4">
            Adventure Types Distribution
          </h3>
          <PieChart
            data={{
              labels: ["Hiking", "Climbing", "Kayaking", "Camping", "Cycling"],
              datasets: [
                {
                  data: [40, 25, 15, 10, 10],
                  backgroundColor: [
                    "#fbbf24",
                    "#34d399",
                    "#3b82f6",
                    "#a855f7",
                    "#f43f5e",
                  ],
                },
              ],
            }}
          />
        </Card>
        <Card className="bg-gray-800 text-white p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly User Signups</h3>
          <BarChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Signups",
                  data: [50, 75, 100, 125, 150, 200],
                  backgroundColor: "#3b82f6",
                },
              ],
            }}
          />
        </Card>
      </div>

      {/* Top Adventures and Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Adventures */}
        <Card className="bg-gray-800 text-white p-6">
          <h3 className="text-lg font-semibold mb-4">Top Adventures</h3>
          <ul className="space-y-3">
            {topAdventures.map((adventure, index) => (
              <li key={index} className="flex justify-between">
                <p>{adventure.name}</p>
                <p className="text-yellow-500">{adventure.rating} ★</p>
              </li>
            ))}
          </ul>
        </Card>

        {/* Notifications */}
        <Card className="bg-gray-800 text-white p-6">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <ul className="space-y-3">
            {notifications.map((notification, index) => (
              <li key={index} className="flex items-center gap-4">
                <notification.icon
                  className={`w-5 h-5 ${notification.color}`}
                />
                <p>{notification.message}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
