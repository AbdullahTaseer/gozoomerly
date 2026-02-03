
type props = {
  title: string;
  color?: string;
  className?: string;
}

const TitleCard = ({ title, color = "black", className }: props) => {
  return (
    <div style={{ color: color }} className={`text-center ${className} relative text-[55px] max-[1150px]:text-[46px] max-[768px]:text-[32px] font-bold`}>{title}</div>
  );
};

export default TitleCard;