import React from "react";
import GlobalInput from "../inputs/GlobalInput";
import GlobalButton from "../buttons/GlobalButton";
import ArrowRight from "@/assets/svgs/ArrowRight.svg";

type props = {
  nextClick?: () => void;
  skipClick?: () => void;
}

const MakeWishTrueForm = ({ nextClick, skipClick }: props) => {
  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 mx-auto space-y-4">

      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Make their wish come true 💫
        </p>
        <p className="text-sm text-center mt-1">
          Tell everyone what we're aiming for and why it matters.
        </p>
      </div>


      <div className="space-y-4">
        <GlobalInput
          placeholder="Lets send Sean to the Caribbean!"
          title="Goal"
          width="100%"
          height="40px"
        />

        <GlobalInput
          placeholder="$3000"
          title="Target Amount"
          width="100%"
          height="40px"
        />


        <div>
          <p className="text-sm font-semibold mb-1">Description</p>
          <textarea
            placeholder="Sean has dreamed of visiting the Caribbean for years. He is been working so hard and never takes time for himself. This year, with all of us coming together on BirthdayText.com, we can finally make it happen. Let’s give him the gift of sunshine, ocean waves, and the biggest smile we’ve ever seen!"
            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none resize-none min-h-[100px]"
          />
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Goal Progress</p>
          <div className="w-full h-[4px] bg-gray-200 rounded-full" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>$0 raised</span>
            <span>$0 goal</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <GlobalButton
            title="Skip Goal"
            bgColor="transparent"
            height="44px"
            borderColor="#000000"
            color="#000000"
            borderWidth="1px"
            hover={{ bgColor: "white" }}
            onClick={skipClick}
          />
          <GlobalButton
            title="Next"
            icon={ArrowRight}
            height="44px"
            className="flex-row-reverse"
            onClick={nextClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MakeWishTrueForm;
