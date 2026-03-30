'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LegalProfessionalOnboardingImage } from "@/lib/icons";
import { WelcomePageProps } from './interfaces/index';
import { memo } from "react";
import LawyerRegistrationSkipButton from "../Buttons/LawyerRegistrationSkipButton";
import LawyerRegistrationNextButton from "../Buttons/LawyerRegistrationNextButton";



function LegalProfessionalOnboarding({ onNext, onSkip }: WelcomePageProps) {

    return (
        <Card className="p-16 shadow-2xl flex flex-col flex-1 h-full gap-12">
            <div className="flex justify-center items-center">
                <LegalProfessionalOnboardingImage width={304} height={274} />
            </div>
            <div className="flex flex-col gap-[28px]">
                <div className="font-bold text-[32px] text-[#1565C0]">
                    <h1>Welcome to VakilNow</h1>
                    <h1>Legal Professional Onboarding</h1>
                </div>
                <div className="text-[#595959] text-[16px] leading-relaxed space-y-[16px]">
                    <p>
                        VakilNow is a technology-driven platform built for <span className="font-semibold text-[#595959]">legal professionals and people</span>, with the objective
                        of making <span className="font-semibold text-[#595959]">the end-to-end delivery of legal services more efficient, transparent, and accessible.</span>
                    </p>
                    <p>
                        We do <span className="font-semibold text-[#595959]">not</span> aim to replace lawyers, their teams, or traditional legal practice. Instead, VakilNow is
                        designed to <span className="font-semibold text-[#595959]">empower you and your workforce through technology</span>, helping you manage more
                        clients, cases, and work simultaneously while maintaining professional quality.
                    </p>
                    <p>
                        Our goal is simple: <span className="font-semibold text-[#595959]">expand your practice by increasing your capabilities</span>, not by disrupting your
                        profession.
                    </p>
                </div>

            </div>

            <div className='flex gap-5 justify-center items-center mt-auto'>
                <LawyerRegistrationSkipButton onClick={onSkip} />
                <LawyerRegistrationNextButton onClick={onNext} />
            </div>
        </Card>
    );
}

export default memo(LegalProfessionalOnboarding);