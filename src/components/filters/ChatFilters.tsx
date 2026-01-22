'use client';


interface ChatTabsProps {
  selectedTab: 'Connections' | 'Boards';
  onTabChange: (tab: 'Connections' | 'Boards') => void;
}

const ChatTabs: React.FC<ChatTabsProps> = ({
  selectedTab,
  onTabChange,
}) => {
  const tabs: ('Connections' | 'Boards')[] = ['Connections', 'Boards'];

  return (
    <div className='flex items-center justify-center gap-4 py-4'>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm border-b-2 text-black font-medium transition-colors relative
            ${
              selectedTab === tab
                ? 'border-black'
                : 'border-gray-300'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ChatTabs;

