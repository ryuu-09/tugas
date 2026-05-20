import { useState } from 'react';
import { MenuItem, Topping, IceLevel, SweetnessLevel } from '@/types';
import { formatRupiah } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toppings } from '@/data/menuData';

interface ToppingModalProps {
  item: MenuItem;
  onConfirm: (toppings: Topping[], iceLevel: IceLevel, sweetnessLevel: SweetnessLevel, allergens: string[], notes: string) => void;
  onCancel: () => void;
}

export const ToppingModal = ({ item, onConfirm, onCancel }: ToppingModalProps) => {
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [iceLevel, setIceLevel] = useState<IceLevel>('normal');
  const [sweetnessLevel, setSweetnessLevel] = useState<SweetnessLevel>('normal');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toppingPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = item.price + toppingPrice;

  const handleToppingToggle = (topping: Topping) => {
    setSelectedToppings(prev =>
      prev.find(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const handleAllergenToggle = (allergen: string) => {
    setAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedToppings, iceLevel, sweetnessLevel, allergens, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-2xl w-full my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <span className="text-4xl sm:text-5xl flex-shrink-0">{item.emoji}</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-lg font-bold text-pink mt-1">{formatRupiah(item.price)}</p>
          </div>
        </div>

        <div className="border-t border-pink/25 pt-6">
          {/* Toppings Section */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">🍨 Extra Toppings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {toppings.map(topping => (
                <button
                  key={topping.id}
                  onClick={() => handleToppingToggle(topping)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-250 text-left
                    ${
                      selectedToppings.find(t => t.id === topping.id)
                        ? 'border-pink bg-pink/10'
                        : 'border-gray-200 bg-white/50 hover:border-pink/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {topping.emoji} {topping.name}
                    </span>
                    {selectedToppings.find(t => t.id === topping.id) && (
                      <span className="text-pink font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">+{formatRupiah(topping.price)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">❄️ Ice Level</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(['normal', 'less', 'no'] as IceLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setIceLevel(level)}
                  className={`
                    px-3 sm:px-4 py-2 rounded-full font-semibold transition-all duration-250 text-sm sm:text-base
                    ${
                      iceLevel === level
                        ? 'bg-gradient-to-r from-blue to-mint text-white'
                        : 'bg-white/50 text-gray-700 hover:bg-white/75'
                    }
                  `}
                >
                  {level === 'normal' && 'Normal Ice'}
                  {level === 'less' && 'Less Ice'}
                  {level === 'no' && 'No Ice'}
                </button>
              ))}
            </div>
          </div>

          {/* Sweetness Level */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">🍯 Sweetness Level</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(['extra', 'normal', 'less', 'no'] as SweetnessLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setSweetnessLevel(level)}
                  className={`
                    px-3 sm:px-4 py-2 rounded-full font-semibold transition-all duration-250 text-sm sm:text-base
                    ${
                      sweetnessLevel === level
                        ? 'bg-gradient-to-r from-yellow to-peach text-white'
                        : 'bg-white/50 text-gray-700 hover:bg-white/75'
                    }
                  `}
                >
                  {level === 'extra' && 'Extra Sweet'}
                  {level === 'normal' && 'Normal'}
                  {level === 'less' && 'Less Sweet'}
                  {level === 'no' && 'No Sugar'}
                </button>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">⚠️ Allergen Warning</h3>
            <div className="space-y-2">
              {[
                { label: 'Contains Nuts', emoji: '🥜' },
                { label: 'Contains Dairy', emoji: '🥛' },
                { label: 'Contains Gluten', emoji: '🌾' },
              ].map(allergen => (
                <label key={allergen.label} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={allergens.includes(allergen.label)}
                    onCheckedChange={() => handleAllergenToggle(allergen.label)}
                  />
                  <span className="text-gray-700">{allergen.emoji} {allergen.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">📝 Catatan Khusus</h3>
            <Input
              placeholder="Contoh: less sweet, no ice, dll..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Price Preview */}
          <div className="bg-gradient-to-r from-pink/20 to-purple/20 p-4 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-gray-700 text-sm sm:text-base">
                Extra topping: <span className="font-bold">+{formatRupiah(toppingPrice)}</span>
              </span>
              <span className="text-base sm:text-lg font-bold text-pink">
                Total: {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 gradient-button text-white"
            >
              🛒 Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
