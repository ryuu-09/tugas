import { useState, useMemo } from 'react';
import { MenuItem } from '@/types';
import { MenuCard } from '@/components/MenuCard';
import { Input } from '@/components/ui/input';
import { iceCreamMenu, drinkMenu } from '@/data/menuData';
import { Search, SlidersHorizontal } from 'lucide-react';

interface MenuPanelProps {
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onMenuItemSelect: (item: MenuItem) => void;
}

const gradientClasses = [
  'menu-card-gradient-1',
  'menu-card-gradient-2',
  'menu-card-gradient-3',
  'menu-card-gradient-4',
  'menu-card-gradient-5',
  'menu-card-gradient-6',
  'menu-card-gradient-7',
  'menu-card-gradient-8',
  'menu-card-gradient-9',
  'menu-card-gradient-10',
];

export const MenuPanel = ({
  customerName,
  onCustomerNameChange,
  onMenuItemSelect,
}: MenuPanelProps) => {
  const [activeCategory, setActiveCategory] = useState<'ice-cream' | 'drink'>('ice-cream');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const baseItems = activeCategory === 'ice-cream' ? iceCreamMenu : drinkMenu;
    if (!searchQuery.trim()) return baseItems;
    
    const query = searchQuery.toLowerCase();
    return baseItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex p-1 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 w-fit">
            <button
              onClick={() => setActiveCategory('ice-cream')}
              className={`
                px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                ${
                  activeCategory === 'ice-cream'
                    ? 'bg-gradient-to-r from-pink to-pink/80 text-white shadow-md shadow-pink/20'
                    : 'text-gray-600 hover:bg-white/50'
                }
              `}
            >
              <span className="text-lg">🍦</span>
              <span className="hidden xs:inline">Es Krim</span>
            </button>
            <button
              onClick={() => setActiveCategory('drink')}
              className={`
                px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                ${
                  activeCategory === 'drink'
                    ? 'bg-gradient-to-r from-purple to-purple/80 text-white shadow-md shadow-purple/20'
                    : 'text-gray-600 hover:bg-white/50'
                }
              `}
            >
              <span className="text-lg">🥤</span>
              <span className="hidden xs:inline">Minuman</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari menu favoritmu..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-6 rounded-2xl border-none bg-white/60 backdrop-blur-sm focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative flex-1">
              <Input
                placeholder="✏️ Nama Pelanggan"
                value={customerName}
                onChange={e => onCustomerNameChange(e.target.value)}
                className="w-full rounded-xl border-pink/20 bg-white/40 focus:bg-white/80"
              />
           </div>
           <button className="p-2.5 rounded-xl bg-white/40 border border-pink/10 text-pink hover:bg-pink/10 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
            {filteredItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                gradientClass={gradientClasses[index % gradientClasses.length]}
                index={index}
                onAddClick={onMenuItemSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white/20 rounded-3xl border-2 border-dashed border-white/40">
            <Search className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">Menu tidak ditemukan</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-pink text-sm font-bold hover:underline"
            >
              Hapus pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
