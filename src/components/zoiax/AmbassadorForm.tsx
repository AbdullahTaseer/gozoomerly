'use client';

import React from 'react';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AmbassadorForm = () => {

  return (
    <div className='w-full px-4 py-8 bg-gray-100 rounded-2xl'>
      <div className='max-w-lg w-full mx-auto p-4 md:p-8'>
        <h2 className='text-2xl text-center md:text-3xl font-bold text-black mb-2'>
          Ambassador Application Form
        </h2>

        <p className='text-sm text-center md:text-base text-black mb-8'>
          This is selective. We choose the right people — not everyone.
        </p>

        <div className='space-y-3'>
          <div>
            <GlobalInput
              title='Full name*'
              placeholder='Enter your full name'
              height='46px'
              width='100%'
              borderRadius='8px'
            />
          </div>

          <div>
            <GlobalInput
              title='Email*'
              type='email'
              placeholder='Enter your email'
              height='46px'
              width='100%'
              borderRadius='8px'
            />
          </div>

          <div>
            <GlobalInput
              title='Phone*'
              type='tel'
              placeholder='Enter your phone number'
              height='46px'
              width='100%'
              borderRadius='8px'
            />
          </div>

          <div>
            <GlobalInput
              title='City*'
              placeholder='Enter your city name'
              height='46px'
              width='100%'
              borderRadius='8px'
            />
          </div>

          <div>
            <GlobalInput
              title='State*'
              placeholder='Enter your state name'
              height='46px'
              width='100%'
              borderRadius='8px'
            />
          </div>

          {/* Country */}
          <div>
            <GlobalInput
              title='Country*'
              placeholder='Enter your country name'
              height='46px'
              width='100%'
              borderRadius='8px'
            />
          </div>

          <div>
            <label className='text-[13px] text-[#2D2D2D] mb-1 block'>
              Industry*
            </label>
            <Select>
              <SelectTrigger className='w-full !h-[46px] border border-[#2E2C39] rounded-lg text-[15px] text-black bg-gray-100'>
                <SelectValue placeholder='Your industry key skills' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='technology'>Technology</SelectItem>
                <SelectItem value='finance'>Finance</SelectItem>
                <SelectItem value='healthcare'>Healthcare</SelectItem>
                <SelectItem value='education'>Education</SelectItem>
                <SelectItem value='retail'>Retail</SelectItem>
                <SelectItem value='manufacturing'>Manufacturing</SelectItem>
                <SelectItem value='consulting'>Consulting</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-[13px] text-[#2D2D2D] mb-1 block'>
              Why do you want to become a Zoiax Ambassador?*
            </label>
            <textarea
              placeholder="Tell us why you'd be great ambassador..."
              className='w-full min-h-[120px] px-4 py-3 border border-[#2E2C39] rounded-lg text-[15px] text-black placeholder:text-[#A6A6A6] focus:outline-none resize-y'
            />
          </div>

          <GlobalButton
            title='Apply to Become an Ambassador'
            height='46px'
            width='100%'
            bgColor='#FF6B35'
            color='white'
            borderRadius='8px'
            className='mt-6'
          />
        </div>
      </div>
    </div>
  );
};

export default AmbassadorForm;
