'use client';

import dynamic from 'next/dynamic';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";


import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';
import { fulllawyerOnboaringData } from '../../../../redux/slices/lawyer/lawyerOnboardingThunk';
import { Loader2, RotateCw, Scale } from 'lucide-react';
import { setWelcomePagesCompleted } from '../../../../redux/slices/lawyer/lawyerSlice';

import OnboardingStepper from '@/components/pages/lawyer/registration/OnboardingStepper';
import OnboardingWarning from '@/components/pages/lawyer/registration/OnboardingWarning';
// const OnboardingWarning = dynamic(() => import('@/components/pages/lawyer/registration/OnboardingWarning'));
import LegalProfessionalOnboarding from '@/components/pages/lawyer/registration/WelcomePages/LegalProfessionalOnboarding';
// const LegalProfessionalOnboarding = dynamic(() => import('@/components/pages/lawyer/registration/WelcomePages/LegalProfessionalOnboarding'));
import HowVakilNowWorks from '@/components/pages/lawyer/registration/WelcomePages/HowVakilNowWorks';
// const HowVakilNowWorks = dynamic(() => import('@/components/pages/lawyer/registration/WelcomePages/HowVakilNowWorks'));
import QualityNotCrowd from '@/components/pages/lawyer/registration/WelcomePages/QualityNotCrowd';
// const QualityNotCrowd = dynamic(() => import('@/components/pages/lawyer/registration/WelcomePages/QualityNotCrowd'));
import RegistrationAndCommercials from '@/components/pages/lawyer/registration/WelcomePages/RegistrationAndCommercials';
// const RegistrationAndCommercials = dynamic(() => import('@/components/pages/lawyer/registration/WelcomePages/RegistrationAndCommercials'));
import RelationshipBuildOnTrust from '@/components/pages/lawyer/registration/WelcomePages/RelationshipBuiltOnTrust';
// const RelationshipBuildOnTrust = dynamic(() => import('@/components/pages/lawyer/registration/WelcomePages/RelationshipBuiltOnTrust'));
import TechnologyThatWorksForYou from '@/components/pages/lawyer/registration/WelcomePages/TechnologyThatWorksForYou';
// const TechnologyThatWorksForYou = dynamic(() => import('@/components/pages/lawyer/registration/WelcomePages/TechnologyThatWorksForYou'));
import ExpertiseAndServicesOffered from '@/components/pages/lawyer/registration/ExpertiseAndServicesOffered';
// const ExpertiseAndServicesOffered = dynamic(() => import('@/components/pages/lawyer/registration/ExpertiseAndServicesOffered'));
import FeedbackAndUtilityCheck from '@/components/pages/lawyer/registration/FeedbackAndUtilityCheck';
// const FeedbackAndUtilityCheck = dynamic(() => import('@/components/pages/lawyer/registration/FeedbackAndUtilityCheck'));
import IdentityAndVerification from '@/components/pages/lawyer/registration/identityAndVerification';
// const IdentityAndVerification = dynamic(() => import('@/components/pages/lawyer/registration/identityAndVerification'));
import ProfessionalStructureAndCapacity from '@/components/pages/lawyer/registration/ProfessionalStructureAndCapacity';
// const ProfessionalStructureAndCapacity = dynamic(() => import('@/components/pages/lawyer/registration/ProfessionalStructureAndCapacity'));
import ThankyouForRegistration from '@/components/pages/lawyer/registration/ThankyouPage';
// const ThankyouForRegistration = dynamic(() => import('@/components/pages/lawyer/registration/ThankyouPage'));

type Steps = '0' | '1' | '2' | '3' | '4';



const STEP_ORDER: Steps[] = ['0', '1', '2', '3', '4'];


