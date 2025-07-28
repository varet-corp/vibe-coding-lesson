'use client';

import { useState, useEffect } from 'react';

interface AIApp {
  name: string;
  description: string;
  url: string;
  icon?: string;
  category: string;
}

export default function Home() {
  const [aiApps, setAiApps] = useState<AIApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiTools = async () => {
      try {
        const response = await fetch('/api/ai-tools');
        if (!response.ok) {
          throw new Error('Failed to fetch AI tools data');
        }
        const data = await response.json();
        setAiApps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAiTools();
  }, []);

  const handleCardClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/no-image.png';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-xl text-red-600">エラー: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">AI アプリケーション一覧</h1>
        <p className="text-center text-gray-600 mb-12">便利なAIツールをまとめて紹介</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiApps.map((app, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(app.url)}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="bg-gray-100 rounded-3xl p-8 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] hover:shadow-[inset_20px_20px_60px_#bebebe,inset_-20px_-20px_60px_#ffffff] transition-all duration-300">
                <div className="text-center">
                  <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {app.icon ? (
                      <img 
                        src={app.icon} 
                        alt={`${app.name} icon`}
                        onError={handleImageError}
                        className="w-16 h-16 mx-auto object-contain"
                      />
                    ) : (
                      <img 
                        src="/no-image.png" 
                        alt="No image available"
                        className="w-16 h-16 mx-auto object-contain"
                      />
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {app.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {app.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
