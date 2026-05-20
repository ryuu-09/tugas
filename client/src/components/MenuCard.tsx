import { MenuItem } from '@/types';
import { formatRupiah } from '@/utils/formatting';

interface MenuCardProps {
  item: MenuItem;
  gradientClass: string;
  index: number;
  onAddClick: (item: MenuItem) => void;
}

export const MenuCard = ({ item, gradientClass, index, onAddClick }: MenuCardProps) => {
  return (
    <div
      className={`${gradientClass} glass-card p-6 rounded-[24px] hover:-translate-y-1 transition-all duration-250 pop-in`}
      style={{
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl">{item.emoji}</span>
        <button
          onClick={() => onAddClick(item)}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-pink to-purple text-white flex items-center justify-center font-bold hover:shadow-lg transition-all duration-250 hover:scale-110"
        >
          +
        </button>
      </div>

      <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
      <p className="text-xs text-gray-600 mb-3">{item.description}</p>

      <div className="text-lg font-bold text-pink">
        {formatRupiah(item.price)}
      </div>
    </div>
  );
};
