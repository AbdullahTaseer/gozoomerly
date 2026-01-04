import SpotLightCard from '@/components/cards/SpotLightCard';
import TitleCard from '@/components/cards/TitleCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import { spotlightCampaigns } from '@/lib/MockData';
import React from 'react';

const SpotlightCampaigns = () => {
  return (
    <>
      <div className='py-8 px-[7%] max-[769px]:px-3'>
        <TitleCard title='Spotlight Campaigns' className='text-left' />
        <div className='flex mt-4 gap-6 max-[500px]:gap-4 overflow-x-auto scrollbar-hide h-full'>
          {spotlightCampaigns.map((campaign) => (
            <SpotLightCard
              key={campaign.id}
              name={campaign.name}
              description={campaign.description}
              spotLightImg={campaign.spotLightImg}
              participants={campaign.participants}
              wished={campaign.wished}
              supports={campaign.supports}
              memories={campaign.memories}
              chats={campaign.chats}
              raised={campaign.raised}
              target={campaign.target}
              organizerName={campaign.organizerName}
              organizerAvatar={campaign.organizerAvatar}
              organizerHometown={campaign.organizerHometown}
              topContributors={campaign.topContributors}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SpotlightCampaigns;

