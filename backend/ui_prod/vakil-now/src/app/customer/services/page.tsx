'use client';
import Esign from '@/components/pages/customer/services/esignDocuments';
import InformationAndDocumentForLLP from '@/components/pages/customer/services/llpInfoDetails';
import NameFinalization from '@/components/pages/customer/services/nameFinalizing';
import PartnerDetails from '@/components/pages/customer/services/PartnerDetails';
import Stepper from '@/components/pages/customer/services/stepper';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLlps } from '../../../../redux/slices/llp/llpThunk';
import { AppDispatch, RootState } from '../../../../redux/store';

type Steps = '1' | '2' | '3' | '4';

const STEP_ORDER: Steps[] = ['1', '2', '3', '4'];

export default function Page () {
  const [step, setStep] = useState<Steps>('1');
  const dispatch = useDispatch<AppDispatch>();


  const stepStatus = useSelector(
    (state: RootState) => state.llpReducer.stepStatus
  );

  const getFirstIncompleteStep = (): Steps => {
    if (!stepStatus) return '1';

    if (!stepStatus.nameFinalization) return '1';
    if (!stepStatus.partners) return '2';
    if (!stepStatus.llpInfo) return '3';
    if (!stepStatus.esign) return '4';

    return '1'; // all completed
  };






  useEffect(() => {
    dispatch(fetchMyLlps());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [step]);

  // const handleNext = () => {
  //   setStep((prev) => {
  //     const index = STEP_ORDER.indexOf(prev);
  //     return STEP_ORDER[index + 1] ?? prev;
  //   });
  // };


  const handleNext = () => {
    setStep((prev) => {
      const index = STEP_ORDER.indexOf(prev);
      return STEP_ORDER[index + 1] ?? prev;
    });
  };


  const handleBack = () => {
    setStep((prev) => {
      const index = STEP_ORDER.indexOf(prev);
      return STEP_ORDER[index - 1] ?? prev;
    });
  };
  useEffect(() => {
    if (!stepStatus) return;

    const isLoaded =
      typeof stepStatus.nameFinalization === 'boolean' &&
      typeof stepStatus.partners === 'boolean' &&
      typeof stepStatus.llpInfo === 'boolean' &&
      typeof stepStatus.esign === 'boolean';

    if (!isLoaded) return;

    const firstIncomplete = getFirstIncompleteStep();

    // ✅ ONLY override default '1'
    setStep(prev => (prev === '1' ? firstIncomplete : prev));
  }, [stepStatus]);




  const [uiLocked, setUiLocked] = useState(false);


  return (
    <>
      {uiLocked && (
        <div className="fixed inset-0 z-[999] bg-black/15 backdrop-blur-[1px]" />
      )}

    <div className='flex flex-col md:flex-row p-2 md:p-8 md:gap-4 overflow-x-hidden overflow-y-auto w-full !h-full'>
      {/* <Stepper
        steps={step}
        setStep={setStep}
        onNext={handleNext}
        onBack={handleBack}
      /> */}
      <Stepper
        steps={step}
        stepStatus={stepStatus}
        setStep={(target) => {
          const firstIncomplete = getFirstIncompleteStep();

          const allCompleted =
            stepStatus?.nameFinalization &&
            stepStatus?.partners &&
            stepStatus?.llpInfo &&
            stepStatus?.esign;

          // ✅ If ALL completed → allow free navigation
          if (!allCompleted) {
            if (
              STEP_ORDER.indexOf(target) >
              STEP_ORDER.indexOf(firstIncomplete)
            ) {
              return;
            }
          }

          setStep(target);
        }}
          // onNext={handleNext}
          // onBack={handleBack}
      />




      <div className='flex-1'>
        {step === '1' && (
          <NameFinalization onNext={handleNext} onBack={handleBack} />
        )}
        {step === '2' && (
          <PartnerDetails onNext={handleNext} onBack={handleBack} />
        )}
        {step === '3' && (
          <InformationAndDocumentForLLP
          onNext={handleNext}
          onBack={handleBack}
          />
        )}
        {step === '4' && (
          <Esign
          onBack={handleBack}
          onNext={handleNext}
          goToStep1={() => setStep('1')} // ✅ navigate to step 1
          setUiLocked={setUiLocked}
          />
        )}{' '}
      </div>
    </div>


        </>
  );





}
