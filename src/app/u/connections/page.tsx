'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import StatusCard from '@/components/cards/StatusCard';
import ConnectionCard from '@/components/cards/ConnectionCard';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-4.svg';
import GlobalInput from '@/components/inputs/GlobalInput';
import MobileHeader from '@/components/navbar/MobileHeader';
import DashNavbar from '@/components/navbar/DashNavbar';
import GlobalModal from '@/components/modals/GlobalModal';
import YourCirclesModal from '@/components/modals/YourCirclesModal';
import AddCircleModal from '@/components/modals/AddCircleModal';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import AddStatusModalContent from '@/components/modals/AddStatusModal';
import StoryViewerModalContent from '@/components/modals/StoryViewerModal';
import { useAddStatusSubmit } from '@/hooks/useAddStatusSubmit';
import { inviteContacts } from '@/lib/MockData';
import { authService } from '@/lib/supabase/auth';
import { getFollowers, getFollowing, followUser } from '@/lib/supabase/followUtils';
import { getUserCircles, getCircleMembers, addCircleMember, CircleWithDetails } from '@/lib/supabase/circles';
import { getStoriesGroupedByUser, Story } from '@/lib/supabase/stories';
import toast from 'react-hot-toast';
import GlobalButton from '@/components/buttons/GlobalButton';

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
  const [loading, setLoading] = useState(true);
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

  const fetchStories = useCallback(async () => {
    if (!currentUser?.id) return;
    setStoriesLoading(true);
    try {
      const { data, error } = await getStoriesGroupedByUser(currentUser.id);
      if (error) {
        setStories([]);
      } else {
        setStories(data || []);
      }
    } catch {
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  }, [currentUser?.id]);

  const onStorySubmitSuccess = useCallback(() => {
    void fetchStories();
  }, [fetchStories]);

  const { handleStatusImageSelect, handleStoryCreate, handleMultipleStoriesCreate } = useAddStatusSubmit({
    onSuccess: onStorySubmitSuccess,
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;
    fetchCircles();
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [followers, following] = await Promise.all([
          getFollowers(currentUser.id),
          getFollowing(currentUser.id),
        ]);
        if (!cancelled) {
          setFollowersList(followers || []);
          setFollowingList(following || []);
        }
      } catch {
        if (!cancelled) {
          setFollowersList([]);
          setFollowingList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    fetchStories();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, fetchStories]);

  useEffect(() => {
    if (selectedFilter !== 'All' && currentUser?.id) {
      fetchCircleMembers(selectedFilter);
    }
  }, [selectedFilter, currentUser?.id]);

  const fetchCurrentUser = async () => {
    const user = await authService.getUser();
    if (!user) {
      setLoading(false);
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
        setCircles([]);
      } else {
        setCircles(data || []);
      }
    } catch (error) {
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
        return;
      }

      const memberIds = (data || []).map((member: any) => member?.member_user_id || member?.user_id).filter(Boolean);
      setCircleMembers((prev) => ({
        ...prev,
        [circleId]: memberIds,
      }));
    } catch (error) {
    }
  };

  const fetchFollowers = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await getFollowers(currentUser.id);
      setFollowersList(data || []);
    } catch (error) {
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
      setFollowingList([]);
    } finally {
      setLoading(false);
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

    if (selectedFilter !== 'All' && circleMembers[selectedFilter]) {
      const memberIds = circleMembers[selectedFilter];
      list = list.filter((item) => memberIds.includes(item.profileId));
    }

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

    const userStoriesIndex = stories.findIndex(
      (group) => group.user?.id === currentUser?.id
    );
    const userStories = userStoriesIndex >= 0 ? stories[userStoriesIndex] : null;
    const otherStories = stories.filter((_, index) => index !== userStoriesIndex);

    type StoryDisplayItem = {
      id: string;
      name?: string;
      isAdd: boolean;
      avatar: string;
      backgroundImage?: string;
      backgroundVideo?: string;
      hasUnviewed: boolean;
      stories: Story[];
      storyGroupIndex?: number;
    };

    const otherStoryItems: StoryDisplayItem[] = otherStories.map((storyGroup) => {
      const latestStory = storyGroup.stories[0];
      const isVideoStory = latestStory?.content_type === 'video';
      return {
        id: `story-${storyGroup.user?.id}`,
        name: storyGroup.user?.name || 'Friend',
        avatar: storyGroup.user?.profile_pic_url || ProfileAvatar,
        backgroundImage: !isVideoStory
          ? latestStory?.media?.cdn_url || storyGroup.user?.profile_pic_url || ProfileAvatar
          : storyGroup.user?.profile_pic_url || ProfileAvatar,
        backgroundVideo: isVideoStory ? latestStory?.media?.cdn_url : undefined,
        isAdd: false,
        hasUnviewed: storyGroup.hasUnviewed,
        stories: storyGroup.stories,
        storyGroupIndex: stories.findIndex(s => s.user?.id === storyGroup.user?.id),
      };
    });

    const displayItems: StoryDisplayItem[] = [];

    // Add "Add status" button with user's status as background (like Instagram/WhatsApp)
    const latestUserStory = userStories?.stories?.[0];
    const userStatusBackground = userStories && userStories.stories.length > 0
      ? latestUserStory?.content_type === 'video'
        ? userStories.user?.profile_pic_url || ProfileAvatar
        : latestUserStory?.media?.cdn_url || userStories.user?.profile_pic_url || ProfileAvatar
      : undefined;
    const userStatusBackgroundVideo = latestUserStory?.content_type === 'video'
      ? latestUserStory?.media?.cdn_url
      : undefined;

    displayItems.push({
      id: 'add',
      name: 'Add status',
      isAdd: true,
      avatar: currentUser?.user_metadata?.avatar_url || ProfileAvatar,
      backgroundImage: userStatusBackground,
      backgroundVideo: userStatusBackgroundVideo,
      hasUnviewed: false,
      stories: userStories?.stories || [],
      storyGroupIndex: userStoriesIndex >= 0 ? userStoriesIndex : undefined,
    });

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
        alert('Error adding user to circle: ' + circleError.message);
        setLoading(false);
        return;
      }

      const { success, error: followError } = await followUser(
        currentUser.id,
        selectedUser.profileId
      );

      if (!success || followError) {
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

    router.push(`/u/chat?userId=${connection.profileId}`);
  };

  const handleCardClick = (connection: Connection) => {

    if (connection.status === 'following') {
      handleChatClick(connection);
    }
  };

  const handleInvite = (contact: { name: string; phone: string }) => {
    alert(`Invite sent to ${contact.name} at ${contact.phone}`);
  };

  const handleAddStatus = () => {
    setAddStatusModalVisible(true);
  };

  const handleStatusClick = (name?: string, storyGroupIndex?: number, isUserStory?: boolean) => {

    if (isUserStory && storyGroupIndex !== undefined && storyGroupIndex >= 0 && storyGroupIndex < stories.length) {
      setSelectedStoryGroupIndex(storyGroupIndex);
      setStoryViewerOpen(true);
      return;
    }

    if (storyGroupIndex !== undefined && storyGroupIndex >= 0 && storyGroupIndex < stories.length) {
      setSelectedStoryGroupIndex(storyGroupIndex);
      setStoryViewerOpen(true);
    } else if (name) {

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
    handleAddStatus();
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
      <MobileHeader title="Connections" className="justify-center" />
      <div className='px-[5%] max-[769px]:px-4 py-6'>
        <div className='flex justify-between items-center pb-6 max-[769px]:hidden'>
          <p className='text-[36px] text-black font-semibold'>Connections</p>
          <GlobalButton title='Contacts not on zoiax' width='183px' />
        </div>
        <div className='flex gap-2 overflow-x-auto scrollbar-hide pb-2'>
          {storiesData.map((status, index) => {
            const isUserStory = !status.isAdd && status.id === `story-${currentUser?.id}`;

            const storyGroupIndex = status.isAdd
              ? (status as any).storyGroupIndex !== undefined
                ? (status as any).storyGroupIndex
                : undefined
              : (status as any).storyGroupIndex !== undefined
                ? (status as any).storyGroupIndex
                : stories.findIndex(s => s.user?.id === currentUser?.id && isUserStory);

            return (
              <StatusCard
                key={status.id}
                type={status.isAdd ? 'add' : 'user'}
                profileImage={status.avatar}
                backgroundImage={status.backgroundImage}
                backgroundVideo={status.backgroundVideo}
                name={status.isAdd ? undefined : status.name}
                onClick={() => {
                  if (status.isAdd) {
                    if (status.stories && status.stories.length > 0 && storyGroupIndex !== undefined) {
                      handleStatusClick(status.name, storyGroupIndex, true);
                    }
                  } else {
                    handleStatusClick(status.name, storyGroupIndex, isUserStory);
                  }
                }}
                onAddClick={() => {
                  if (status.isAdd) {
                    handleAddStatusClick();
                  }
                }}
              />
            );
          })}
        </div>

        <div className='my-6 max-[500px]:my-4 flex justify-between max-[660px]:flex-col gap-4'>
          <div className='relative w-[300px] max-[660px]:w-full'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput
              placeholder='Search'
              height='42px'
              width='100%'
              borderRadius='100px'
              inputClassName="pl-10 border-[#EAEAEA]"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2'>
            <div className='hidden max-[769px]:block'>
              <GlobalButton title='Contacts not on zoiax' width='183px' />
            </div>
            {filterOptions.map((filterId) => (
              <button
                key={filterId}
                onClick={() => setSelectedFilter(filterId)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap shrink-0
                  ${selectedFilter === filterId
                    ? 'bg-[#1B1D26] text-white'
                    : 'bg-white text-[#1B1D26] hover:bg-gray-100'
                  }`}
              >
                {getFilterDisplayName(filterId)}
              </button>
            ))}
          </div>
        </div>

        <div className='max-w-[748px] mx-auto'>
          {!currentUser || (loading && combinedConnections.length === 0) ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4'></div>
              <p className='text-gray-500'>Loading connections...</p>
            </div>
          ) : combinedConnections.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500'>
                {searchValue
                  ? `No connections found matching "${searchValue}"`
                  : 'No connections found'}
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
        </div>

        {/* {inviteContacts.length > 0 && (
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
        )} */}
      </div>

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

      <ModalOrBottomSlider
        isOpen={addStatusModalVisible}
        onClose={() => setAddStatusModalVisible(false)}
        modalHeader={false}
        desktopClassName="max-w-md"
        contentClassName="px-4 pb-6"
      >
        <AddStatusModalContent
          isOpen={addStatusModalVisible}
          onClose={() => setAddStatusModalVisible(false)}
          onImageSelect={handleStatusImageSelect}
          onStoryCreate={handleStoryCreate}
          onMultipleStoriesCreate={handleMultipleStoriesCreate}
        />
      </ModalOrBottomSlider>

      <ModalOrBottomSlider
        isOpen={storyViewerOpen}
        onClose={() => setStoryViewerOpen(false)}
        modalHeader={false}
        className="!rounded-t-2xl"
        desktopClassName="!w-[min(1000px,96vw)]"
        contentClassName="!p-0"
      >
        <StoryViewerModalContent
          isOpen={storyViewerOpen}
          onClose={() => setStoryViewerOpen(false)}
          storyGroups={stories}
          initialGroupIndex={selectedStoryGroupIndex}
          currentUserId={currentUser?.id}
          onStoryDeleted={() => {
            if (currentUser?.id) {
              fetchStories();
            }
          }}
        />
      </ModalOrBottomSlider>
    </>
  );
};

export default Connections;
