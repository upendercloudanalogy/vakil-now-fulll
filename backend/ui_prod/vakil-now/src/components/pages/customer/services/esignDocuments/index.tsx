'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  SubmitEsignPayload,
  submitLlpEsign
} from '../../../../../../redux/slices/llp/llpThunk';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import PdfUploadCard from '../../dashboard/services/components/PdfUploadCard';

/* ===================== TYPES ===================== */
interface EsignFormValues {
  subscriberSheet: File | null;
  partnerFiles: Record<string, File | null>;
}
interface EsignProps {
  onNext: () => void;
  onBack: () => void;
  goToStep1: () => void;
  setUiLocked: (v: boolean) => void;
}

export default function Esign ({ onNext, onBack, goToStep1, setUiLocked }: EsignProps) {
  const dispatch = useDispatch<AppDispatch>();

  const llpId = useSelector((s: RootState) => s.llpReducer.llpId);
  const partners = useSelector((s: RootState) => s.llpReducer.partners);
  const llpInfo = useSelector((s: RootState) => s.llpReducer.llpInfo);
  

  const form9Ref = useRef<HTMLDivElement>(null);
  const subscriberRef = useRef<HTMLDivElement>(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [walkStep, setWalkStep] = useState<0 | 1 | null>(0);

  useEffect(() => {
    setUiLocked(true);
  }, []);



  // const { handleSubmit, setValue, watch } = useForm<EsignFormValues>({
  //   defaultValues: {
  //     subscriberSheet: null,
  //     partnerFiles: {}
  //   }
  // });
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<EsignFormValues>({
    defaultValues: {
      subscriberSheet: null,
      partnerFiles: {}
    }
  });


  const subscriberSheet = watch('subscriberSheet');
  const partnerFiles = watch('partnerFiles');

  /* ===================== SUBMIT ===================== */
  // const onSubmit = async (data: EsignFormValues) => {
  //   if (!llpId) return;

  //   setError(null);

  //   const hasExistingSubscriberSheet = !!llpInfo?.subscriberSheetUrl;
  //   const hasNewSubscriberSheet = data.subscriberSheet instanceof File;

  //   if (!hasExistingSubscriberSheet && !hasNewSubscriberSheet) {
  //     setError('Subscriber sheet is required');
  //     return;
  //   }

  //   for (const partner of partners) {
  //     const hasExistingForm9 = !!partner.esignDocuments?.form9?.signedUrl;

  //     const hasNewForm9 =
  //       partner.id && data.partnerFiles?.[partner.id] instanceof File;

  //     if (!hasExistingForm9 && !hasNewForm9) {
  //       setError(`Form 9 is required for ${partner.name || 'a partner'}`);
  //       return;
  //     }
  //   }

  //   const cleanedPartnerFiles: Record<string, File> = Object.fromEntries(
  //     Object.entries(data.partnerFiles).filter(
  //       (entry): entry is [string, File] => entry[1] instanceof File
  //     )
  //   );

  //   const payload: SubmitEsignPayload = {
  //     llpId,
  //     partnerFiles: cleanedPartnerFiles,
  //     ...(hasNewSubscriberSheet && {
  //       subscriberSheet: data.subscriberSheet!
  //     })
  //   };

  //   setLoading(true);
  //   const result = await dispatch(submitLlpEsign(payload));
  //   setLoading(false);

  //   if (submitLlpEsign.fulfilled.match(result)) {
  //     toast.success('llp Registration successfully', {
  //       // description: "Subscriber sheet and Form-9 documents were uploaded.",
  //       position: 'top-center'
  //     });
  //     await Promise.resolve();
  //     goToStep1();
  //     // onNext();
  //   } else {
  //     toast.error('Upload failed', {
  //       description: 'Failed to upload e-Sign documents. Please try again.'
  //     });
  //     setError('Failed to upload eSign documents');
  //   }
  // };


  const onSubmit = async (data: EsignFormValues) => {
    if (!llpId) return;

    const cleanedPartnerFiles = Object.fromEntries(
      Object.entries(data.partnerFiles).filter(
        (entry): entry is [string, File] =>
          entry[1] instanceof File
      )
    );

    const payload: SubmitEsignPayload = {
      llpId,
      partnerFiles: cleanedPartnerFiles,
      ...(data.subscriberSheet && {
        subscriberSheet: data.subscriberSheet
      })
    };

    setLoading(true);
    const result = await dispatch(submitLlpEsign(payload));
    setLoading(false);

    if (submitLlpEsign.fulfilled.match(result)) {
      toast.success('LLP Registration successfully', { position: 'top-center' });
      goToStep1();
    } else {
      toast.error('Upload failed');
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  // const [walkStep, setWalkStep] = useState<0 | 1 | null>(0);

  useEffect(() => {
    if (walkStep === null) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const targetEl =
        walkStep === 0 ? form9Ref.current : subscriberRef.current;

      if (!targetEl) return;

      const tooltipEl = document.getElementById('coach-tooltip');
      if (tooltipEl && tooltipEl.contains(e.target as Node)) return;

      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [walkStep]);


  /* ===================== UI ===================== */
  return (
    <div ref={containerRef} className="relative">
      {/* {walkStep !== null && (
        <div className="absolute inset-0 z-[900] bg-black/15 backdrop-blur-[1px]" />
      )} */}


      {walkStep !== null && (
        <CoachTooltip
          step={walkStep}
          containerRef={containerRef}
          targetRef={walkStep === 0 ? form9Ref : subscriberRef}
          title={walkStep === 0 ? 'FORM 9 & DECLARATION' : 'SUBSCRIBER SHEET'}
          content={
            walkStep === 0 ? (
              <>Each partner downloads their own copy, prints, signs individually, and uploads their signed PDF - quick and straightforward.</>
            ) : (
              <>
                <span className="font-semibold">NOTE:</span>{' '}
                These need signatures from all partners — so one partner downloads and prints the form, signs it, uploads the PDF, then the next partner downloads the same file (now bearing earlier signatures), signs, re-uploads, and so on until everyone’s signed.
              </>
            )
          }
          onNext={() => {
            if (walkStep === 0) setWalkStep(1);
            else {
              setWalkStep(null);
              setUiLocked(false);   // 🔓 unlock everything
            }
          }}
          isLast={walkStep === 1}
        />
      )}







      <Card className='p-0 md:p-16 md:rounded border-0 md:border md:shadow-2xl md:h-full md:w-full'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col h-full justify-between'>
          <div className='flex flex-col gap-0 md:gap-10 flex-1'>
            {/* HEADER */}
            <div className="mb-5 md:mb-0">
              <h2 className="text-md text-semibold text-[#BFBFBF]">Step 4/4</h2>
              <h1 className="font-inter font-semibold text-[18px] md:text-2xl md:font-bold text-[#04103B] md:mt-1">
                eSign
              </h1>
              <p className="font-medium text-sm  text-[#737373] md:text-base md:mt-2 md:font-semibold md:max-w-2xl">
                We’ll use this to share updates with your partner” makes the user feel guided.
              </p>
            </div>

            {error && <p className='text-red-500 font-medium'>{error}</p>}

            {/* ================= FORM 9 & DECLARATION ================= */}
            {/* <div className='flex flex-col gap-2'>
            <p className='text-md font-semibold text-gray-700 uppercase'>
              FORM 9 & DECLARATION
            </p>

            <p className='text-sm text-[#FF383C] leading-relaxed max-w-3xl'>
              NOTE: Each partner downloads their own copy, prints, signs
              individually, and uploads their signed PDF – quick and
              straightforward.
            </p>

            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-8'>
              {partners.map((partner, index) => {
                const newFile = partner.id && partnerFiles?.[partner.id];
                const existingFile = partner.esignDocuments?.form9;

                return (
                  <PdfUploadCard
                    key={partner.id ?? index}
                    description={` Need sign of – ${partner.name || `Partner ${index + 1}`}`}
                    initialFile={
                      newFile instanceof File
                        ? newFile
                        : existingFile
                          ? {
                            fileName: existingFile.fileName,
                            signedUrl: existingFile.signedUrl
                          }
                          : null
                    }
                    onFileSelect={(file) => {
                      if (!partner.id) return;
                      setValue(`partnerFiles.${partner.id}`, file, {
                        shouldDirty: true
                      });
                    }}
                  />
                );
              })}
            </div>
          </div> */}

            <div>

              <div ref={form9Ref}>
                <p className="text-md font-semibold mb-4 text-[#737373] cursor-pointer">
                  FORM 9 & DECLARATION
                </p>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                {partners.map((partner, index) => {
                  if (!partner.id) return null;

                  return (
                    <Controller
                      key={index}
                      control={control}
                      name={`partnerFiles.${partner.id}`}
                      rules={{
                        validate: (file) => {
                          if (partner.esignDocuments?.form9?.signedUrl) return true;
                          if (file instanceof File) return true;
                          return `Form 9 is required for ${partner.name || 'this partner'}`;
                        }
                      }}
                      render={({ field, fieldState }) => (
                        <div>
                          <PdfUploadCard
                            description={`Need sign of – ${partner.name || 'Partner'}`}
                            initialFile={
                              field.value instanceof File
                                ? field.value
                                : partner.esignDocuments?.form9
                                  ? {
                                    fileName: partner.esignDocuments.form9.fileName,
                                    signedUrl: partner.esignDocuments.form9.signedUrl
                                  }
                                  : null
                            }
                            onFileSelect={field.onChange}
                          />

                          {fieldState.error && (
                            <p className="mt-1 text-sm text-red-500">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                  );
                })}
              </div>
            </div>


            <div ref={subscriberRef} className='flex flex-col gap-2 mt-6'>
              <p className='text-md font-semibold text-[#737373]'>
                Details of Directorship & Subscriber Sheet
              </p>

              {/* <p className='text-sm text-[#FF383C] leading-relaxed max-w-3xl'>
              NOTE: These need signatures from all partners — so one partner
              downloads and prints the form, signs it, uploads the PDF, then the
              next partner downloads the same file (now bearing earlier
              signatures), signs, re-uploads, and so on until everyone’s signed.
            </p>  */}

              {/* <div className="relative inline-block group">
              <p className="text-md font-semibold text-[#737373] cursor-pointer">
                Details of Directorship & Subscriber Sheet
              </p>

              <div
                className="
      absolute left-0 top-full mt-2
      hidden group-hover:block
      w-[420px]
      bg-white
      border border-blue-500
      rounded-lg
      shadow-lg
      p-4
      text-sm
      text-gray-700
      z-50
    "
              >
                <p className="font-semibold mb-1">NOTE:</p>
                <p className="leading-relaxed">
                  These need signatures from all partners — so one partner downloads and
                  prints the form, signs it, uploads the PDF, then the next partner
                  downloads the same file (now bearing earlier signatures), signs,
                  re-uploads, and so on until everyone’s signed.
                </p>
              </div>
            </div> */}


              <div className='mt-4 max-w-md'>
                {/* <PdfUploadCard
                description='Need all partners sign'
                initialFile={
                  subscriberSheet instanceof File
                    ? subscriberSheet
                    : (llpInfo?.subscriberSheetUrl ?? null)
                }
                onFileSelect={(file) =>
                  setValue('subscriberSheet', file, {
                    shouldDirty: true
                  })
                }
              /> */}
                <Controller
                  control={control}
                  name="subscriberSheet"
                  rules={{
                    validate: (file) => {
                      if (llpInfo?.subscriberSheetUrl) return true;
                      if (file instanceof File) return true;
                      return 'Subscriber sheet is required';
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <div>
                      <PdfUploadCard
                        description="Need all partners sign"
                        initialFile={
                          field.value instanceof File
                            ? field.value
                            : llpInfo?.subscriberSheetUrl ?? null
                        }
                        onFileSelect={field.onChange}
                      />

                      {fieldState.error && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />



              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className='flex justify-between items-center mt-10'>
            <Button
              type='button'
              variant='outline'
              className='rounded h-11 px-4 text-[#1A1A1A] bg-[#E8E8E8] hover:bg-[#EDEDED] md:h-9 md:px-5'
              onClick={onBack}>
              Back
            </Button>

            <Button
              type='submit'
              disabled={loading}
              className='bg-[#1565C0] rounded h-11 px-4 md:h-9 md:px-5 hover:bg-[#1565C0]'>
              {loading ? 'Uploading...' : 'Save'}
            </Button>
          </div>
          <div className="mt-6 gap-1 flex w-full">
            {/* Blue line */}
            <div className="h-[2px] w-1/2 bg-[#1565C0]" />

            {/* Sky blue line */}
            <div className="h-[2px] w-1/2 bg-[#B7E3F8]" />
          </div>
        </form>
      </Card>
    </div>
  );
}



function CoachTooltip ({
  step,
  containerRef,
  targetRef,
  title,
  content,
  onNext,
  isLast
}: {
  step: 0 | 1;
  containerRef: React.RefObject<HTMLElement | null>;
  targetRef: React.RefObject<HTMLElement | null>;
  title: string;
  content: React.ReactNode;
  onNext: () => void;
  isLast?: boolean;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const tooltipRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!targetRef.current || !containerRef.current || !tooltipRef.current) return;

  //   const targetRect = targetRef.current.getBoundingClientRect();
  //   const containerRect = containerRef.current.getBoundingClientRect();
  //   const tooltipRect = tooltipRef.current.getBoundingClientRect();

  //   const baseOffset = step === 0 ? 20 : 20; // 20px above both headings

  //   let top =
  //     targetRect.top -
  //     containerRect.top -
  //     tooltipRect.height -
  //     baseOffset;

  //   // 🧯 Mobile safety clamp
  //   const minTop = 8;
  //   if (top < minTop) top = minTop;

  //   let left = targetRect.left - containerRect.left;

  //   const maxLeft = containerRect.width - tooltipRect.width - 8;
  //   if (left > maxLeft) left = maxLeft;
  //   if (left < 8) left = 8;

  //   setPos({ top, left });

  //   targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // }, [step]);

  useEffect(() => {
    if (!targetRef.current || !containerRef.current || !tooltipRef.current) return;

    const compute = () => {
      const targetRect = targetRef.current!.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();

      const baseOffset = 20;

      let top =
        targetRect.top -
        containerRect.top -
        tooltipRect.height -
        baseOffset;

      // Mobile safety clamp
      if (top < 8) top = 8;

      let left = targetRect.left - containerRect.left;
      const maxLeft = containerRect.width - tooltipRect.width - 8;
      if (left > maxLeft) left = maxLeft;
      if (left < 8) left = 8;

      setPos({ top, left });
    };

    // First measure
    compute();

    // Scroll first
    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for mobile layout to settle, then recompute
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(compute);
      return () => cancelAnimationFrame(raf2);
    });

    return () => cancelAnimationFrame(raf1);
  }, [step]);



  return (
    <div
      id="coach-tooltip"
      ref={tooltipRef}
      style={{ top: pos.top, left: pos.left }}
      className="absolute z-[1000] w-[300px]"
    >
      {/* Speech Bubble */}
      <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col min-w-[327px] min-h-[144px] md:min-w-[529px] md:min-h-[129px]" >

        {/* Content */}
        <div className="text-[14px] font-inter font-medium text-[#535454]">
          {content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Pagination Dots */}
          <div className="flex gap-2">
            <span className={`w-2 h-2 rounded-full ${!isLast ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <span className={`w-2 h-2 rounded-full ${isLast ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>

          <Button
            size="lg"
            onClick={onNext}
            className="bg-[#1565C0] hover:bg-[#1565C0] text-[14px] rounded-md"
          >
            {isLast ? 'Done' : 'Next'}
          </Button>
        </div>

        {/* Arrow */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white rotate-45 shadow-lg" />
      </div>
    </div>
  );
}