export default function LawyersPage () {

    const [step, setStep] = useState<Steps>('0');
    const [subStep, setSubStep] = useState(0);
    const [showSkipModal, setShowSkipModal] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const { successfullyRegistered, currentStep, loading, isInitialized } = useAppSelector((state) => state.lawyerOnboardingReducer)


    const handleWelcomeNext = useCallback(() => {
        if (subStep < 5) {
            setSubStep(prev => prev + 1);
        } else {
            dispatch(setWelcomePagesCompleted());
            setStep('1');
        }
    }, [subStep, dispatch]);

    const handleWelcomeBack = useCallback(() => {
        if (subStep > 0) setSubStep(prev => prev - 1);
    }, [subStep]);

    const handleSkipTrigger = () => setShowSkipModal(true);

    const confirmSkip = () => {
        setShowSkipModal(false);
        dispatch(setWelcomePagesCompleted());
        setStep('1'); // Directly to first real step
        setSubStep(0);
    };

    const handleNext = useCallback(() => {
        if (step === '4') {
            return;
        }
        setStep((prev) => {

            const index = STEP_ORDER.indexOf(prev);
            return STEP_ORDER[index + 1] ?? prev;

        });
    }, []);
    
    const handleBack = useCallback(() => {

        setStep((prev) => {

            const index = STEP_ORDER.indexOf(prev);

            return STEP_ORDER[index - 1] ?? prev;

        });

    }, []);


    const renderWelcomeFlow = () => {
        const props = {
            onNext: handleWelcomeNext,
            onBack: handleWelcomeBack,
            onSkip: handleSkipTrigger
        };

        switch (subStep) {
            case 0: return <LegalProfessionalOnboarding {...props} />;
            case 1: return <HowVakilNowWorks {...props} />;
            case 2: return <QualityNotCrowd {...props} />;
            case 3: return <TechnologyThatWorksForYou {...props} />;
            case 4: return <RelationshipBuildOnTrust {...props} />;
            case 5: return <RegistrationAndCommercials {...props} isLast />;
            default: return null;
        }
    };


    useEffect(() => {
        if (isInitialized && currentStep && !successfullyRegistered) {
            if (currentStep > 1) {
                setStep(currentStep.toString() as Steps);
            }
        }
    }, [isInitialized]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [step, subStep, successfullyRegistered]);


    useEffect(() => {
        dispatch(fulllawyerOnboaringData());
    }, [dispatch])

    if (!isInitialized) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
                <div className="relative flex items-center justify-center">
                    {/* Background soft glow - makes it look premium */}
                    <div className="absolute h-32 w-32 animate-pulse rounded-full bg-sky-100/50 blur-2xl"></div>

                    {/* The Legal Scale Icon */}
                    <Scale
                        size={100}
                        strokeWidth={1.2}
                        className="text-sky-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] relative z-10"
                    />
                </div>
            </div>
        );
    }

    return (

        <div ref={scrollContainerRef} className='flex flex-col md:flex-row p-2 md:pt-[64px] md:pr-[96px] md:pb-[122px] md:pl-[96px] md:gap-10 overflow-x-hidden overflow-y-auto w-full !h-full relative'>

            <OnboardingStepper steps={step} setStep={(s) => setStep(s)} />


            <div className='flex-1'>
                {successfullyRegistered ? (
                    <ThankyouForRegistration />
                ) : (
                    <>
                        {step === '0' && renderWelcomeFlow()}
                        {step === '1' && <IdentityAndVerification onNext={handleNext} onBack={handleBack} />}
                        {step === '2' && <ProfessionalStructureAndCapacity onNext={handleNext} onBack={handleBack} />}
                        {step === '3' && <ExpertiseAndServicesOffered onNext={handleNext} onBack={handleBack} />}
                        {step === '4' && <FeedbackAndUtilityCheck onNext={handleNext} onBack={handleBack} />}
                    </>
                )}
            </div>


            <Dialog open={showSkipModal} onOpenChange={setShowSkipModal}>
                <DialogContent
                    className="max-w-none w-auto p-0 border-none bg-transparent shadow-none outline-none [&>button]:hidden"
                >
                    <DialogTitle className="sr-only">Skip Onboarding Warning</DialogTitle>
                    <DialogDescription className="sr-only">Skip Onboarding Warning</DialogDescription>
                    <OnboardingWarning
                        onYes={confirmSkip}
                        onNo={() => setShowSkipModal(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>



    );

}
