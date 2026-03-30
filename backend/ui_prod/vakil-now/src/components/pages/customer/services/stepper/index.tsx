'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { defineStepper } from '@/components/ui/stepper';
import { Icons } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React, { useEffect } from 'react';

type Steps = '1' | '2' | '3' | '4';

const STEPS = [
  { id: '1', title: 'Name Finalization' },
  { id: '2', title: 'Partner Details' },
  { id: '3', title: 'Documents' },
  { id: '4', title: 'LLP Details' },
] as const;


// const { useStepper, steps, utils } = defineStepper(
//   {
//     id: '1',
//     title: 'Name Finalization'
//   },
//   {
//     id: '2',
//     title: 'Partner Details'
//   },
//   {
//     id: '3',
//     title: 'Documents'
//   },
//   {
//     id: '4',
//     title: 'LLP Details'
//   }
// );

// type Steps = '1' | '2' | '3' | '4';

// interface StepperProps {
//   steps: Steps;
//   setStep: (step: Steps) => void;
//   stepStatus?: {
//     nameFinalization?: boolean;
//     partners?: boolean;
//     llpInfo?: boolean;
//     esign?: boolean;
//   };
//   onNext: () => void;
//   onBack: () => void;
// }

interface StepperProps {
  steps: Steps;                    // 👈 controlled current step
  setStep: (step: Steps) => void;  // 👈 page controls navigation
  stepStatus?: {
    nameFinalization?: boolean;
    partners?: boolean;
    llpInfo?: boolean;
    esign?: boolean;
  };
}

function Stepper ({ steps = '1', stepStatus, setStep }: StepperProps) {
  // const stepper = useStepper();

  // const currentIndex = utils.getIndex(stepper.current.id);

  const currentIndex = STEPS.findIndex(s => s.id === steps);

  const completedMap: Record<Steps, boolean> = {
    '1': !!stepStatus?.nameFinalization || currentIndex > 0,
    '2': !!stepStatus?.partners || currentIndex > 1,
    '3': !!stepStatus?.llpInfo || currentIndex > 2,
    '4': !!stepStatus?.esign,
  };


  // useEffect(() => {
  //   if (steps) {
  //     stepper.goTo(steps);
  //   }
  // }, [steps]);

  return (
    <div className='md:min-w-[369px] h-full md:items-center flex flex-col'>
      <div className='flex flex-col'>
        <div className='text-[16px] md:text-lg font-semibold text-[#595959]'>
          Service
        </div>
        <div className='flex flex-row md:flex-col gap-2 md:gap-0'>
          <div className='font-inter font-semibold md:font-bold  text-[24px] md:text-[32px] leading-[40px] tracking-[0] text:[#0A2342] md:text-[#1565C0] h-auto'>
            LLP
          </div>
          <div className='font-inter font-semibold md:font-bold text-[24px] md:text-[32px] leading-[40px] tracking-[0]  text:[#0A2342] md:text-[#1565C0] h-auto'>
            Registration
          </div>
        </div>
      </div>




      <div className='md:hidden my-4'>

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
      </div>

      <div className='hidden md:block'>
        <nav aria-label='Checkout Steps' className='group my-4'>
          <ol
            className='flex md:flex-col justify-between'
            aria-orientation='vertical'>
            {STEPS.map((step, index, array) => (
              <React.Fragment key={step.id}>
                <li className='flex md:flex-row flex-col items-center gap-4 flex-shrink-0'>
                  {/* <Button
                    type='button'
                    role='tab'
                    variant={index <= currentIndex ? 'default' : 'outline'}
                    aria-current={
                      stepper.current.id === step.id ? 'step' : undefined
                    }
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    onClick={() => {
                      stepper.goTo(step.id);
                      setStep(step.id);
                    }}
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full',
                      index <= currentIndex && 'bg-[rgb(67,160,71)] text-white', // completed steps
                      index === currentIndex &&
                      'bg-[rgb(21,101,192)] text-white', // current step
                      index > currentIndex && 'bg-[rgb(155,210,237)] text-white' // upcoming steps
                    )}>
                    {completedMap[step.id as Steps] ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      `0${index + 1}`
                    )}

                  </Button> */}
                  <Button
                    type='button'
                    role='tab'
                    onClick={() => {
                      setStep(step.id as Steps);
                    }}
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full',
                      'hover:bg-[rgb(67,160,71)]',
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
                      `0${index + 1}`
                    )}
                  </Button>

                  <span className='font-inter font-semibold text-[16px] leading-[24px] tracking-[0] text-center align-middle text-[#595959]'>
                    {step.title}
                  </span>
                </li>
                {index < array.length - 1 && (
                  <div
                    className='flex'
                    style={{
                      paddingInlineStart: '1.25rem'
                    }}>
                    <Separator
                      orientation='vertical'
                      className={cn(
                        '!w-[2px] !h-10',
                        index <= currentIndex &&
                        'bg-[rgb(21,101,192)] text-white', // completed steps // current step
                        index > currentIndex &&
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
      <div className='hidden md:block mt-15'>
        <Icons.IllustrationIcon className='w-auto h-auto' />
      </div>

  
    </div>
  );
}

export default Stepper;
