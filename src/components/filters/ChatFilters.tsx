'use client';

export type ChatTab = 'All' | 'One-to-One' | 'Group Chats' | 'Board Chats';

interface ChatTabsProps {
  selectedTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
}

const ChatTabs: React.FC<ChatTabsProps> = ({ selectedTab, onTabChange }) => {
  const tabs: ChatTab[] = ['All', 'One-to-One', 'Group Chats', 'Board Chats'];

  return (
    <div className="flex overflow-x-auto items-center scrollbar-hide gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors
            ${selectedTab === tab
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ChatTabs;