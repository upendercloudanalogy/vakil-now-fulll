'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RelationshipBuildOnTrustImage } from "@/lib/icons";
import { WelcomePageProps } from "./interfaces";
import { memo } from "react";
import LawyerRegistrationBackButton from "../Buttons/LawyerRegistrationBackButton";
import LawyerRegistrationSkipButton from "../Buttons/LawyerRegistrationSkipButton";
import LawyerRegistrationNextButton from "../Buttons/LawyerRegistrationNextButton";

function RelationshipBuildOnTrust({ onNext, onBack, onSkip }: WelcomePageProps) {

    return (
        <Card className="p-16 shadow-2xl flex flex-col flex-1 h-full gap-12">
            <div className="flex justify-center items-center">
                <RelationshipBuildOnTrustImage width={400} height={299} />
            </div>

            <div className="flex flex-col gap-[28px]">


                <div className="font-bold text-[32px] text-[#1565C0]">
                    <h1>A Relationship Built on Trust</h1>
                </div>
                <div className="text-[#595959] font-regular text-[16px] leading-relaxed space-y-[16px]">
                    <p>
                        VakilNow is built on long-term relationships with legal professionals based on <span className="font-bold">trust, transparency, and mutual benefit.</span>
                    </p>

                    <p>
                        We understand that professionals may choose to communicate with clients outside the platform. However, VakilNow works continuously to provide a complete ecosystem for end-to-end legal service delivery.
                    </p>

                    <div className="space-y-4">
                        <p>We expect associated professionals to:</p>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            <li>Respect the platform&apos;s role in enabling service delivery</li>
                            <li>Maintain professional conduct and platform integrity</li>
                            <li>Acknowledge VakilNow&apos;s contribution to client acquisition, operations, and technology</li>
                        </ul>
                    </div>

                    <p>
                        If you are unwilling to maintain a fair and professional association, we respectfully request that you do not register.
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

export default memo(RelationshipBuildOnTrust)