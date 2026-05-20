export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getCurrentTime = () => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
};

export const generateVANumber = (bank: string) => {
  const prefix = bank === 'BCA' ? '88000' : bank === 'Mandiri' ? '89000' : '87000';
  const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return prefix + random;
};

export const applyPromoCode = (subtotal: number, code: string, items: any[]) => {
  const upperCode = code.toUpperCase();
  if (upperCode === 'DREAMY20') {
    return { discount: Math.floor(subtotal * 0.2) };
  }
  if (upperCode === 'SCOOPS10') {
    return { discount: Math.floor(subtotal * 0.1) };
  }
  return { discount: 0 };
};

export const formatElapsedTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

export const generateOrderNumber = (type: string, count: number) => {
  const prefix = type === 'takeaway' ? 'T' : type === 'dine-in' ? 'D' : 'V';
  return `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
};
