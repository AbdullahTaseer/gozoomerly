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