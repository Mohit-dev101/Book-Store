import React from 'react';

// Define a generic interface for our dashboard data structure
// <T> allows this interface to be reused for any type of module data
export interface DashboardData<T> {
  id: string | number;
  title: string;
  data: T;
  createdAt: Date;
}

// A specific type for user metrics
export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
}

// A specific type for sales metrics
export interface SalesMetrics {
  totalRevenue: number;
  itemsSold: number;
  conversionRate: number;
}

// Generic Props for the Dashboard Card
// By passing <T>, we ensure that the renderContent function accurately understands the type of data it will receive
interface DashboardCardProps<T> {
  moduleData: DashboardData<T>;
  renderContent: (data: T) => React.ReactNode;
}

// Generic Dashboard Card Component
function DashboardCard<T>({ moduleData, renderContent }: DashboardCardProps<T>) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-semibold text-gray-800">{moduleData.title}</h3>
        <span className="text-xs font-semibold py-1 px-3 bg-gray-100 text-gray-600 rounded-full">
          {moduleData.createdAt.toLocaleDateString()}
        </span>
      </div>
      <div className="w-full">
        {/* Render the generic data using the strongly-typed render function */}
        {renderContent(moduleData.data)}
      </div>
    </div>
  );
}

// The Main Dashboard Module putting everything together with Type-Safety
export default function ModuleDashboard() {
  
  // Here we explicitly define the type using our generic interface: DashboardData<UserMetrics>
  const userModuleData: DashboardData<UserMetrics> = {
    id: 1,
    title: "User Engagement",
    data: {
      totalUsers: 1542,
      activeUsers: 890,
      newSignups: 120
    },
    createdAt: new Date()
  };

  // Specific data for sales, using DashboardData<SalesMetrics>
  const salesModuleData: DashboardData<SalesMetrics> = {
    id: 2,
    title: "Weekly Sales",
    data: {
      totalRevenue: 25400,
      itemsSold: 345,
      conversionRate: 3.2
    },
    createdAt: new Date()
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
        Platform Overview Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rendering the User Module with specific generics */}
        <DashboardCard<UserMetrics> 
          moduleData={userModuleData}
          renderContent={(data) => (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                <span className="text-blue-700 font-medium">Total Users</span>
                <span className="text-blue-900 font-bold">{data.totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 hover:bg-green-100 transition-colors rounded-md">
                <span className="text-green-700 font-medium">Active Users</span>
                <span className="text-green-900 font-bold">{data.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 hover:bg-purple-100 transition-colors rounded-md">
                <span className="text-purple-700 font-medium">New Signups</span>
                <span className="text-purple-900 font-bold">+{data.newSignups}</span>
              </div>
            </div>
          )}
        />

        {/* Rendering the Sales Module with specific generics */}
        <DashboardCard<SalesMetrics>
          moduleData={salesModuleData}
          renderContent={(data) => (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-md">
                <span className="text-indigo-700 font-medium">Total Revenue</span>
                <span className="text-indigo-900 font-bold">${data.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-amber-50 hover:bg-amber-100 transition-colors rounded-md">
                <span className="text-amber-700 font-medium">Items Sold</span>
                <span className="text-amber-900 font-bold">{data.itemsSold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-md">
                <span className="text-emerald-700 font-medium">Conversion Rate</span>
                <span className="text-emerald-900 font-bold">{data.conversionRate}%</span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
