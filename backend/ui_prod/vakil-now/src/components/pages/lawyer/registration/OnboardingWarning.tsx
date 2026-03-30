'use client';

import { Button } from '@/components/ui/button';
import { OnboardingWarning as OnboardingWarningIcon } from '@/lib/icons';
import { memo } from 'react';

interface WarningProps {
    onYes: () => void;
    onNo: () => void;
}

 function OnboardingWarning ({ onYes, onNo }: WarningProps) {

    return (
        <div className='bg-white max-h-[641px] max-w-[843px] w-[843px] h-[641px]  rounded-[8px] p-16 gap-[60px] shadow-2xl justify-between items-center flex flex-col'>
            <OnboardingWarningIcon height={281} width={377} />
            <div className='font-inter font-bold text-[20px] text-wrap max-w-[536px] max-h-[84px] flex justify-center items-center text-center text-[#595959]'>
                We recommend that you carefully review this information before continuing. Are you certain you wish to skip this step?
            </div>
            <div className='flex gap-5 justify-center items-center'>
                <Button onClick={onYes} className='rounded-[4px] bg-[#B8B8B8] hover:bg-[#B8B8B8] text-[#1A1A1A] font-medium text-[14px]'>
                    Yes
                </Button>
                <Button onClick={onNo} className='rounded-[4px] bg-[#1565C0] hover:bg-[#1565C0] text-[#FFFFFF] font-medium text-[14px]'>
                    No
                </Button>
            </div>
        </div>
    );
}

export default memo(OnboardingWarning)