

import Compaign_1 from "@/assets/svgs/compaign/compaign-1.svg";
import Compaign_2 from "@/assets/svgs/compaign/compaign-2.svg";
import Compaign_3 from "@/assets/svgs/compaign/compaign-3.svg";
import Compaign_4 from "@/assets/svgs/compaign/compaign-4.svg";
import Compaign_5 from "@/assets/svgs/compaign/compaign-5.svg";
import Compaign_6 from "@/assets/svgs/compaign/compaign-6.svg";
import Compaign_7 from "@/assets/svgs/compaign/compaign-7.svg";
import Compaign_8 from "@/assets/svgs/compaign/compaign-8.svg";
import Compaign_9 from "@/assets/svgs/compaign/compaign-9.svg";

export const compaignMainScreenData = [
  { imgSrc: Compaign_1, text: "Birthday", path: "/createBirthdayBoard" },
  { imgSrc: Compaign_2, text: "Eid Celebration" },
  { imgSrc: Compaign_3, text: "Wedding" },
  { imgSrc: Compaign_4, text: "Graduation" },
  { imgSrc: Compaign_5, text: "Baby Shower" },
  { imgSrc: Compaign_6, text: "Fundraiser" },
  { imgSrc: Compaign_7, text: "Anniversaries" },
  { imgSrc: Compaign_8, text: "Sports victories" },
  { imgSrc: Compaign_9, text: "Diwali" },
];

interface MusicItem {
  id: number;
  title: string;
  subtitle: string;
}

export const musicList: MusicItem[] = [
  { id: 1, title: "No Music", subtitle: "Keep it quiet and peaceful" },
  { id: 2, title: "Happy Birthday", subtitle: "Classic celebration tune" },
  { id: 3, title: "Upbeat Celebration", subtitle: "Energetic and fun vibes" },
  { id: 4, title: "Soft Ambient", subtitle: "Gentle background melody" },
  { id: 5, title: "No Music", subtitle: "Keep it quiet and peaceful" },
  { id: 6, title: "Happy Birthday", subtitle: "Classic celebration tune" },
  { id: 7, title: "Upbeat Celebration", subtitle: "Energetic and fun vibes" },
  { id: 8, title: "Soft Ambient", subtitle: "Gentle background melody" },
  { id: 9, title: "No Music", subtitle: "Keep it quiet and peaceful" },
  { id: 10, title: "Happy Birthday", subtitle: "Classic celebration tune" },
  { id: 11, title: "Upbeat Celebration", subtitle: "Energetic and fun vibes" },
  { id: 12, title: "Soft Ambient", subtitle: "Gentle background melody" },
];

import gift_one from "@/assets/svgs/gifts/gift-1.svg";
import gift_two from "@/assets/svgs/gifts/gift-2.svg";
import gift_three from "@/assets/svgs/gifts/gift-3.svg";
import gift_four from "@/assets/svgs/gifts/gift-4.svg";
import gift_five from "@/assets/svgs/gifts/gift-5.svg";
import gift_six from "@/assets/svgs/gifts/gift-6.svg";
import gift_seven from "@/assets/svgs/gifts/gift-7.svg";
import gift_eight from "@/assets/svgs/gifts/gift-8.svg";
import gift_nine from "@/assets/svgs/gifts/gift-9.svg";
import gift_ten from "@/assets/svgs/gifts/gift-10.svg";

export const giftsData = [
  { id: 1, label: "Cake Treat", price: 10, icon: gift_one },
  { id: 2, label: "Balloon Surprise", price: 20, icon: gift_two },
  { id: 3, label: "Coffee Date", price: 30, icon: gift_three },
  { id: 4, label: "Sweet Treat", price: 50, icon: gift_four },
  { id: 5, label: "Music Vibes", price: 75, icon: gift_five },
  { id: 6, label: "Spa Day", price: 150, icon: gift_six },
  { id: 7, label: "Movie Night", price: 200, icon: gift_seven },
  { id: 8, label: "Big Wish", price: 300, icon: gift_eight },
  { id: 9, label: "Boss Boost", price: 500, icon: gift_nine },
  { id: 10, label: "Dream Builder", price: 750, icon: gift_ten },
];

import Community_1_avatar from "@/assets/svgs/community-1.svg";
import Community_2_avatar from "@/assets/svgs/community-2.svg";
import Community_3_avatar from "@/assets/svgs/community-3.svg";
import Community_4_avatar from "@/assets/svgs/community-4.svg";

import BigWish from "@/assets/svgs/big-wish-icon.svg";
import bossBoost from "@/assets/svgs/boss-boost.svg";

