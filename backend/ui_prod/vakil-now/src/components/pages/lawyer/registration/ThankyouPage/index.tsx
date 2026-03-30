'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ThankyouForRegistrationImage } from "@/lib/icons";

export default function ThankyouForRegistration () {
    return (
        <Card className="p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl flex flex-col items-center justify-center text-center h-full">
            {/* Illustration Section */}
            <div className="mb-10">
                <ThankyouForRegistrationImage width={478} height={318} />
            </div>

            {/* Main Heading */}
            <div className='flex flex-col gap-[12px]'>

                <h1 className="font-inter font-bold text-[32px] text-[#1565C0]">
                    Thank you for your time.
                </h1>


                <p className="text-[#595959]  font-inter font-normal text-[20px]">
                    Your profile is currently under review. We kindly request you to allow one to two
                    business days for the verification process. <span className="font-bold">
                        You will be notified once your profile has been successfully verified.</span>
                    Thank you for your time and cooperation.
                </p>
            </div>
        </Card>
    );
}