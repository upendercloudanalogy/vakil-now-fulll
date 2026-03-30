'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';
import { useAppSelector } from '../../../../../redux/hook';

type Steps = '0' | '1' | '2' | '3' | '4';

const STEPS = [
    {
        id: '0', title: 'Welcome & How VakilNow Works'
    },
    {
        id: '1', title: 'Identity & Verification'
    },
    {
        id: '2', title: 'Professional Structure & Capacity'
    },
    {
        id: '3', title: 'Expertise & Services Offered'
    },
    {
        id: '4', title: 'Feedback & Utility Check'
    },
] as const;



interface StepperProps {
    steps: Steps;                    
    setStep: (step: Steps) => void;  
}



function OnboardingStepper ({ steps = '1', setStep }: StepperProps) {
    const tips = [
        "Bar Council Registration Number & State",
        "Bar Council ID Card (soft copy)",
        "Government ID (Aadhaar/Voter/Passport)",
        "Professional Photograph (plain background preferred)",
        "Firm details (if applicable)",
        "Primary office address & PIN code",
        "List of legal services you actively provide",
        "Preferred languages for client communication"
    ];

    // const currentIndex = STEPS.findIndex(s => s.id === steps);
    // console.log(currentIndex, 'current index');
    
    const { currentStep,successfullyRegistered } = useAppSelector((state) => state.lawyerOnboardingReducer);
    // console.log(currentStep, 'current step in redux ');
    
    const completedMap: Record<Steps, boolean> = {
        '0': currentStep > 0,
        '1': currentStep > 1,
        '2': currentStep > 2,
        '3': currentStep > 3,
        '4': successfullyRegistered,
    };

    return (
        <div className='md:max-w-[312px] flex flex-col gap-30'>
            <div className='md:min-w-[237px] md:items-start flex flex-col'>
                <div className='flex flex-col items-start w-full'>
                    <div className='text-[16px] font-semibold text-[#595959]'>
                        Welcome
                    </div>
                    <div className='font-inter font-bold text-[32px] text-[#1565C0]'>
                        Onboarding
                    </div>
                </div>

                {/* <div className='md:hidden my-4'>

        <nav aria-label='Checkout Steps'>
          <ol className='flex justify-between items-start'>
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <li className='flex flex-col items-center'>
                  <Button
                    type='button'
                    role='tab'
                    variant={index <= currentIndex ? 'default' : 'outline'}
                    aria-current={
                      steps === step.id ? 'step' : undefined
                    }
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={steps === step.id}
                    onClick={() => {
                      setStep(step.id as Steps);
                    }}
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full mb-2',
                      completedMap[step.id as Steps] && 'bg-[rgb(67,160,71)] text-white',
                      !completedMap[step.id as Steps] &&
                      steps === step.id &&
                      'bg-[rgb(21,101,192)] text-white',
                      !completedMap[step.id as Steps] &&
                      steps !== step.id &&
                      'bg-[rgb(155,210,237)] text-white'
                    )}
                      >
                    {completedMap[step.id as Steps] ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <>0{index + 1}</>
                    )}
                  </Button>
                </li>
                {index < STEPS.length - 1 && (
                  <div className='flex-1 flex items-center h-10'>
                    <Separator
                      orientation='horizontal'
                      className={cn(
                        '!h-[2px]',
                        index < currentIndex
                          ? 'bg-[rgb(21,101,192)]'   // desktop jaisa dark
                          : 'bg-[rgb(155,210,237)]' // desktop jaisa light
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div> */}

                <div className='hidden md:block max-w-[237px]'>
                    <nav aria-label='Checkout Steps' className='group my-4'>
                        <ol
                            className='flex md:flex-col justify-between'
                            aria-orientation='vertical'>
                            {STEPS.map((step, index, array) => (
                                <React.Fragment key={step.id}>
                                    <li className='flex md:flex-row flex-col items-start gap-2 flex-shrink-0'>
                                        <Button
                                            type='button'
                                            role='tab'
                                            // onClick={() => {
                                            //     setStep(step.id as Steps);
                                            // }}
                                            className={cn(
                                                'flex size-12 items-center justify-center rounded-full',
                                                completedMap[step.id as Steps] && 'bg-[rgb(67,160,71)] text-white hover:bg-[rgb(67,160,71)]',
                                                !completedMap[step.id as Steps] &&
                                                steps === step.id &&
                                                'bg-[rgb(21,101,192)] text-white hover:bg-[rgb(21,101,192)]',
                                                !completedMap[step.id as Steps] &&
                                                steps !== step.id &&
                                                'bg-[rgb(155,210,237)] text-white hover:bg-[rgb(155,210,237)]'
                                            )}
                                        >
                                            {completedMap[step.id as Steps] ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                `0${index}`
                                            )}
                                        </Button>

                                        <span className={cn("font-inter font-semibold text-[16px] leading-[24px]   text-[#595959]",
                                            index === 0 && 'max-w-[164px]',
                                            index === 1 && 'max-w-[89px]',
                                            index === 2 && 'max-w-[173px]',
                                            index === 3 && 'max-w-[131px]',
                                            index === 4 && 'max-w-[100px]'
                                        )}>
                                            {step.title}
                                        </span>
                                    </li>
                                    {index < array.length - 1 && (
                                        <div
                                            className='flex'
                                            style={{
                                                paddingInlineStart: '1.5rem'
                                            }}>
                                            <Separator
                                                orientation='vertical'
                                                className={cn(
                                                    '!w-[2px] !h-10',
                                                    index <= currentStep &&
                                                    'bg-[rgb(21,101,192)] text-white', // completed steps // current step
                                                    index > currentStep &&
                                                    'bg-[rgb(155,210,237)] text-white' // upcoming steps
                                                )}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </ol>
                    </nav>
                </div>

            </div>
            <div className='w-full rounded-[8px] border border-[#4FC3F7] bg-[#ecf8fd] p-5 shadow-sm'>
                <h2 className='font-inter font-semibold text-[20px] text-[#595959] mb-4'>Onboarding Tips</h2>

                <div className='space-y-6'>
                    <div className='flex items-start gap-3'>
                        <div className='mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1565C0]'>
                            <Check className='w-4 h-4 text-white' />
                        </div>
                        <div>
                            <p className='font-bold text-[13px] text-[#595959] mb-2'>Keep documents handy</p>
                            <ul className='space-y-[4px] text-[12px] font-inter font-medium text-[#595959]'>
                                {tips.map((tip, index) => (
                                    <li key={index} className="flex gap-2 items-start">
                                        {/* Custom bullet point to match Figma */}
                                        <span className="mt-1.5 size-1.5 rounded-full bg-[#595959] shrink-0" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1565C0]'>
                            <Check className='w-4 h-4 text-white' />
                        </div>
                        <p className='text-[13px] font-bold text-[#595959]'>
                            Takes 6-8 minutes <span className='font-medium'>to complete</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default OnboardingStepper;
