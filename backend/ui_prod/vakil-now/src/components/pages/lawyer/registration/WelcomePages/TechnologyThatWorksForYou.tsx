'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TechnologyThatWorksForYouImage } from "@/lib/icons";
import { WelcomePageProps } from "./interfaces";
import { memo } from "react";
import LawyerRegistrationBackButton from "../Buttons/LawyerRegistrationBackButton";
import LawyerRegistrationSkipButton from "../Buttons/LawyerRegistrationSkipButton";
import LawyerRegistrationNextButton from "../Buttons/LawyerRegistrationNextButton";

function TechnologyThatWorksForYou({ onNext, onBack, onSkip }: WelcomePageProps) {

    return (
        <Card className="p-16 shadow-2xl flex flex-col flex-1 h-full gap-12">
            <div className="flex justify-center items-center">
                <TechnologyThatWorksForYouImage width={377} height={242} />
            </div>

            <div className="flex flex-col gap-[28px]">

                <div className="font-bold text-[32px] text-[#1565C0]">
                    <h1>Technology That Works for You</h1>
                </div>
                <div className="text-[#595959] font-regular text-[16px] leading-relaxed space-y-[16px]">
                    <p>
                        VakilNow is committed to strengthening legal practice through technology. We invest in building and maintaining tools that help you focus on legal work while reducing operational burden.
                    </p>

                    <div className="space-y-4">
                        <p>As an associated professional, you will receive access to:</p>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            <li>A personalized professional dashboard</li>
                            <li>Client and case management tools</li>
                            <li>Secure communication systems</li>
                            <li>Cloud-based document management</li>
                            <li>Billing and payment handling support</li>
                        </ul>
                    </div>

                    <p>
                        These tools are designed to help you <span className="font-bold">acquire clients, communicate efficiently, manage documents seamlessly, and operate your practice professionally.</span>
                    </p>
                </div>
            </div>
            <div className='flex gap-5 justify-between items-center mt-auto'>
                <div>
                    <LawyerRegistrationBackButton onClick={onBack} />
                </div>
                <div className="flex gap-5 ">
                    <LawyerRegistrationSkipButton onClick={onSkip} />
                    <LawyerRegistrationNextButton onClick={onNext} />
                </div>
            </div>
        </Card>
    );
}

export default memo(TechnologyThatWorksForYou)