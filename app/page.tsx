'use client';

import { useState, useEffect, useMemo } from 'react';

interface AIApp {
  name: string;
  description: string;
  url: string;
  icon?: string;
  category: string;
}

type TabType = 'ai' | 'agent' | 'MCP';

interface Tab {
  id: TabType;
  label: string;
  category: string;
}

const tabs: Tab[] = [
  { id: 'ai', label: 'AI', category: 'ai' },
  { id: 'agent', label: 'エージェント', category: 'agent' },
  { id: 'MCP', label: 'MCP', category: 'MCP' },
];

export default function Home() {
  const [aiApps, setAiApps] = useState<AIApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [searchKeyword, setSearchKeyword] = useState('');

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

  const filteredApps = useMemo(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    let filtered = aiApps;
    
    // カテゴリーフィルター
    if (currentTab) {
      filtered = filtered.filter(app => app.category === currentTab.category);
    }
    
    // キーワード検索フィルター
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(keyword) ||
        app.description.toLowerCase().includes(keyword)
      );
    }
    
    return filtered;
  }, [aiApps, activeTab, searchKeyword]);

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
        <p className="text-center text-gray-600 mb-8">便利なAIツールをまとめて紹介</p>
        
        {/* 検索フィールド */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="アプリ名や説明文で検索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] text-gray-700 placeholder-gray-500 focus:outline-none focus:shadow-[inset_12px_12px_24px_#bebebe,inset_-12px_-12px_24px_#ffffff] transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
        
        {/* タブナビゲーション */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-100 rounded-2xl p-2 shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 mx-1 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gray-100 text-blue-600 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] transform scale-95'
                    : 'text-gray-600 hover:text-blue-500 hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApps.map((app, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(app.url)}
              className="group cursor-pointer"
            >
              <div className="bg-gray-100 rounded-3xl p-8 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] hover:shadow-[25px_25px_70px_#bebebe,-25px_-25px_70px_#ffffff] transform hover:-translate-y-1 transition-all duration-200 ease-out">
                <div className="text-center">
                  <div className="mb-4">
                    {app.icon ? (
                      <img 
                        src={app.icon} 
                        alt={`${app.name} icon`}
                        onError={handleImageError}
                        className="w-16 h-16 mx-auto object-contain group-hover:scale-105 transition-transform duration-200 ease-out"
                      />
                    ) : (
                      <img 
                        src="/no-image.png" 
                        alt="No image available"
                        className="w-16 h-16 mx-auto object-contain group-hover:scale-105 transition-transform duration-200 ease-out"
                      />
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {app.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200 ease-out">
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
