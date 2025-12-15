
import React, { useState } from 'react';
import { Tab } from '../types';
import { Save, ArrowLeft, Lock, Bell, Shield, Smartphone, Mail, Check } from 'lucide-react';

interface AccountSettingsProps {
  onNavigate: (tab: Tab) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onNavigate }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock state for form fields
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotional: false,
    securityAlerts: true,
    sms: false
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const Toggle = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="pr-4">
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate(Tab.PROFILE)}
          className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
           <p className="text-gray-500 text-sm">Manage your security and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Lock className="w-5 h-5" />
             </div>
             <div>
                <h2 className="font-bold text-gray-900">Password & Security</h2>
                <p className="text-xs text-gray-500">Update your login credentials</p>
             </div>
          </div>
          <div className="p-6 space-y-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
             </div>
             <div className="pt-2">
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">Forgot password?</button>
             </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Bell className="w-5 h-5" />
             </div>
             <div>
                <h2 className="font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-xs text-gray-500">Choose how we contact you</p>
             </div>
          </div>
          <div className="p-6 flex-1">
             <Toggle 
                label="Order Updates" 
                description="Receive emails about your order status" 
                checked={notifications.orderUpdates}
                onChange={(v: boolean) => setNotifications({...notifications, orderUpdates: v})}
             />
             <Toggle 
                label="Promotional Emails" 
                description="Receive offers and newsletters" 
                checked={notifications.promotional}
                onChange={(v: boolean) => setNotifications({...notifications, promotional: v})}
             />
             <Toggle 
                label="SMS Notifications" 
                description="Get text messages for delivery updates" 
                checked={notifications.sms}
                onChange={(v: boolean) => setNotifications({...notifications, sms: v})}
             />
             <Toggle 
                label="Security Alerts" 
                description="Get notified about account activity" 
                checked={notifications.securityAlerts}
                onChange={(v: boolean) => setNotifications({...notifications, securityAlerts: v})}
             />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex justify-end items-center gap-4">
          {showSuccess && (
             <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-fade-in">
                <Check className="w-4 h-4" /> Changes saved successfully
             </span>
          )}
          <button 
             onClick={() => onNavigate(Tab.PROFILE)}
             className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
             Cancel
          </button>
          <button 
             onClick={handleSave}
             disabled={isSaving}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition-all ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 hover:shadow-md'}`}
          >
             {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
      </div>
    </div>
  );
};

export default AccountSettings;
