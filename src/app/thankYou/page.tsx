'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react'
import ThanksImg from "@/assets/pngs/Thanks.png";
import GlobalButton from '@/components/buttons/GlobalButton';

const ThankYou = () => {

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">

      <div className="relative mb-8">
        <Image
          src={ThanksImg}
          alt="Thank You"
          height={700}
          width={700}
          className="rounded-xl object-cover"
        />
        <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white cursor-pointer" />
      </div>

      <div className="w-full md:w-[70%] space-y-6 text-md max-[600px]:text-sm text-center">
        <p>
          Unlock the potential for passive income with our exclusive referral
          program! By clicking Yes, I want to earn, you can start earning
          rewards for every friend you refer. Its an easy way to make extra
          money simply by sharing the benefits of our transportation app.
        </p>
        <p>
          Dont worry, if you choose not to participate, you can still complete
          your signup and enjoy all the great features our app offers. But why
          miss out on the opportunity to earn while you travel? Click Yes, I
          want to earn and start benefiting today!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <GlobalButton onClick={() => router.push("/register")} title='Maybe Later' height='40px' width='180px' />
          <GlobalButton onClick={() => router.push("/subscriptionplan")} title='Unlock Passive Income' height='40px' width='190px' />
        </div>
      </div>
    </div>
  )
}

export default ThankYou