export const homeBoardsSwiper = [
  {
    id: 1,
    avatar: Community_1_avatar,
    title: "Sean Parker birthday",
    name: "Sean Parker",
    location: "Miami, FL",
    date: "Sep 12,1988",
    description: "Let’s make Sean’s 40th unforgettable! Help him buy his dream guitar 🎸",
    fundTitle: "Goal Progress",
    target: 3000,
    raised: 1850,
    invited: 65,
    participants: 27,
    wishes: 27,
    gifters: 21,
    media: 92,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 2,
    avatar: Community_2_avatar,
    title: "Asha & David’s Wedding",
    name: "Asha & David’s",
    location: "New York, NY",
    date: "Sep 09,2025",
    description: "Celebrate Asha & David’s love! Share your moments here.",
    fundTitle: "Honeymoon Fund",
    target: 3000,
    raised: 1850,
    invited: 250,
    participants: 112,
    wishes: 112,
    gifters: 89,
    media: 500,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 3,
    avatar: Community_3_avatar,
    title: "Miami Summer Music",
    name: "Asha & David’s",
    location: "Miami, FL",
    date: "July 2025",
    description: "Fans from around the world! Share your festival experience here!",
    fundTitle: "Education Fund",
    target: 25000,
    raised: 32000,
    invited: 65,
    participants: 27,
    wishes: 27,
    gifters: 21,
    media: 92,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 4,
    avatar: Community_4_avatar,
    title: "Welcoming Baby Khan",
    name: "Baby Khan",
    location: "Chicago, IL",
    date: "May 10,2025",
    description: "Help us shower Baby Khan with love and blessings.",
    fundTitle: "Nursery Fund",
    target: 3000,
    raised: 2200,
    invited: 60,
    participants: 45,
    wishes: 45,
    gifters: 30,
    media: 180,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 5,
    avatar: Community_1_avatar,
    title: "College Graduation Bash",
    name: "Emily Johnson",
    location: "Los Angeles, CA",
    date: "June 20,2025",
    description: "Emily is graduating! Let’s make her party one to remember 🎉",
    fundTitle: "Celebration Fund",
    target: 5000,
    raised: 4200,
    invited: 150,
    participants: 80,
    wishes: 75,
    gifters: 60,
    media: 210,
    topContributors: [
      { label: "Big Wish", amount: 400, iconSrc: BigWish },
      { label: "Boss Boost", amount: 600, iconSrc: bossBoost },
    ],
  },
  {
    id: 6,
    avatar: Community_2_avatar,
    title: "Startup Launch Party",
    name: "TechNova Team",
    location: "San Francisco, CA",
    date: "Aug 15,2025",
    description: "Join us to celebrate TechNova’s big launch 🚀",
    fundTitle: "Innovation Fund",
    target: 10000,
    raised: 8500,
    invited: 300,
    participants: 180,
    wishes: 140,
    gifters: 120,
    media: 500,
    topContributors: [
      { label: "Big Wish", amount: 700, iconSrc: BigWish },
      { label: "Boss Boost", amount: 1000, iconSrc: bossBoost },
    ],
  },
  {
    id: 7,
    avatar: Community_2_avatar,
    title: "Startup Launch Party",
    name: "TechNova Team",
    location: "San Francisco, CA",
    date: "Aug 15,2025",
    description: "Join us to celebrate TechNova’s big launch 🚀",
    fundTitle: "Innovation Fund",
    target: 10000,
    raised: 8500,
    invited: 300,
    participants: 180,
    wishes: 140,
    gifters: 120,
    media: 500,
    topContributors: [
      { label: "Big Wish", amount: 700, iconSrc: BigWish },
      { label: "Boss Boost", amount: 1000, iconSrc: bossBoost },
    ],
  },
];

export const memoriesScreenData = [
  {
    id: 1,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    title: 'Random 2025',
    creatorName: 'Sean Parker',
    creatorAvatar: Community_1_avatar,
    timestamp: '12:34 am, Today',
    photosCount: 12,
    viewsCount: 13,
  },
  {
    id: 2,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    title: 'Trip to Dubai with friends',
    creatorName: 'Sean Parker',
    creatorAvatar: Community_1_avatar,
    timestamp: '12:34 am, Today',
    photosCount: 14,
    viewsCount: 17,
  },
  {
    id: 3,
    coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
    title: 'Wedding memories',
    creatorName: 'Asha & David',
    creatorAvatar: Community_2_avatar,
    timestamp: '2:15 pm, Yesterday',
    photosCount: 45,
    viewsCount: 89,
  },
];

export const shareScreenData = [
  {
    id: 2,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    title: 'Trip to Dubai with friends',
    sharedWith: { name: 'Jordan Mitchell', avatar: Community_1_avatar },
  },
];

export const paidTransactionsData = [
  {
    id: 1,
    amount: 250,
    recipientName: 'Alex Johnson',
    occasion: 'his birthday',
    date: 'Oct 15, 2025',
    boardTitle: 'Alex Johnson birthday',
    recipientDetails: 'Home Town : Miami, FL Birthday : Sep 12, 1988',
    recipientAvatar: Community_1_avatar,
    overlayColor: '#ef4444',
  },
  {
    id: 2,
    amount: 200,
    recipientName: 'Mia Thompson',
    occasion: 'her birthday',
    date: 'Nov 1, 2025',
    boardTitle: 'Mia Thompson birthday',
    recipientDetails: 'Home Town : Miami, FL Birthday : Sep 12, 1988',
    recipientAvatar: Community_2_avatar,
    overlayColor: '#22c55e',
  },
  {
    id: 3,
    amount: 20,
    recipientName: 'Liam Smith',
    occasion: 'his Christmas',
    date: 'Dec 5, 2025',
    boardTitle: 'Liam Smith Christmas board',
    recipientDetails: 'Home Town : Miami, FL',
    recipientAvatar: Community_1_avatar,
    overlayColor: '#ec4899',
  },
];

export const receivedTransactionsData = [
  {
    id: 1,
    amount: 150,
    senderName: 'Samantha Carter',
    occasion: 'birthday gift',
    date: 'Oct 20, 2025',
    boardTitle: 'Sean Parker birthday',
    recipientDetails: 'Home Town : Miami, FL Birthday : Sep 12, 1988',
    recipientAvatar: Community_1_avatar,
    overlayColor: '#8b5cf6',
  },
  {
    id: 2,
    amount: 75,
    senderName: 'Jordan Mitchell',
    occasion: 'wedding wishes',
    date: 'Nov 10, 2025',
    boardTitle: 'Asha & David\'s Wedding',
    recipientDetails: 'Home Town : New York, NY',
    recipientAvatar: Community_2_avatar,
    overlayColor: '#f59e0b',
  },
];

import How_Img1 from "@/assets/svgs/as-simple-as-wishing.svg";
import How_Img2 from "@/assets/svgs/as-simple-as-wishing-2.svg";
import How_Img3 from "@/assets/svgs/as-simple-as-wishing-3.svg";
import How_Img4 from "@/assets/svgs/as-simple-as-wishing-4.svg";
import How_Img5 from "@/assets/svgs/as-simple-as-wishing-5.svg";

export const steps = [
  { number: "01", title: "Create Your Board", desc: "Pick the event type and add the celebrated star.", img: How_Img1 },
  { number: "02", title: "Invite People", desc: "Share the link by SMS, email, or QR. Control privacy.", img: How_Img2 },
  { number: "03", title: "Collect Memories", desc: "Guests post wishes, media, and comments.", img: How_Img3 },
  { number: "04", title: "Wish + Gift", desc: "Contributors send meaningful gifts alongside their messages.", img: How_Img4 },
  { number: "05", title: "Celebrate & Relive", desc: "Surprise boards deliver on the big day; event boards stay live and collaborative.", img: How_Img5 },
];

import avatarListIcon_1 from "@/assets/svgs/avatar-list-icon-1.svg";
import avatarListIcon_2 from "@/assets/svgs/avatar-list-icon-2.svg";
import avatarListIcon_3 from "@/assets/svgs/avatar-list-icon-3.svg";
import avatarListIcon_4 from "@/assets/svgs/avatar-list-icon-4.svg";

export const avatarListData = [
  { imgPath: avatarListIcon_1, profileName: 'Taylor' },
  { imgPath: avatarListIcon_2, profileName: 'Jamie' },
  { imgPath: avatarListIcon_3, profileName: 'Zoya' },
  { imgPath: avatarListIcon_4, profileName: 'Ben' },
  { imgPath: avatarListIcon_1, profileName: 'Mia' },
  { imgPath: avatarListIcon_1, profileName: 'Leo' },
  { imgPath: avatarListIcon_4, profileName: 'Ava' },
  { imgPath: avatarListIcon_2, profileName: 'Ethan' },
  { imgPath: avatarListIcon_3, profileName: 'Chloe' },
  { imgPath: avatarListIcon_4, profileName: 'Mia' },
  { imgPath: avatarListIcon_1, profileName: 'Ethan' },
  { imgPath: avatarListIcon_2, profileName: 'Ben' },
  { imgPath: avatarListIcon_2, profileName: 'Taylor' },
  { imgPath: avatarListIcon_4, profileName: 'Leo' },
  { imgPath: avatarListIcon_3, profileName: 'Jamie' },
];

import SpotLightImg_1 from '@/assets/pngs/circle-1.png';
import SpotLightImg_2 from '@/assets/pngs/circle-2.png';

export const spotlightCampaigns = [
  {
    id: 1,
    name: 'Kim Kardashian',
    spotLightImg: SpotLightImg_1,
    description: "This year, we're making Kim's birthday unforgettable with impact. Join her campaign to support children's education. Your wishes and gifts will light up young lives.",
    participants: 27,
    wished: 27,
    supports: 21,
    memories: 92,
    chats: 92,
    raised: 1850,
    target: 3000,
    organizerName: 'Sean Parker',
    organizerAvatar: avatarListIcon_1,
    organizerHometown: 'Miami, FL',
    topContributors: [
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
    ],
  },
  {
    id: 2,
    name: 'Elon Musk',
    spotLightImg: SpotLightImg_2,
    description: "This year, we're making Elon Musk's birthday unforgettable with impact. Join his campaign to support children's education. Your wishes and gifts will light up young lives.",
    participants: 27,
    wished: 27,
    supports: 21,
    memories: 92,
    chats: 92,
    raised: 1850,
    target: 3000,
    organizerName: 'Sean Parker',
    organizerAvatar: avatarListIcon_2,
    organizerHometown: 'Miami, FL',
    topContributors: [
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
    ],
  },
  {
    id: 3,
    name: 'Kim Kardashian',
    spotLightImg: SpotLightImg_1,
    description: "This year, we're making Kim's birthday unforgettable with impact. Join her campaign to support children's education. Your wishes and gifts will light up young lives.",
    participants: 27,
    wished: 27,
    supports: 21,
    memories: 92,
    chats: 92,
    raised: 1850,
    target: 3000,
    organizerName: 'Sean Parker',
    organizerAvatar: avatarListIcon_3,
    organizerHometown: 'Miami, FL',
    topContributors: [
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
    ],
  },
  {
    id: 4,
    name: 'Elon Musk',
    spotLightImg: SpotLightImg_2,
    description: "This year, we're making Elon Musk's birthday unforgettable with impact. Join his campaign to support children's education. Your wishes and gifts will light up young lives.",
    participants: 27,
    wished: 27,
    supports: 21,
    memories: 92,
    chats: 92,
    raised: 1850,
    target: 3000,
    organizerName: 'Sean Parker',
    organizerAvatar: avatarListIcon_4,
    organizerHometown: 'Miami, FL',
    topContributors: [
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
    ],
  },
  {
    id: 5,
    name: 'Kim Kardashian',
    spotLightImg: SpotLightImg_1,
    description: "This year, we're making Kim's birthday unforgettable with impact. Join her campaign to support children's education. Your wishes and gifts will light up young lives.",
    participants: 27,
    wished: 27,
    supports: 21,
    memories: 92,
    chats: 92,
    raised: 1850,
    target: 3000,
    organizerName: 'Sean Parker',
    organizerAvatar: avatarListIcon_1,
    organizerHometown: 'Miami, FL',
    topContributors: [
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
    ],
  },
  {
    id: 6,
    name: 'Elon Musk',
    spotLightImg: SpotLightImg_2,
    description: "This year, we're making Elon Musk's birthday unforgettable with impact. Join his campaign to support children's education. Your wishes and gifts will light up young lives.",
    participants: 27,
    wished: 27,
    supports: 21,
    memories: 92,
    chats: 92,
    raised: 1850,
    target: 3000,
    organizerName: 'Sean Parker',
    organizerAvatar: avatarListIcon_2,
    organizerHometown: 'Miami, FL',
    topContributors: [
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
      avatarListIcon_1,
      avatarListIcon_2,
      avatarListIcon_3,
      avatarListIcon_4,
    ],
  },
];

import circleAvatar1 from '@/assets/svgs/circle-avatar-1.svg';
import circleAvatar2 from '@/assets/svgs/circle-avatar-2.svg';
import circleAvatar3 from '@/assets/svgs/circle-avatar-3.svg';
import FamilyBG from '@/assets/pngs/circle-1.png';
import FriendsBG from '@/assets/pngs/circle-2.png';
import TourBG from '@/assets/pngs/circle-3.png';
import WeedingBG from '@/assets/pngs/circle-4.png';

export const personalCircles = [
  {
    id: 1,
    title: 'Family Circles',
    backgroundImage: FamilyBG,
    avatars: [circleAvatar1, circleAvatar2, circleAvatar3],
    memberCount: 5,
  },
  {
    id: 2,
    title: 'Friends Circles',
    backgroundImage: FriendsBG,
    avatars: [circleAvatar2, circleAvatar1, circleAvatar1],
    memberCount: 17,
  },
  {
    id: 3,
    title: 'Tour Circles',
    backgroundImage: TourBG,
    avatars: [circleAvatar3, circleAvatar1, circleAvatar1],
    memberCount: 43,
  },
  {
    id: 4,
    title: 'Weeding Circles',
    backgroundImage: WeedingBG,
    avatars: [circleAvatar1, circleAvatar2, circleAvatar3],
    memberCount: 33,
  },
];

import chatAvatar_1 from "@/assets/svgs/chat-avatar-1.svg";
import chatAvatar_2 from "@/assets/svgs/chat-avatar-2.svg";
import chatAvatar_3 from "@/assets/svgs/chat-avatar-3.svg";
import chatAvatar_4 from "@/assets/svgs/chat-avatar-4.svg";
import chatAvatar_5 from "@/assets/svgs/chat-avatar-5.svg";

export const chatListData = [
  { id: 1, name: 'Family Circles', message: 'Have a nice day!', time: 'now', avatar: chatAvatar_1 },
  { id: 2, name: 'karennne', message: 'I heard this is a good movie, s...', time: '15m', avatar: chatAvatar_2 },
  { id: 3, name: 'joshua_l', message: 'Have a nice day, bro!', time: 'now', avatar: chatAvatar_3 },
  { id: 4, name: 'martini_rond', message: 'Have a nice day, bro!', time: '20m', avatar: chatAvatar_4 },
  { id: 5, name: 'andrewww', message: 'Sounds good 😎😎😎', time: '2h', avatar: chatAvatar_5 },
  { id: 6, name: 'kiero_d', message: 'The new design looks cool, b...', time: '3h', avatar: chatAvatar_1 },
  { id: 7, name: 'maxjacobson', message: 'Thank you, bro!', time: '3h', avatar: chatAvatar_2 },
  { id: 8, name: 'Family Circles', message: 'Have a nice day!', time: 'now', avatar: chatAvatar_1 },
  { id: 9, name: 'karennne', message: 'I heard this is a good movie, s...', time: '15m', avatar: chatAvatar_2 },
  { id: 10, name: 'joshua_l', message: 'Have a nice day, bro!', time: 'now', avatar: chatAvatar_3 },
  { id: 11, name: 'martini_rond', message: 'Have a nice day, bro!', time: '20m', avatar: chatAvatar_4 },
  { id: 12, name: 'andrewww', message: 'Sounds good 😎😎😎', time: '2h', avatar: chatAvatar_5 },
  { id: 13, name: 'kiero_d', message: 'The new design looks cool, b...', time: '3h', avatar: chatAvatar_1 },
  { id: 14, name: 'maxjacobson', message: 'Thank you, bro!', time: '3h', avatar: chatAvatar_2 },
];

export const invitationGradients = [
  'bg-gradient-to-br from-[#cf6c71]/80 to-[#d9777c]/60',
  'bg-gradient-to-br from-[#C03737]/60 to-[#F44274]/60',
  'bg-gradient-to-br from-[#71cf6c]/80 to-[#77d977]/60',
  'bg-gradient-to-br from-[#cfcf6c]/80 to-[#d9d977]/60',
  'bg-gradient-to-br from-[#cf6c9f]/80 to-[#d977a3]/60',
  'bg-gradient-to-br from-[#6ccf9f]/80 to-[#77d9a3]/60',
  'bg-gradient-to-br from-[#cf9f6c]/80 to-[#d9a377]/60',
  'bg-gradient-to-br from-[#9f6ccf]/80 to-[#a377d9]/60',
];

export const boardInvitations = [
  {
    id: 1,
    title: "Sofia & Omar's Wedding",
    backgroundImage: FamilyBG,
    profileImage: Community_2_avatar,
    inviterName: "Omar Hassan",
    gradientClass: invitationGradients[2],
  },
  {
    id: 2,
    title: "Asha & David's Wedding",
    backgroundImage: FamilyBG,
    profileImage: Community_2_avatar,
    inviterName: "David Smith",
    gradientClass: invitationGradients[0],
  },
  {
    id: 3,
    title: "Emily's Graduation Party",
    backgroundImage: FriendsBG,
    profileImage: Community_1_avatar,
    inviterName: "Emily Johnson",
    gradientClass: invitationGradients[1],
  },
  {
    id: 4,
    title: "Sofia & Omar's Wedding",
    backgroundImage: FamilyBG,
    profileImage: Community_2_avatar,
    inviterName: "Omar Hassan",
    gradientClass: invitationGradients[3],
  },
  {
    id: 5,
    title: "Asha & David's Wedding",
    backgroundImage: FamilyBG,
    profileImage: Community_2_avatar,
    inviterName: "David Smith",
    gradientClass: invitationGradients[4],
  },
  {
    id: 6,
    title: "Emily's Graduation Party",
    backgroundImage: FriendsBG,
    profileImage: Community_1_avatar,
    inviterName: "Emily Johnson",
    gradientClass: invitationGradients[5],
  },
];

export interface ExploreCardData {
  id: number;
  title: string;
  image: string;
  extraCount: number;
  heightVariant: 'tall' | 'medium' | 'short';
}

export const exploreCards: ExploreCardData[] = [
  { id: 1, title: 'Fashion show', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', extraCount: 10, heightVariant: 'tall' },
  { id: 2, title: 'Houses', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', extraCount: 10, heightVariant: 'medium' },
  { id: 3, title: 'Cooking', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', extraCount: 5, heightVariant: 'short' },
  { id: 4, title: 'kick boxing', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400', extraCount: 5, heightVariant: 'medium' },
  { id: 5, title: 'food', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', extraCount: 5, heightVariant: 'medium' },
  { id: 6, title: 'Cooking expert', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400', extraCount: 10, heightVariant: 'short' },
  { id: 7, title: 'Music', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', extraCount: 10, heightVariant: 'tall' },
  { id: 8, title: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', extraCount: 5, heightVariant: 'medium' },
  { id: 9, title: 'Dance show', image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400', extraCount: 10, heightVariant: 'medium' },
  { id: 10, title: 'Dance show', image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400', extraCount: 10, heightVariant: 'short' },
  { id: 11, title: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', extraCount: 10, heightVariant: 'medium' },
  { id: 12, title: 'Travel', image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400', extraCount: 5, heightVariant: 'short' },
  { id: 13, title: 'food', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', extraCount: 5, heightVariant: 'tall' },
  { id: 14, title: 'Cooking expert', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400', extraCount: 10, heightVariant: 'medium' },
  { id: 15, title: 'Music', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', extraCount: 10, heightVariant: 'short' },
  { id: 16, title: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', extraCount: 5, heightVariant: 'medium' },
  { id: 17, title: 'Photography', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400', extraCount: 12, heightVariant: 'short' },
  { id: 18, title: 'Art & Design', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', extraCount: 8, heightVariant: 'tall' },
  { id: 19, title: 'Fitness', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', extraCount: 15, heightVariant: 'medium' },
  { id: 20, title: 'Gardening', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', extraCount: 7, heightVariant: 'short' },
  { id: 21, title: 'Pets', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', extraCount: 9, heightVariant: 'medium' },
  { id: 22, title: 'Gaming', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400', extraCount: 18, heightVariant: 'tall' },
  { id: 23, title: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', extraCount: 6, heightVariant: 'medium' },
  { id: 24, title: 'Tech', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', extraCount: 14, heightVariant: 'short' },
  { id: 25, title: 'Nature', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', extraCount: 11, heightVariant: 'medium' },
  { id: 26, title: 'Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', extraCount: 8, heightVariant: 'tall' },
  { id: 27, title: 'Mountains', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', extraCount: 10, heightVariant: 'short' },
  { id: 28, title: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', extraCount: 7, heightVariant: 'medium' },
  { id: 29, title: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400', extraCount: 12, heightVariant: 'short' },
  { id: 30, title: 'Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', extraCount: 9, heightVariant: 'medium' },
  { id: 31, title: 'Coffee', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', extraCount: 6, heightVariant: 'tall' },
  { id: 32, title: 'Street style', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', extraCount: 13, heightVariant: 'medium' },
  { id: 33, title: 'Camping', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400', extraCount: 8, heightVariant: 'short' },
  { id: 34, title: 'Movies', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', extraCount: 11, heightVariant: 'medium' },
  { id: 35, title: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', extraCount: 16, heightVariant: 'tall' },
  { id: 36, title: 'Interior Design', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400', extraCount: 5, heightVariant: 'short' },
  { id: 37, title: 'Street food', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', extraCount: 9, heightVariant: 'medium' },
  { id: 38, title: 'Minimalism', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', extraCount: 7, heightVariant: 'short' },
  { id: 39, title: 'Vintage', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400', extraCount: 10, heightVariant: 'medium' },
  { id: 40, title: 'Sunset', image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400', extraCount: 14, heightVariant: 'tall' },
];

export const explorePlaceholderAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
];

export interface FeedCardData {
  id: number;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  layout: 'horizontal' | 'carousel';
  title: string;
  description: string;
  actionTag?: string;

  videoThumbnail?: string;
  videoUrl?: string;

  thumbnailImage?: string;
  mediaItems?: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }>;

  likes: number;
  comments: number;
  shares: number;
  memories: number;
}

export const feedCardData: FeedCardData[] = [
  {
    id: 1,
    userName: 'Samantha Carter',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    timestamp: '5 Minutes ago',
    layout: 'horizontal',
    title: "Sean Parker birthday",
    description: "Sean, you're the most deserving person I know. Here's to your dream trip",
    actionTag: "Gifted : $250",
    videoThumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    videoUrl: 'https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4',
    likes: 1,
    comments: 1,
    shares: 1,
    memories: 1,
  },
  {
    id: 2,
    userName: 'Priya K.',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    timestamp: '10 hours ago',
    layout: 'carousel',
    title: "Friends trip",
    description: "Packing joy, leaving stress. Here's to a trip of fun, jokes, and lasting memories.",
    thumbnailImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
    mediaItems: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
      },
      {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_30fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
      },
    ],
    likes: 1,
    comments: 1,
    shares: 1,
    memories: 1,
  },
  {
    id: 3,
    userName: 'Michael Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    timestamp: '2 hours ago',
    layout: 'horizontal',
    title: "Birthday celebration",
    description: "Celebrating another year of amazing adventures and great memories!",
    actionTag: "Gifted : $150",
    videoThumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    videoUrl: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4',
    likes: 24,
    comments: 8,
    shares: 5,
    memories: 12,
  },
  {
    id: 4,
    userName: 'Emma Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    timestamp: '1 day ago',
    layout: 'carousel',
    title: "Wedding memories",
    description: "The most beautiful day of our lives. Thank you to everyone who shared this moment with us!",
    thumbnailImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80',
    mediaItems: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      },
      {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_25fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      },
    ],
    likes: 89,
    comments: 23,
    shares: 15,
    memories: 45,
  },
  {
    id: 5,
    userName: 'David Rodriguez',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    timestamp: '3 hours ago',
    layout: 'horizontal',
    title: "Graduation day",
    description: "Four years of hard work paid off! So grateful for all the support along the way.",
    actionTag: "Gifted : $500",
    videoThumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    videoUrl: 'https://videos.pexels.com/video-files/3044147/3044147-hd_1920_1080_25fps.mp4',
    likes: 156,
    comments: 34,
    shares: 28,
    memories: 67,
  },
  {
    id: 6,
    userName: 'Sarah Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80',
    timestamp: '6 hours ago',
    layout: 'carousel',
    title: "Summer vacation",
    description: "Beach days, sunsets, and endless laughter. Best summer ever!",
    thumbnailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
    mediaItems: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&q=80',
      },
    ],
    likes: 42,
    comments: 12,
    shares: 9,
    memories: 31,
  },
  {
    id: 7,
    userName: 'James Anderson',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    timestamp: '12 hours ago',
    layout: 'horizontal',
    title: "New job celebration",
    description: "Starting a new chapter! Excited for what's ahead. Thanks for all the support!",
    actionTag: "Gifted : $100",
    videoThumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
    videoUrl: 'https://videos.pexels.com/video-files/3191555/3191555-hd_1920_1080_25fps.mp4',
    likes: 78,
    comments: 19,
    shares: 14,
    memories: 52,
  },
  {
    id: 8,
    userName: 'Lisa Park',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    timestamp: '4 hours ago',
    layout: 'carousel',
    title: "Music festival",
    description: "Amazing vibes, great music, and even better friends. Unforgettable weekend!",
    thumbnailImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80',
    mediaItems: [
      {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80',
      },
      {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_30fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      },
    ],
    likes: 203,
    comments: 45,
    shares: 32,
    memories: 128,
  },
  {
    id: 9,
    userName: 'Alex Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    timestamp: '8 hours ago',
    layout: 'horizontal',
    title: "Anniversary dinner",
    description: "Two years of happiness and counting. Here's to many more!",
    actionTag: "Gifted : $200",
    videoThumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    videoUrl: 'https://videos.pexels.com/video-files/3044147/3044147-hd_1920_1080_25fps.mp4',
    likes: 67,
    comments: 18,
    shares: 11,
    memories: 38,
  },
  {
    id: 10,
    userName: 'Maria Garcia',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    timestamp: '1 day ago',
    layout: 'carousel',
    title: "Food adventure",
    description: "Exploring new restaurants and cuisines. Food brings people together!",
    thumbnailImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
    mediaItems: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200&q=80',
      },
    ],
    likes: 124,
    comments: 28,
    shares: 19,
    memories: 73,
  },
];

export interface InviteContact {
  id: string;
  name: string;
  phone: string;
  profile_pic_url?: string;
}

export const inviteContacts: InviteContact[] = [
  {
    id: '1',
    name: 'Jordan',
    phone: '555-0123',
  },
  {
    id: '2',
    name: 'Anna',
    phone: '555-0123',
  },
  {
    id: '3',
    name: 'Jamie',
    phone: '555-0123',
  },
  {
    id: '4',
    name: 'Casey',
    phone: '555-0123',
  },
  {
    id: '5',
    name: 'Morgan',
    phone: '555-0123',
  },
];

import { StaticImageData } from 'next/image';
import PostCarousel1 from "@/assets/pngs/post-carousel-1.jpg";
import PostCarousel2 from "@/assets/pngs/posts-carsousel-2.jpg";
import Flowers from "@/assets/pngs/flowers.png";
import Circle1 from "@/assets/pngs/circle-1.png";
import Circle2 from "@/assets/pngs/circle-2.png";
import Circle3 from "@/assets/pngs/circle-3.png";
import Circle4 from "@/assets/pngs/circle-4.png";
import LiveBoardBg from "@/assets/pngs/live-board-bg.png";
import LiveBoardBoys from "@/assets/pngs/live-board-boys.png";
import SmallAnna from "@/assets/pngs/small-anna.png";
import Thumbnail from "@/assets/pngs/thumbnail.png";
import VideoThumbnail from "@/assets/pngs/video-thumbnail.png";
import SocialConnection from "@/assets/pngs/social-connection.png";
import DifferentBoard1 from "@/assets/pngs/different-board-1.png";
import DifferentBoard2 from "@/assets/pngs/different-board-2.png";

export const statusImages: (string | StaticImageData)[] = [
  PostCarousel1,
  PostCarousel2,
  Flowers,
  Circle1,
  Circle2,
  Circle3,
  Circle4,
  LiveBoardBg,
  LiveBoardBoys,
  SmallAnna,
  Thumbnail,
  VideoThumbnail,
  SocialConnection,
  DifferentBoard1,
  DifferentBoard2,
  PostCarousel1,
  PostCarousel2,
  Circle1,
];



// Country phone codes mapping
export const COUNTRY_PHONE_CODES: Record<string, string> = {
  US: "+1", CA: "+1", GB: "+44", AU: "+61", NZ: "+64",
  IN: "+91", PK: "+92", BD: "+880", LK: "+94", NP: "+977",
  AF: "+93", AE: "+971", SA: "+966", IQ: "+964", IR: "+98",
  IL: "+972", JO: "+962", LB: "+961", SY: "+963", TR: "+90",
  EG: "+20", ZA: "+27", NG: "+234", KE: "+254", ET: "+251",
  GH: "+233", TZ: "+255", UG: "+256", DZ: "+213", MA: "+212",
  TN: "+216", LY: "+218", SD: "+249", SO: "+252", DJ: "+253",
  ER: "+291", SS: "+211", CM: "+237", CD: "+243", CG: "+242",
  CF: "+236", TD: "+235", NE: "+227", ML: "+223", MR: "+222",
  SN: "+221", GM: "+220", GW: "+245", GN: "+224", SL: "+232",
  LR: "+231", CI: "+225", BF: "+226", BJ: "+229", TG: "+228",
  GA: "+241", GQ: "+240", ST: "+239", AO: "+244", ZM: "+260",
  ZW: "+263", BW: "+267", LS: "+266", SZ: "+268", MZ: "+258",
  MG: "+261", MU: "+230", SC: "+248", KM: "+269", YT: "+262",
  RE: "+262", BI: "+257", RW: "+250", MW: "+265", CV: "+238",
  CN: "+86", JP: "+81", KR: "+82", TH: "+66", VN: "+84",
  PH: "+63", ID: "+62", MY: "+60", SG: "+65", MM: "+95",
  KH: "+855", LA: "+856", BN: "+673", TL: "+670", MN: "+976",
  KZ: "+7", UZ: "+998", TJ: "+992", KG: "+996", TM: "+993",
  GE: "+995", AM: "+374", AZ: "+994", BY: "+375", MD: "+373",
  UA: "+380", PL: "+48", CZ: "+420", SK: "+421", HU: "+36",
  RO: "+40", BG: "+359", RS: "+381", HR: "+385", BA: "+387",
  ME: "+382", MK: "+389", AL: "+355", GR: "+30", CY: "+357",
  MT: "+356", IT: "+39", ES: "+34", PT: "+351", FR: "+33",
  BE: "+32", NL: "+31", DE: "+49", AT: "+43", CH: "+41",
  LI: "+423", LU: "+352", IE: "+353", IS: "+354", NO: "+47",
  SE: "+46", DK: "+45", FI: "+358", EE: "+372", LV: "+371",
  LT: "+372", RU: "+7", BR: "+55", MX: "+52", AR: "+54",
  CL: "+56", CO: "+57", PE: "+51", VE: "+58", EC: "+593",
  BO: "+591", PY: "+595", UY: "+598", GY: "+592", SR: "+597",
  GF: "+594", FK: "+500", GS: "+500", AQ: "+672", HM: "+672",
  CC: "+61", CX: "+61", NF: "+672", TV: "+688", KI: "+686",
  NR: "+674", PG: "+675", SB: "+677", VU: "+678", FJ: "+679",
  PW: "+680", TO: "+676", WS: "+685", AS: "+1", GU: "+1",
  MP: "+1", VI: "+1", PR: "+1", DO: "+1", HT: "+509",
  CU: "+53", JM: "+1", BS: "+1", BB: "+1", AG: "+1",
  LC: "+1", VC: "+1", GD: "+1", DM: "+1", KN: "+1",
  TT: "+1", BZ: "+501", CR: "+506", PA: "+507", HN: "+504",
  NI: "+505", SV: "+503", GT: "+502", KY: "+1",
  TC: "+1", AI: "+1", VG: "+1", MS: "+1", BL: "+590",
  MF: "+590", PM: "+508", WF: "+681", PF: "+689", NC: "+687",
  PN: "+870", SH: "+290", AC: "+247", TA: "+290", IO: "+246",
  BV: "+47", SJ: "+47", AX: "+358", FO: "+298", GL: "+299",
  SX: "+1", CW: "+599", BQ: "+599", AW: "+297", AD: "+376",
  MC: "+377", SM: "+378", VA: "+39", GI: "+350", JE: "+44",
  GG: "+44", IM: "+44", XK: "+383", PS: "+970",
  EH: "+212", TW: "+886", HK: "+852", MO: "+853", KP: "+850",
};