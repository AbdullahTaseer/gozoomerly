'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import { X } from 'lucide-react'
import AppLogo from "@/assets/svgs/Zoomerly.svg"
import MenuIcon from "@/assets/svgs/menu-icon.svg"
import AnimatedButton from '../buttons/AnimatedButton'

const mobileOptions = ["Features", "Ambassadors", "FAQ"]
const desktopOptions = ["Features", "Ambassadors", "FAQ"]

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (option: string) => {
    if (option === "Features") return pathname === "/features"
    if (option === "Ambassadors") return pathname === "/ambassadors"
    if (option === "FAQ") return pathname === "/faq"
    return false
  }

  const getActiveStyles = (option: string) =>
    isActive(option)
      ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold'
      : 'text-black hover:opacity-70'

  const handleNavigation = (option: string) => {
    switch (option) {
      case "Features":
        router.push("/features")
        break
      case "Ambassadors":
        router.push("/ambassadors")
        break
      case "FAQ":
        router.push("/faq")
        break
      default:
        break
    }
    setIsSidebarOpen(false)
  }

  return (
    <>
      <div
        className={`flex justify-between items-center gap-3 px-[5%] max-[769px]:px-4 pb-4 pt-6 max-[1024px]:pb-3 max-[1024px]:pt-4 bg-white sticky top-0 z-[100] transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-none'
        }`}
      >
        <Image
          className='hidden max-[900px]:block cursor-pointer'
          src={MenuIcon}
          alt='Menu'
          height={20}
          width={20}
          onClick={() => setIsSidebarOpen(true)}
        />

        <Image
          src={AppLogo}
          alt="Logo"
          className='w-[140px] max-[900px]:w-[123px] cursor-pointer'
          onClick={() => router.push('/')}
        />

        <div className='flex items-center gap-6 max-[900px]:hidden'>
          {desktopOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[18px] font-medium cursor-pointer transition-all duration-300 ${getActiveStyles(option)}`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}

          <p
            className='text-[16px] font-medium cursor-pointer hover:opacity-70'
            onClick={() => router.push('/signin')}
          >
            Sign In
          </p>

          <AnimatedButton
            title="Get Zoomerly"
            width="160px"
            // onClick={() => router.push('/u')}
          />
        </div>

        <div className='hidden max-[900px]:block'>
          <AnimatedButton
            title="Get Zoomerly"
            width="150px"
            // onClick={() => router.push('/u')}
          />
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ zIndex: 200 }}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 300 }}
      >

        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <Image src={AppLogo} alt="Logo" width={120} height={40} />
          <X className='cursor-pointer' onClick={() => setIsSidebarOpen(false)} />
        </div>

    
        <div className='flex flex-col gap-4 px-6 py-4'>
          {mobileOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[18px] font-medium cursor-pointer transition-all duration-300 ${
                isActive(option)
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold'
                  : 'text-black hover:opacity-70'
              }`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
        </div>

      
        <div className='flex flex-col gap-3 px-6 pt-6 border-t border-gray-200'>
          <p
            className='text-[18px] font-medium cursor-pointer hover:opacity-70'
            onClick={() => {
              router.push('/signin')
              setIsSidebarOpen(false)
            }}
          >
            Sign In
          </p>

        </div>
      </div>
    </>
  )
}

export default Navbar
