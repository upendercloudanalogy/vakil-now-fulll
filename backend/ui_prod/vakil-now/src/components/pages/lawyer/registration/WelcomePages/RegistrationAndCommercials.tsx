'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RegistrationAndCommercialsImage } from "@/lib/icons";
import { WelcomePageProps } from "./interfaces";
import { memo } from "react";
import LawyerRegistrationBackButton from "../Buttons/LawyerRegistrationBackButton";
import LawyerRegistrationSkipButton from "../Buttons/LawyerRegistrationSkipButton";
import LawyerRegistrationNextButton from "../Buttons/LawyerRegistrationNextButton";

function RegistrationAndCommercials({ onNext, onBack, onSkip, isLast }: WelcomePageProps) {

    return (
        <Card className="p-16 shadow-2xl flex flex-col flex-1 h-full gap-12">
            <div className="flex justify-center items-center">
                <RegistrationAndCommercialsImage width={434} height={300} />
            </div>
            <div className="flex flex-col gap-[28px]">
                <div className="font-bold text-[32px] text-[#1565C0]">
                    <h1>Registration & Commercials</h1>
                </div>
                <div className="text-[#595959] font-regular text-[16px] leading-relaxed space-y-[16px]">
                    <p>
                        Registration on VakilNow is <span className="font-bold">completely free</span> during our development phase.
                    </p>

                    <p>
                        VakilNow charges a <span className="font-bold">25% platform fee</span> on the professional fee charged by you for services delivered through the platform. Payments are collected by VakilNow and securely transferred to your account.
                    </p>

                    <p>
                        This system reduces your burden of billing, payment collection, and follow-ups.
                    </p>

                    <div className="space-y-4">
                        <p className="font-bold">After completing registration:</p>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            <li>You will receive login credentials to your personal portal</li>
                            <li>You will access a customized dashboard to manage your profile, clients, documents, and availability</li>
                            <li>You can update or modify your details at any time</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='flex gap-5 justify-between items-center mt-auto'>
                <div>
                    <LawyerRegistrationBackButton onClick={onBack} />
                </div>
                <div className="flex gap-5 ">
                    <LawyerRegistrationSkipButton onClick={onSkip} />
                    <LawyerRegistrationNextButton onClick={onNext}>
                        {isLast ? "Start Onboarding" : "Next"}
                    </LawyerRegistrationNextButton>
                </div>
            </div>
        </Card>
    );
}

export default memo(RegistrationAndCommercials)