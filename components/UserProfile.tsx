
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Tab } from '../types';
import { Package, MapPin, CreditCard, Bell, Settings, LogOut, ChevronRight, Edit2, Save, Phone, Mail, Shield, Camera } from 'lucide-react';

interface UserProfileProps {
  onNavigate: (tab: Tab) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const { customer, updateCustomer, order } = useData();
  const [isEditing, setIsEditing] = useState(false);

  const handleAddressChange = (index: number, value: string) => {
    const newAddr = [...customer.address];
    newAddr[index] = value;
    updateCustomer({ ...customer, address: newAddr });
  };

  const EditableInput = ({ value, onChange, label, className = "" }: any) => (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors ${className}`}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
         
         <div className="relative flex flex-col items-center gap-3">
            <div className="relative">
                <img 
                    src={customer.avatarUrl} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
                />
                {!isEditing && (
                    <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                )}
            </div>
            
            {isEditing && (
                <div className="w-full max-w-[150px]">
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                            <Camera className="w-3 h-3 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={customer.avatarUrl}
                            onChange={(e) => updateCustomer({...customer, avatarUrl: e.target.value})}
                            placeholder="Image URL"
                            className="block w-full p-1.5 pl-7 text-xs text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        />
                     </div>
                     <p className="text-[10px] text-gray-400 text-center mt-1">Paste image URL</p>
                </div>
            )}
         </div>
         
         <div className="text-center md:text-left flex-1 w-full">
            {isEditing ? (
                <div className="grid gap-4 max-w-lg">
                    <EditableInput 
                        label="Full Name"
                        value={customer.name} 
                        onChange={(v: string) => updateCustomer({...customer, name: v})}
                        className="font-bold text-lg"
                    />
                    <EditableInput 
                        label="Email Address"
                        value={customer.email} 
                        onChange={(v: string) => updateCustomer({...customer, email: v})}
                    />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{customer.name}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {customer.email}</span>
                        <span className="hidden md:inline">•</span>
                        <span>Customer #{customer.id}</span>
                    </div>
                </>
            )}
         </div>

         <div className="flex flex-col sm:flex-row gap-3">
             {isEditing ? (
                 <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 hover:shadow-md transition-all shadow-sm"
                 >
                    <Save className="w-4 h-4" /> Save Changes
                 </button>
             ) : (
                 <>
                    <button 
                        onClick={() => onNavigate(Tab.SETTINGS)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md transition-all shadow-sm"
                    >
                        <Settings className="w-4 h-4" /> Account Settings
                    </button>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                    >
                        <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                 </>
             )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Stats Cards */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Package className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Active Order</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">#{order.orderNumber}</p>
            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {order.status}
            </span>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Total Spent</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">£{order.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Lifetime value</p>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Updates</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500 mt-1">Unread notifications</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline">View all history</button>
            </div>
            <div className="divide-y divide-gray-100 flex-1">
                <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition group cursor-pointer">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                            <Package className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{order.items[0]?.description || 'Order Item'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                <span>Order #{order.orderNumber}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{order.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                </div>
                {/* Mock older order */}
                <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition group cursor-pointer opacity-60 hover:opacity-100">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <Package className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Velvet Throw Pillows (Set of 2)</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                <span>Order #2024-892</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>12/08/2024</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Delivered</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Address Book */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Contact Details</h3>
                {isEditing && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">EDITING</span>}
            </div>
            <div className="p-6 flex-1 space-y-6">
                
                {/* Phone Section */}
                <div>
                     <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        <Phone className="w-4 h-4 text-indigo-500" /> Phone Number
                     </div>
                     {isEditing ? (
                         <EditableInput 
                            value={customer.phone} 
                            onChange={(v: string) => updateCustomer({...customer, phone: v})}
                         />
                     ) : (
                         <p className="text-gray-700 pl-6">{customer.phone}</p>
                     )}
                </div>

                {/* Address Section */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        <MapPin className="w-4 h-4 text-indigo-500" /> Delivery Address
                    </div>
                    
                    <div className="pl-6">
                        {isEditing ? (
                             <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                {customer.address.map((line, i) => (
                                    <input
                                        key={i}
                                        value={line}
                                        onChange={(e) => handleAddressChange(i, e.target.value)}
                                        placeholder={`Address Line ${i + 1}`}
                                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                ))}
                             </div>
                        ) : (
                            <div className="space-y-1">
                                {customer.address.map((line, i) => (
                                    <p key={i} className="text-gray-700">{line}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!isEditing && (
                 <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <Settings className="w-4 h-4" /> Manage Details
                    </button>
                </div>
            )}
             <div className="p-4 border-t border-gray-100">
                 <button className="w-full flex items-center justify-center gap-2 text-red-600 text-sm font-medium hover:text-red-700 py-2 hover:bg-red-50 rounded-lg transition-colors">
                     <LogOut className="w-4 h-4" /> Sign Out
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
