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