"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import AppLogo from "@/assets/svgs/Zoomerly.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";

import AddYourWish from "@/components/compaignSections/AddYourWish";
import PickThemeForm from "@/components/compaignSections/PickThemeForm";
import MakeWishTrueForm from "@/components/compaignSections/MakeWishTrueForm";
import GlobalModal from "@/components/modals/GlobalModal";
import AddFilesModal from "@/components/modals/AddFilesModal";
import AddGift from "@/components/compaignSections/AddGift";
import ContinuePayment from "@/components/compaignSections/ContinuePayment";
import WhoCanJoin from "@/components/compaignSections/WhoCanJoin";
import YourBoardIsLive from "@/components/compaignSections/YourBoardIsLive";

const CreateBirthdayBoard = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const progress = step === 1
    ? 0
    : step === 2
      ? 40
      : step === 3
        ? 60
        : step === 4
          ? 70
          : step === 5
            ? 80
            : step === 6
              ? 90
              : step === 7
                ? 99 : 0

  return (

    <>
      <div className="relative min-h-screen overflow-x-clip bg-[#F7F7F7] p-4">
        <div className="flex justify-between gap-3 max-md:flex-col items-center">
          <Image onClick={() => router.push("/")} className="cursor-pointer relative z-10" src={AppLogo} alt="App Logo" />
          <h2 className="text-center text-[32px] max-[700px]:text-[24px] font-bold">
            Create Birthday Board
          </h2>
          <div className="w-[100px] max-md:hidden" />
        </div>

        <Image src={Particles} alt="" className="absolute top-10 left-10" />
        <Image src={Particles} alt="" className="absolute bottom-10 right-10" />

        <div className="w-full mx-auto max-w-2xl relative z-10">
          <div className="space-y-1">
            {/* progress bar */}
            <div className="h-1 bg-[#D9D9D9] rounded-full overflow-hidden mt-4">
              <div
                className="h-1 bg-[#F43C83] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs">{progress}% Complete</p>
          </div>

          <div className="mt-4">
            {step === 1 &&
              <PickThemeForm
                nextClick={() => setStep(2)} />
            }
            {step === 2 &&
              <MakeWishTrueForm
                skipClick={() => setStep(3)}
                nextClick={() => setStep(3)} />
            }
            {step === 3 &&
              <AddYourWish
                uploaderModalClick={() => setModalOpen(true)} />
            }
            {step === 4 &&
              <AddGift goToPayment={() => setStep(5)} />
            }
            {step === 5 &&
              <ContinuePayment continuePayment={() => setStep(6)} />
            }
            {step === 6 &&
              <WhoCanJoin goToLiveBoard={() => setStep(7)} />
            }
            {step === 7 &&
              <YourBoardIsLive />
            }
          </div>
        </div>
      </div>

      <GlobalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modalHeader={false}
        className="w-[600px] max-[768px]:w-[90vw]">
        <AddFilesModal doneOnclick={() => {
          setStep(4)
          setModalOpen(false)
        }}
        />
      </GlobalModal>
    </>
  );
};

export default CreateBirthdayBoard;
