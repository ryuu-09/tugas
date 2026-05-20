import { useEffect, useState } from 'react';
import { getCurrentTime } from '@/utils/formatting';
import { Menu, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentOrderNumber?: string;
}

export const Header = ({ currentTab, onTabChange, currentOrderNumber }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'kasir', label: 'Kasir', icon: '🛒' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/20">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink to-purple rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-pink/20">
              🍦
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black gradient-text tracking-tight">Dreamy Scoops</h1>
              <p className="hidden xs:block text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest">Ice Cream & Fruity Bar</p>
            </div>
          </div>

          {/* Right: Desktop Navigation & Info */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-white/40 p-1 rounded-2xl border border-white/20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                    ${
                      currentTab === tab.id
                        ? 'bg-gradient-to-r from-pink to-purple text-white shadow-md'
                        : 'text-gray-600 hover:bg-white/60'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {currentOrderNumber && (
                <div className="bg-gradient-to-r from-pink to-purple text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-pink/20">
                  #{currentOrderNumber}
                </div>
              )}
              
              <div className="hidden sm:flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-xl border border-white/20 text-gray-600">
                <Clock className="w-4 h-4 text-pink" />
                <span className="text-xs font-mono font-bold">{currentTime}</span>
              </div>

              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl font-bold transition-all
                    ${
                      currentTab === tab.id
                        ? 'bg-gradient-to-br from-pink to-purple text-white shadow-lg'
                        : 'bg-white/40 text-gray-600'
                    }
                  `}
                >
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 bg-white/20 py-3 rounded-xl">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-mono font-bold">{currentTime}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
