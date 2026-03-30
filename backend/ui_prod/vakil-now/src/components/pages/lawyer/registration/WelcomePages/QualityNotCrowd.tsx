'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QualityNotCrowdImage } from "@/lib/icons";
import { WelcomePageProps } from "./interfaces";
import { de } from "date-fns/locale";
import { memo } from "react";
import LawyerRegistrationBackButton from "../Buttons/LawyerRegistrationBackButton";
import LawyerRegistrationSkipButton from "../Buttons/LawyerRegistrationSkipButton";
import LawyerRegistrationNextButton from "../Buttons/LawyerRegistrationNextButton";

function QualityNotCrowd({ onNext, onBack, onSkip }: WelcomePageProps) {

    return (
        <Card className="p-16 shadow-2xl flex flex-col flex-1 h-full gap-[20px]">
            <div className="flex justify-center items-center">
                <QualityNotCrowdImage width={262} height={268} />
            </div>

            <div className="flex flex-col gap-[28px]">

                <div className="font-bold text-[32px] text-[#1565C0]">
                    <h1>Quality, Not Crowd</h1>
                </div>
                <div className="text-[#595959] font-regular text-[16px] leading-relaxed space-y-[16px]">
                    <p>
                        VakilNow is not building a large marketplace of unlimited lawyers. Our objective is to ensure <span className="font-bold  text-[16px]">access to quality legal services across the country</span>, especially in regions where such access is limited today.
                    </p>

                    <p>
                        To achieve this, VakilNow follows a <span className="font-bold text-[16px]">selective, location-based association model</span>, where professionals are onboarded based on their <span className="font-bold">field of law, expertise, and capacity to deliver quality service.</span>
                    </p>

                    <p>
                        Associations are <span className="font-bold  text-[16px]">exclusive by design</span> and carefully balanced to maintain a healthy client-to-professional ratio. Additional professionals are associated only when required to ensure service quality is never compromised.
                    </p>

                    <div className="space-y-4">
                        <p>This approach ensures:</p>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            <li>Meaningful and consistent client flow</li>
                            <li>No competition-driven dilution of professional value</li>
                            <li>Strong professional positioning within the region</li>
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
                    <LawyerRegistrationNextButton onClick={onNext} />
                </div>
            </div>
        </Card>
    );
}

export default memo(QualityNotCrowd);