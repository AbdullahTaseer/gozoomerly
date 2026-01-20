'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import StatusCard from '@/components/cards/StatusCard';
import ConnectionCard from '@/components/cards/ConnectionCard';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import GlobalInput from '@/components/inputs/GlobalInput';
import MobileHeader from '@/components/navbar/MobileHeader';
import DashNavbar from '@/components/navbar/DashNavbar';
import GlobalModal from '@/components/modals/GlobalModal';
import YourCirclesModal from '@/components/modals/YourCirclesModal';
import AddCircleModal from '@/components/modals/AddCircleModal';
import AddStatusModal from '@/components/modals/AddStatusModal';
import StoryViewerModal from '@/components/modals/StoryViewerModal';
import { inviteContacts } from '@/lib/MockData';
import { authService } from '@/lib/supabase/auth';
import { getFollowers, getFollowing, followUser } from '@/lib/supabase/followUtils';
import { getUserCircles, getCircleMembers, addCircleMember, CircleWithDetails } from '@/lib/supabase/circles';
import { uploadStoryMedia, createStory, getStoriesGroupedByUser, Story } from '@/lib/supabase/stories';
import toast from 'react-hot-toast';

interface Connection {
  id: string;
  profileId: string;
  name: string;
  username: string;
  avatar?: string;
  status: 'follow' | 'following';
  user: any;
}

