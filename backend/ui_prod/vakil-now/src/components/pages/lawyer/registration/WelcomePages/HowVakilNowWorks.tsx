'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HowVakilNowWorks as HowVakilNowWorksImage } from "@/lib/icons";
import { WelcomePageProps } from './interfaces/index'
import { memo } from "react";
import LawyerRegistrationBackButton from "../Buttons/LawyerRegistrationBackButton";
import LawyerRegistrationSkipButton from "../Buttons/LawyerRegistrationSkipButton";
import LawyerRegistrationNextButton from "../Buttons/LawyerRegistrationNextButton";

function HowVakilNowWorks({ onNext, onBack, onSkip }: WelcomePageProps) {

    return (
        <Card className="p-16 shadow-2xl flex flex-col flex-1 h-full gap-12">
            <div className="flex justify-center items-center">
                <HowVakilNowWorksImage width={276} height={267} />
            </div>

            <div className=" flex flex-col gap-[28px]">


                <div className="font-bold text-[32px] text-[#1565C0]">
                    <h1>How VakilNow Works</h1>
                </div>
                <div className="text-[#595959] font-regular text-[16px] leading-relaxed space-y-[16px]">
                    <p>
                        VakilNow supports legal professionals across the entire legal service lifecycle — from acquiring clients to delivering services and managing operations.
                    </p>

                    <p>Through VakilNow, you will be able to:</p>

                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>Connect with clients seeking verified legal assistance</li>
                        <li>Communicate securely through platform-based tools</li>
                        <li>Manage cases and clients through a unified dashboard</li>
                        <li>Store and share documents using cloud-based systems</li>
                        <li>Handle billing and payments without manual follow-ups</li>
                    </ul>

                    <p>
                        VakilNow&apos;s<span className="font-bold text-[16px]">core focus is legal service delivery</span>, not just client discovery.
                    </p>
                </div>
            </div>

            <div className='flex gap-5 justify-between items-center mt-auto'>
                <div>
                    <LawyerRegistrationBackButton onClick={onBack} />
                </div>
                <div className="flex gap-5">
                    <LawyerRegistrationSkipButton onClick={onSkip} />
                    <LawyerRegistrationNextButton onClick={onNext} />
                </div>
            </div>
        </Card>
    );
}

export default memo(HowVakilNowWorks);
