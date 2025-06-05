import React from 'react';
import { cn } from '@/lib/utils';

type TabOption = 'works' | 'services' | 'liked' | 'about';

interface TabsBarProps {
  activeTab: TabOption;
  onTabChange: (tab: TabOption) => void;
  viewingSelf?: boolean;
}

const TabsBar: React.FC<TabsBarProps> = ({
  activeTab,
  onTabChange,
  viewingSelf = false,
}) => {
  const tabs: { value: TabOption; label: string; selfOnly?: boolean }[] = [
    { value: 'works', label: 'Works' },
    { value: 'services', label: 'Services' },
    { value: 'liked', label: 'Liked' },
    { value: 'about', label: 'About' },
  ];

  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => {
            // Only show certain tabs when viewing own profile if needed
            if (tab.selfOnly && !viewingSelf) return null;
            
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "py-3 px-5 rounded-full text-sm font-medium mr-2 whitespace-nowrap transition-all",
                  activeTab === tab.value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                aria-current={activeTab === tab.value ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabsBar;