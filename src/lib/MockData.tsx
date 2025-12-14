// compaign main screen 

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

// music list 

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


// compaign 4th step gift data 
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


// swiper carousel homeBoardsSwiper

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


// DASHBOARD MOCK DATA START

// dashboard home avatar list 

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


// spotlight compaigns data 

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


// circles screen data

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



// chat list data 

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