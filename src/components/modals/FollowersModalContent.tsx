import React, { useState } from 'react';
import { Search } from 'lucide-react';
import GlobalInput from '../inputs/GlobalInput';
import FollowCard from '../cards/FollowCard';
import Avatar from "@/assets/svgs/boy-avatar.svg";

const FollowersModalContent = () => {

  const [search, setSearch] = useState("");

  const [followers, setFollowers] = useState([
    { id: 1, name: "Rasib Malik", data: "Followed by Nashit Malik + 6 others", imgSrc: Avatar, isFollowing: false },
    { id: 2, name: "Nashit Khan", data: "Followed by Ali Raza + 2 others", imgSrc: Avatar, isFollowing: false },
    { id: 3, name: "Saeed Ahmad", data: "Followed by Farhan Malik + 3 others", imgSrc: Avatar, isFollowing: false },
    { id: 4, name: "Hassan Ali", data: "Followed by Umair Tariq + 1 other", imgSrc: Avatar, isFollowing: false },
    { id: 5, name: "Bilal Sheikh", data: "Followed by Ahmad Khan + 4 others", imgSrc: Avatar, isFollowing: false },
    { id: 6, name: "Usman Tariq", data: "Followed by Danish Ali + 3 others", imgSrc: Avatar, isFollowing: false },
    { id: 7, name: "Zain Rehman", data: "Followed by Imran Khan + 5 others", imgSrc: Avatar, isFollowing: false },
    { id: 8, name: "Hamza Yasin", data: "Followed by Shahzad Ali + 3 others", imgSrc: Avatar, isFollowing: false },
    { id: 9, name: "Ahsan Javed", data: "Followed by Moiz Ahmed + 6 others", imgSrc: Avatar, isFollowing: false },
    { id: 10, name: "Moiz Ahmed", data: "Followed by Ahsan Javed + 2 others", imgSrc: Avatar, isFollowing: false },
  ]);


  const handleToggleFollow = (id: number) => {
    setFollowers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const filteredList = followers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className='relative w-full mb-4'>
        <Search size={18} className='absolute top-3 left-3 text-gray-500' />
        <GlobalInput
          placeholder='Search Followers...'
          height='42px'
          width='100%'
          borderRadius='100px'
          inputClassName="pl-10"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3 h-[65vh] overflow-y-auto scrollbar-hide">
        {filteredList.length > 0 ? (
          filteredList.map((user) => (
            <FollowCard
              key={user.id}
              name={user.name}
              data={user.data}
              imgSrc={user.imgSrc}
              btnTitle={user.isFollowing ? "Following" : "Follow"}
              onClickBtn={() => handleToggleFollow(user.id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No results found</p>
        )}
      </div>
    </div>
  );
};

export default FollowersModalContent;
