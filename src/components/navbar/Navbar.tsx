'use client'
import {  useState, useEffect  } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';

import { X, ChevronDown, LogOut, User } from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";
import MenuIcon from "@/assets/svgs/menu-icon.svg";
import AnimatedButton from '../buttons/AnimatedButton';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mobileOptions = ["Home", "Why Zoomerly Exists", "Have a question?", "Sign up", "Sign In"];
const desktopOptions = ["Home", "Why Zoomerly Exists", "Have a question?"];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await authService.getUser();
      if (user) {
        setIsLoggedIn(true);
        await fetchUserProfile(user.id);
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, profile_pic_url, email')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsLoggedIn(false);
      setUserProfile(null);
      router.push('/');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const isActive = (option: string) => {
    if (option === "Home") {
      return pathname === "/";
    }
    if (option === "Why Zoomerly Exists") {
      return pathname === "/whyZoomerlyExists";
    }
    if (option === "Have a question?") {
      return pathname === "/haveQuestion";
    }
    if (option === "Sign up") {
      return pathname === "/register";
    }
    if (option === "Sign In") {
      return pathname === "/signin";
    }

    return false;
  };

  const getActiveStyles = (option: string) => {
    return isActive(option)
      ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent from-pink-500 to-purple-600'
      : 'text-[#000000] hover:opacity-70';
  };

  const handleNavigation = (option: string) => {
    switch (option) {
      case "Home":
        router.push("/");
        break;
      case "Why Zoomerly Exists":
        router.push("/whyZoomerlyExists");
        break;
      case "Have a question?":
        router.push("/haveQuestion");
        break;
      case "Sign up":
        router.push("/register");
        break;
      case "Sign In":
        router.push("/signin");
        break;
      default:
        break;
    }
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className='flex justify-between items-center gap-3 px-[5%] max-[769px]:px-4 pb-4 pt-6 max-[1024px]:pb-3 max-[1024px]:pt-4 bg-white sticky top-0 z-[100]'>
        <Image
          className='hidden max-[900px]:block cursor-pointer'
          src={MenuIcon}
          alt='Menu'
          height={20}
          width={20}
          onClick={() => setIsSidebarOpen(true)}
        />
        <Image src={AppLogo} onClick={() => router.push("/")} alt="Logo" className='w-[140px] max-[900px]:w-[123px] cursor-pointer' />
        <div className='flex items-center gap-6 max-[900px]:hidden'>
          {desktopOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[16px] cursor-pointer transition-all duration-300 ${getActiveStyles(option)}`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
          {!loading && (
            isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 flex items-center justify-center bg-white">
                      {userProfile?.profile_pic_url ? (
                        <Image
                          src={userProfile.profile_pic_url}
                          alt={userProfile?.name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ProfileAvatar.src || ProfileAvatar;
                          }}
                        />
                      ) : (
                        <Image
                          src={ProfileAvatar}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-[16px] text-black">{getFirstName(userProfile?.name)}</span>
                    <ChevronDown size={16} className="text-gray-600" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {userProfile?.name || 'User'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/u/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <p
                  className={`text-[16px] cursor-pointer transition-all duration-300 ${getActiveStyles("Sign up")}`}
                  onClick={() => handleNavigation("Sign up")}
                >
                  Sign up
                </p>
                <p
                  className={`text-[16px] cursor-pointer transition-all duration-300 ${getActiveStyles("Sign In")}`}
                  onClick={() => handleNavigation("Sign In")}
                >
                  Sign In
                </p>
              </>
            )
          )}
          <AnimatedButton onClick={() => router.push("/compaign")} height='42px' title='Create a Board' width='150px' />
        </div>
        {!loading && !isLoggedIn && (
          <AnimatedButton onClick={() => router.push("/compaign")} title='Create a Board' height='42px' width='140px' className='hidden max-[900px]:flex' />
        )}
        {!loading && isLoggedIn && (
          <AnimatedButton onClick={() => router.push("/compaign")} title='Create a Board' height='42px' width='140px' className='hidden max-[900px]:flex' />
        )}
      </div>

      <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ zIndex: 200 }}
      />

      <div className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: 300 }}>

        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <Image src={AppLogo} alt="Logo" width={120} height={40} />
          <X className='cursor-pointer' onClick={() => setIsSidebarOpen(false)} />
        </div>

        <div className='flex flex-col gap-4 px-6 py-4'>
          {mobileOptions.filter(option => !isLoggedIn || (option !== "Sign up" && option !== "Sign In")).map((option, i) => (
            <p
              key={i}
              className={`text-[16px] cursor-pointer transition-all duration-300 ${isActive(option)
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold'
                : 'text-black hover:opacity-70'
                }`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
          {isLoggedIn && (
            <>
              <div className='flex items-center gap-3 py-2 border-t border-gray-200 mt-2'>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 flex items-center justify-center bg-white">
                  {userProfile?.profile_pic_url ? (
                    <Image
                      src={userProfile.profile_pic_url}
                      alt={userProfile?.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ProfileAvatar.src || ProfileAvatar;
                      }}
                    />
                  ) : (
                    <Image
                      src={ProfileAvatar}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">{userProfile?.name || 'User'}</span>
                  <span className="text-xs text-gray-500">{userProfile?.email || ''}</span>
                </div>
              </div>
              <p
                className="text-[16px] cursor-pointer text-black hover:opacity-70"
                onClick={() => {
                  router.push('/u/profile');
                  setIsSidebarOpen(false);
                }}
              >
                Profile
              </p>
              <p
                className="text-[16px] cursor-pointer text-red-600 hover:opacity-70"
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
              >
                Log out
              </p>
            </>
          )}
          <AnimatedButton onClick={() => router.push("/compaign")} height='42px' title='Create a Board' />
        </div>

      </div>
    </>
  );
};

export default Navbar;