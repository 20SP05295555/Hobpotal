
import React, { useState } from 'react';
import { Tab } from './types';
import OrderConfirmation from './components/OrderConfirmation';
import Receipt from './components/Receipt';
import Invoice from './components/Invoice';
import EmailConversation from './components/EmailConversation';
import UserProfile from './components/UserProfile';
import AccountSettings from './components/AccountSettings';
import { FileText, Mail, User, CheckSquare, Menu, X, Settings, FileBox } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONFIRMATION);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CONFIRMATION:
        return <OrderConfirmation />;
      case Tab.INVOICE:
        return <Invoice />;
      case Tab.RECEIPT:
        return <Receipt />;
      case Tab.EMAIL:
        return <EmailConversation />;
      case Tab.PROFILE:
        return <UserProfile onNavigate={setActiveTab} />;
      case Tab.SETTINGS:
        return <AccountSettings onNavigate={setActiveTab} />;
      default:
        return <OrderConfirmation />;
    }
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
        activeTab === tab
          ? 'bg-gray-900 text-white shadow-md'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#f3f4f6]">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 z-10 print:hidden">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-2xl font-black tracking-tighter text-gray-900">HOB<span className="text-gray-400">.PORTAL</span></h1>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Documents</div>
          <NavItem tab={Tab.CONFIRMATION} label="Order Confirmation" icon={CheckSquare} />
          <NavItem tab={Tab.INVOICE} label="Invoice" icon={FileBox} />
          <NavItem tab={Tab.RECEIPT} label="Receipt" icon={FileText} />
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-4">Communication</div>
          <NavItem tab={Tab.EMAIL} label="Email Thread" icon={Mail} />
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-4">Account</div>
          <NavItem tab={Tab.PROFILE} label="User Profile" icon={User} />
          <NavItem tab={Tab.SETTINGS} label="Account Settings" icon={Settings} />
        </nav>
        <div className="p-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Need help?</p>
                <p className="text-sm font-bold text-gray-900">+44 1865 241971</p>
                <p className="text-xs text-gray-400">Mon-Fri 9am-5pm</p>
            </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white z-20 border-b border-gray-200 px-4 py-4 flex justify-between items-center shadow-sm print:hidden">
         <h1 className="text-xl font-black tracking-tighter text-gray-900">HOB<span className="text-gray-400">.PORTAL</span></h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-10 pt-20 px-6 space-y-4 print:hidden">
            <NavItem tab={Tab.CONFIRMATION} label="Order Confirmation" icon={CheckSquare} />
            <NavItem tab={Tab.INVOICE} label="Invoice" icon={FileBox} />
            <NavItem tab={Tab.RECEIPT} label="Receipt" icon={FileText} />
            <NavItem tab={Tab.EMAIL} label="Email Thread" icon={Mail} />
            <NavItem tab={Tab.PROFILE} label="User Profile" icon={User} />
            <NavItem tab={Tab.SETTINGS} label="Account Settings" icon={Settings} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 mt-16 lg:mt-0 overflow-y-auto min-h-screen print:ml-0 print:p-0 print:mt-0 print:h-auto print:overflow-visible">
        <div className="max-w-7xl mx-auto print:max-w-none">
             {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
