import { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export const CloudBackground = ({ enabled = true }: { enabled?: boolean }) => {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const generateClouds = () => {
      const cloudArray: Cloud[] = [];
      for (let i = 0; i < 12; i++) {
        cloudArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 15 + Math.random() * 15,
          size: 100 + Math.random() * 200,
          opacity: 0.1 + Math.random() * 0.2,
        });
      }
      setClouds(cloudArray);
    };

    generateClouds();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-blue-50 to-pink-50 -z-10">
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="absolute text-white pointer-events-none"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: `${cloud.size}px`,
            opacity: cloud.opacity,
            animation: `floatCloud ${cloud.duration}s ease-in-out infinite`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.007,0-0.013,0-0.02C11.662,13.484,11.337,13.5,11,13.5c-2.209,0-4-1.791-4-4 c0-2.197,1.782-3.979,3.978-3.999C11.458,4.048,12.651,3,14,3c2.209,0,4,1.791,4,4c0,0.11-0.005,0.218-0.013,0.326 C19.674,7.825,21,9.261,21,11C21,12.933,19.433,14.5,17.5,14.5c-0.172,0-0.341-0.013-0.506-0.039C16.997,14.474,17,14.487,17,14.5 c0,2.485,2.015,4.5,4.5,4.5c0.172,0,0.341-0.013,0.506-0.039C21.997,18.974,22,18.987,22,19c0,2.485-2.015,4.5-4.5,4.5 c-0.172,0-0.341-0.013-0.506-0.039C16.997,23.474,17,23.487,17,23.5C17,23.776,16.776,24,16.5,24h-9C7.224,24,7,23.776,7,23.5 c0-0.013,0.003-0.026,0.006-0.039C6.841,23.487,6.672,23.5,6.5,23.5C4.015,23.5,2,21.485,2,19c0-0.013,0.003-0.026,0.006-0.039 C1.841,18.987,1.672,19,1.5,19C0.672,19,0,18.328,0,17.5S0.672,16,1.5,16c0.172,0,0.341,0.013,0.506,0.039 C2.003,16.026,2,16.013,2,16c0-2.485,2.015-4.5,4.5-4.5c0.172,0,0.341,0.013,0.506,0.039C7.003,11.526,7,11.513,7,11.5 c0-0.276,0.224-0.5,0.5-0.5h9c0.276,0,0.5,0.224,0.5,0.5c0,0.013-0.003,0.026-0.006,0.039C17.159,11.513,17.328,11.5,17.5,11.5 c2.485,0,4.5,2.015,4.5,4.5c0,0.013-0.003,0.026-0.006,0.039C22.159,16.013,22.328,16,22.5,16c0.828,0,1.5,0.672,1.5,1.5 S23.328,19,22.5,19c-0.172,0-0.341-0.013-0.506-0.039C21.997,18.987,22,18.974,22,19z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes floatCloud {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -10px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
      `}</style>
    </div>
  );
};