const Connections = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState<CircleWithDetails[]>([]);
  const [circleMembers, setCircleMembers] = useState<Record<string, string[]>>({});
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [circlesModalVisible, setCirclesModalVisible] = useState(false);
  const [createCircleModalVisible, setCreateCircleModalVisible] = useState(false);
  const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Connection | null>(null);
  const [stories, setStories] = useState<{ user: Story['user']; stories: Story[]; hasUnviewed: boolean }[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [selectedStoryGroupIndex, setSelectedStoryGroupIndex] = useState(0);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchCircles();
      fetchFollowers();
      fetchFollowing();
      fetchStories();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (selectedFilter !== 'All' && currentUser?.id) {
      fetchCircleMembers(selectedFilter);
    }
  }, [selectedFilter, currentUser?.id]);

  const fetchCurrentUser = async () => {
    const user = await authService.getUser();
    if (!user) {
      router.push('/signin');
      return;
    }
    setCurrentUser(user);
  };

  const fetchCircles = async () => {
    if (!currentUser?.id) return;
    try {
      const { data, error } = await getUserCircles(currentUser.id);
      if (error) {
        console.error('Error fetching circles:', error);
        setCircles([]);
      } else {
        setCircles(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCircles([]);
    }
  };

  const fetchCircleMembers = async (circleId: string) => {
    if (circleMembers[circleId]) {
      return;
    }

    try {
      const { data, error } = await getCircleMembers(circleId, 1000, 0);
      if (error) {
        console.error('Error fetching circle members:', error);
        return;
      }

      const memberIds = (data || []).map((member: any) => member?.member_user_id || member?.user_id).filter(Boolean);
      setCircleMembers((prev) => ({
        ...prev,
        [circleId]: memberIds,
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchFollowers = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await getFollowers(currentUser.id);
      setFollowersList(data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
      setFollowersList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await getFollowing(currentUser.id);
      setFollowingList(data || []);
    } catch (error) {
      console.error('Error fetching following:', error);
      setFollowingList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    if (!currentUser?.id) return;
    setStoriesLoading(true);
    try {
      const { data, error } = await getStoriesGroupedByUser(currentUser.id);
      if (error) {
        console.error('Error fetching stories:', error);
        setStories([]);
      } else {
        setStories(data || []);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  const combinedConnections = useMemo(() => {
    const followerData =
      followersList?.map((item) => {
        return {
          id: `follower-${item.follow_id || item.user_id}`,
          profileId: item.user_id,
          name: item.name || 'Unknown user',
          username: item.email ? `@${item.email.split('@')[0]}` : '',
          avatar: item.profile_pic_url || item.profile_pic,
          status: 'follow' as const,
          user: item,
        };
      }) || [];

    const followingData =
      followingList?.map((item) => {
        return {
          id: `following-${item.follow_id || item.user_id}`,
          profileId: item.user_id,
          name: item.name || 'Unknown user',
          username: item.email ? `@${item.email.split('@')[0]}` : '',
          avatar: item.profile_pic_url || item.profile_pic,
          status: 'following' as const,
          user: item,
        };
      }) || [];

    const mergedMap = new Map<string, Connection>();

    [...followerData, ...followingData].forEach((connection) => {
      const existing = mergedMap.get(connection.profileId);
      if (existing) {
        mergedMap.set(connection.profileId, {
          ...existing,
          status: 'following',
          user: connection.user || existing.user,
        });
      } else {
        mergedMap.set(connection.profileId, connection);
      }
    });

    let list = Array.from(mergedMap.values());

    // Filter by selected circle
    if (selectedFilter !== 'All' && circleMembers[selectedFilter]) {
      const memberIds = circleMembers[selectedFilter];
      list = list.filter((item) => memberIds.includes(item.profileId));
    }

    // Filter by search query
    const q = searchValue.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => {
        const name = item?.name?.toLowerCase() || '';
        const username = item?.username?.toLowerCase() || '';
        return name.includes(q) || username.includes(q);
      });
    }

    return list;
  }, [followersList, followingList, searchValue, selectedFilter, circleMembers]);

  const storiesData = useMemo(() => {
    // Separate user's own stories from others
    const userStoriesIndex = stories.findIndex(
      (group) => group.user?.id === currentUser?.id
    );
    const userStories = userStoriesIndex >= 0 ? stories[userStoriesIndex] : null;
    const otherStories = stories.filter((_, index) => index !== userStoriesIndex);

    // Type for story display items
    type StoryDisplayItem = {
      id: string;
      name?: string;
      isAdd: boolean;
      avatar: string;
      backgroundImage?: string;
      hasUnviewed: boolean;
      stories: Story[];
      storyGroupIndex?: number;
    };

    // Convert other users' stories to display format
    const otherStoryItems: StoryDisplayItem[] = otherStories.map((storyGroup) => ({
      id: `story-${storyGroup.user?.id}`,
      name: storyGroup.user?.name || 'Friend',
      avatar: storyGroup.user?.profile_pic_url || ProfileAvatar,
      backgroundImage: storyGroup.stories[0]?.media?.cdn_url || storyGroup.user?.profile_pic_url || ProfileAvatar,
      isAdd: false,
      hasUnviewed: storyGroup.hasUnviewed,
      stories: storyGroup.stories,
      storyGroupIndex: stories.findIndex(s => s.user?.id === storyGroup.user?.id),
    }));

    // Build the display array: Add status first, then user's own story (if exists), then others
    const displayItems: StoryDisplayItem[] = [
      {
        id: 'add',
        name: 'Add status',
        isAdd: true,
        avatar: currentUser?.user_metadata?.avatar_url || ProfileAvatar,
        backgroundImage: undefined,
        hasUnviewed: false,
        stories: [],
      },
    ];

    // Add user's own story card if they have stories
    if (userStories && userStoriesIndex >= 0 && userStories.stories.length > 0) {
      displayItems.push({
        id: `story-${userStories.user?.id}`,
        name: userStories.user?.name || 'Your Story',
        avatar: userStories.user?.profile_pic_url || currentUser?.user_metadata?.avatar_url || ProfileAvatar,
        backgroundImage: userStories.stories[0]?.media?.cdn_url || userStories.user?.profile_pic_url || ProfileAvatar,
        isAdd: false,
        hasUnviewed: false, // User's own stories are always "viewed"
        stories: userStories.stories,
        storyGroupIndex: userStoriesIndex,
      });
    }

    // Add other users' stories
    displayItems.push(...otherStoryItems);

    return displayItems;
  }, [stories, currentUser]);

  const handleFollowToggle = (connection: Connection) => {
    if (connection.status === 'following') {
      return;
    }
    setSelectedUser(connection);
    setCirclesModalVisible(true);
  };

  const handleCircleSelect = async (circle: CircleWithDetails) => {
    if (!selectedUser || !currentUser?.id) return;

    try {
      setLoading(true);
      const { error: circleError } = await addCircleMember(
        circle.id,
        selectedUser.profileId
      );

      if (circleError) {
        console.error('Error adding to circle:', circleError);
        alert('Error adding user to circle: ' + circleError.message);
        setLoading(false);
        return;
      }

      const { success, error: followError } = await followUser(
        currentUser.id,
        selectedUser.profileId
      );

      if (!success || followError) {
        console.error('Error following user:', followError);
        const errorMsg = typeof followError === 'string' ? followError : (followError as any)?.message || 'Unknown error';
        alert('Error following user: ' + errorMsg);
      } else {
        fetchFollowers();
        fetchFollowing();
        if (selectedFilter !== 'All') {
          fetchCircleMembers(selectedFilter);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to follow user');
    } finally {
      setLoading(false);
      setSelectedUser(null);
    }
  };

  const handleCreateNewCircle = () => {
    setCreateCircleModalVisible(true);
  };

  const handleCircleCreated = () => {
    setCreateCircleModalVisible(false);
    if (currentUser?.id) {
      fetchCircles();
    }
  };

  const handleChatClick = async (connection: Connection) => {
    if (!currentUser?.id) return;
    
    // Navigate to chat page with userId - the chat page will handle creating/opening the conversation
    router.push(`/dashboard/chat?userId=${connection.profileId}`);
  };

  const handleCardClick = (connection: Connection) => {
    // Only open conversation if user is following
    if (connection.status === 'following') {
      handleChatClick(connection);
    }
  };

  const handleInvite = (contact: { name: string; phone: string }) => {
    console.log('Inviting contact:', contact);
    alert(`Invite sent to ${contact.name} at ${contact.phone}`);
  };

  const handleAddStatus = () => {
    setAddStatusModalVisible(true);
  };

  const handleStatusImageSelect = (imageUrl: string | any) => {
    console.log('Status image selected:', imageUrl);
  };

  const handleStoryCreate = async (file: File, caption: string) => {
    if (!currentUser?.id) {
      toast.error('Please sign in to create a story');
      return;
    }

    try {
      // Upload the media file and create media record
      const { mediaId, error: uploadError } = await uploadStoryMedia(currentUser.id, file);

      if (uploadError || !mediaId) {
        toast.error('Failed to upload story media');
        console.error('Upload error:', uploadError);
        return;
      }

      // Determine content type
      const contentType = file.type.startsWith('video/') ? 'video' : 'image';

      // Create the story
      const { data: story, error: createError } = await createStory(currentUser.id, {
        content_type: contentType,
        media_id: mediaId,
        caption: caption || undefined,
      });

      if (createError || !story) {
        toast.error('Failed to create story');
        console.error('Create error:', createError);
        return;
      }

      toast.success('Story created successfully!');
      // Refresh stories list
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story');
    }
  };

  const handleStatusClick = (name?: string, storyGroupIndex?: number, isUserStory?: boolean) => {
    // If it's the user's own story, open viewer
    if (isUserStory && storyGroupIndex !== undefined && storyGroupIndex >= 0 && storyGroupIndex < stories.length) {
      setSelectedStoryGroupIndex(storyGroupIndex);
      setStoryViewerOpen(true);
      return;
    }

    // For other stories, use the provided index or find by name
    if (storyGroupIndex !== undefined && storyGroupIndex >= 0 && storyGroupIndex < stories.length) {
      setSelectedStoryGroupIndex(storyGroupIndex);
      setStoryViewerOpen(true);
    } else if (name) {
      // Fallback: find by name if index not provided
      const groupIndex = stories.findIndex(
        (group) => group.user?.name === name
      );
      if (groupIndex >= 0) {
        setSelectedStoryGroupIndex(groupIndex);
        setStoryViewerOpen(true);
      }
    }
  };

  const handleAddStatusClick = () => {
    // Check if user has stories
    const userStoryIndex = stories.findIndex(
      (group) => group.user?.id === currentUser?.id
    );
    
    if (userStoryIndex >= 0 && stories[userStoryIndex].stories.length > 0) {
      // User has stories, show them
      setSelectedStoryGroupIndex(userStoryIndex);
      setStoryViewerOpen(true);
    } else {
      // No stories, open add modal
      handleAddStatus();
    }
  };

  const filterOptions = useMemo(() => {
    return ['All', ...circles.map((circle) => circle.id)];
  }, [circles]);

  const getFilterDisplayName = (filterId: string) => {
    if (filterId === 'All') return 'All';
    const circle = circles.find((c) => c.id === filterId);
    return circle?.name || filterId;
  };

  return (
    <>
      <DashNavbar />
      <MobileHeader title="Connections" complexRightHref="/dashboard/home" complexRightTitle="Boards" />
      <div className='px-[7%] max-[769px]:px-4 pb-8'>
        {/* Status Cards */}
        <div className='mt-6'>
          <div className='flex gap-2 overflow-x-auto scrollbar-hide pb-2'>
            {storiesData.map((status, index) => {
              // Determine if this is the user's own story
              const isUserStory = !status.isAdd && status.id === `story-${currentUser?.id}`;
              // Get the story group index from the status object if available
              const storyGroupIndex = status.isAdd 
                ? undefined 
                : (status as any).storyGroupIndex !== undefined 
                  ? (status as any).storyGroupIndex 
                  : stories.findIndex(s => s.user?.id === currentUser?.id && isUserStory);

              return (
                <StatusCard
                  key={status.id}
                  type={status.isAdd ? 'add' : 'user'}
                  profileImage={status.avatar}
                  backgroundImage={status.isAdd ? undefined : status.backgroundImage}
                  name={status.isAdd ? undefined : status.name}
                  onClick={() =>
                    status.isAdd
                      ? handleAddStatusClick()
                      : handleStatusClick(status.name, storyGroupIndex, isUserStory)
                  }
                />
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className='my-6 max-[500px]:my-4 flex justify-between max-[660px]:flex-col-reverse gap-4 max-[660px]:items-center'>
          <div className='flex items-center justify-start max-[660px]:justify-center gap-3 max-[350px]:gap-1 w-full max-[430px]:justify-between overflow-x-auto scrollbar-hide pb-2'>
            {filterOptions.map((filterId) => (
              <button
                key={filterId}
                onClick={() => setSelectedFilter(filterId)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap shrink-0
                  ${
                    selectedFilter === filterId
                      ? 'bg-[#1B1D26] text-white'
                      : 'bg-white text-[#1B1D26] hover:bg-gray-100'
                  }`}
              >
                {getFilterDisplayName(filterId)}
              </button>
            ))}
          </div>
          <div className='relative w-[300px] max-[430px]:w-full'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput
              placeholder='Search connections...'
              height='42px'
              width='100%'
              borderRadius='100px'
              inputClassName="pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && combinedConnections.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4'></div>
            <p className='text-gray-500'>Loading connections...</p>
          </div>
        ) : combinedConnections.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>
              {searchValue
                ? `No connections found matching "${searchValue}"`
                : 'No connections yet'}
            </p>
          </div>
        ) : (
          <div className='space-y-4 mt-4'>
            {combinedConnections.map((connection) => (
              <ConnectionCard
                key={connection.id}
                profileImage={connection.avatar || ProfileAvatar}
                name={connection.name}
                username={connection.username}
                isFollowing={connection.status === 'following'}
                onCardClick={() => handleCardClick(connection)}
                onClick={() =>
                  connection.status === 'following'
                    ? handleChatClick(connection)
                    : handleFollowToggle(connection)
                }
                buttonText={connection.status === 'following' ? 'Chat' : 'Follow'}
              />
            ))}
          </div>
        )}

        {/* Invite to Zoiax Section */}
        {inviteContacts.length > 0 && (
          <div className='mt-8'>
            <h3 className="text-black text-lg font-semibold mb-4">Invite to Zoiax</h3>
            <div className='space-y-4'>
              {inviteContacts.map((contact) => (
                <ConnectionCard
                  key={contact.id}
                  profileImage={ProfileAvatar}
                  name={contact.name}
                  username={contact.phone}
                  isFollowing={false}
                  buttonText="Invite"
                  onClick={() => handleInvite(contact)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Your Circles Modal */}
      <GlobalModal
        title="Your Circles"
        isOpen={circlesModalVisible}
        onClose={() => {
          setCirclesModalVisible(false);
          setSelectedUser(null);
        }}
        className="w-[500px] max-[550px]:w-[95vw]"
      >
        <YourCirclesModal
          onCircleSelect={(circle) => {
            handleCircleSelect(circle);
            setCirclesModalVisible(false);
            setSelectedUser(null);
          }}
          onCreateNew={() => {
            setCirclesModalVisible(false);
            setSelectedUser(null);
            handleCreateNewCircle();
          }}
          userId={currentUser?.id || ''}
        />
      </GlobalModal>

      {/* Create Circle Modal */}
      <GlobalModal
        title="Create Circles"
        isOpen={createCircleModalVisible}
        onClose={() => setCreateCircleModalVisible(false)}
        className="w-[500px] max-[550px]:w-[95vw]"
      >
        <AddCircleModal
          onCircleCreated={handleCircleCreated}
        />
      </GlobalModal>

      {/* Add Status Modal */}
      <AddStatusModal
        isOpen={addStatusModalVisible}
        onClose={() => setAddStatusModalVisible(false)}
        onImageSelect={handleStatusImageSelect}
        onStoryCreate={handleStoryCreate}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal
        isOpen={storyViewerOpen}
        onClose={() => setStoryViewerOpen(false)}
        storyGroups={stories}
        initialGroupIndex={selectedStoryGroupIndex}
        currentUserId={currentUser?.id}
      />
    </>
  );
};

export default Connections;
