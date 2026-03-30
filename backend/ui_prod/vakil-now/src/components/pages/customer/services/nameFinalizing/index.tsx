'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/lib/icons';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { saveNameCheck } from '../../../../../../redux/slices/llp/llpSlice';
import {
  checkCompanyName,
  submitNameFinalization
} from '../../../../../../redux/slices/llp/llpThunk';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import { StepNavigationProps } from '../llpInfoDetails';

/* ===================== TYPES ===================== */
interface FormValues {
  companyName: string;
  alternateName1?: string;
  alternateName2?: string;
  alternateName3?: string;
  object: string;
}

export default function NameFinalization ({
  onNext,
  onBack
}: StepNavigationProps) {
  const dispatch = useDispatch<AppDispatch>();

  const savedData = useSelector(
    (state: RootState) => state.llpReducer.nameFinalization
  );

  const nameCheck = useSelector(
    (state: RootState) => state.llpReducer.nameCheck
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      companyName: '',
      alternateName1: '',
      alternateName2: '',
      alternateName3: '',
      object: ''
    }
  });

  const hasHydrated = useRef(false);
  const [typingName, setTypingName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ===================== HYDRATE ===================== */
  useEffect(() => {
    if (!hasHydrated.current && savedData?.companyName) {
      reset(savedData, { keepDirty: false });
      hasHydrated.current = true;
    }
  }, [savedData, reset]);

  /* ===================== NAME CHECK ===================== */
  useEffect(() => {
    if (typingName.trim().length < 3) return;

    const timer = setTimeout(() => {
      dispatch(saveNameCheck({ ...nameCheck, loading: true }));

      dispatch(checkCompanyName(typingName))
        .unwrap()
        .then((res) => {
          dispatch(saveNameCheck({ ...res, loading: false }));

          if (!res.available && res.suggestions) {
            setValue('alternateName1', res.suggestions[0] || '', {
              shouldDirty: false
            });
            setValue('alternateName2', res.suggestions[1] || '', {
              shouldDirty: false
            });
            setValue('alternateName3', res.suggestions[2] || '', {
              shouldDirty: false
            });
          }
        })
        .catch(() => {
          dispatch(
            saveNameCheck({
              available: false,
              message: 'Unable to check name',
              loading: false
            })
          );
        });
    }, 600);

    return () => clearTimeout(timer);
  }, [typingName, dispatch, setValue]);

  /* ===================== SUBMIT ===================== */
  const onSubmit = async (data: FormValues) => {
    if (!isDirty) {
      onNext();
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        submitNameFinalization({
          companyName: data.companyName,
          object: data.object
        })
      ).unwrap();
      onNext();
    } finally {
      setSubmitting(false);
    }
  };

  const nameTaken = nameCheck.available === false;

  /* ===================== UI ===================== */
  return (
    <Card className='p-0 border-0 md:border md:p-12 max-w-5xl mx-auto h-full md:shadow-2xl'>

      {/* <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col h-full'> */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        {/* ===== Scrollable Content ===== */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-base text-semibold text-[#BFBFBF]">Step 1/4</h1>

            <h1 className="font-inter font-semibold text-[18px] md:text-2xl md:font-bold text-[#04103B] text-[#0A2342] md:mt-1">
              Name Finalization
            </h1>

            <p className="text-sm md:text-base font-semibold text-[#737373] md:text-[#595959] md:mt-2 md:max-w-2xl">
              Drop in the name you have in mind — our system instantly checks the MCA
              database and tells you if it’s good to go.
            </p>
          </div>

          {/* Company Name */}
          <div className="space-y-2 mb-6">
            <Label className="font-semibold text-md text-[#737373] md:font-medium">
              Proposed Name of the Company
            </Label>

            <Input
              {...register('companyName', {
                required: 'Company name is required',
                minLength: { value: 3, message: 'Minimum 3 characters required' }
              })}
              placeholder='Name of the company'
              onChange={(e) => setTypingName(e.target.value)}
              className="
      h-11
      border border-[#4FC3F7]
      rounded
      hover:border-[#4FC3F7]
      focus:border-[#4FC3F7]
      focus-visible:border-[#4FC3F7]
      focus:ring-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
    "          />

            {errors.companyName && (
              <p className='text-sm text-red-500'>{errors.companyName.message}</p>
            )}

            {nameCheck.loading && (
              <p className='text-sm text-gray-500'>Checking availability…</p>
            )}

            {nameCheck.available === true && (
              <div className='flex items-center font-semibold gap-2 text-[#1565C0] text-md mt-2'>
                <Icons.GreenCheckIcon className='w-6 h-6' />
                Requested name available
              </div>
            )}

            {nameTaken && (
              <p className='sm:text-base text-sm font-semibold text-[#FF6161] mt-3'>
                *Name taken? No stress. Our AI curates fresh, creative, legally
                safe alternatives that still match your vibe
              </p>
            )}
          </div>

          {/* Alternate Names */}
          {nameTaken && (
            <div className='grid grid-cols-3 gap-4 mb-8'>
              {(
                ['alternateName1', 'alternateName2', 'alternateName3'] as const
              ).map((key, i) => {
                const value = watch(key);
                return (
                  <Input
                    key={key}
                    readOnly
                    value={value || ''}
                    placeholder={`Option ${i + 1}`}
                    className='
                      h-11
                      bg-sky-50
                      text-md
                      border border-[#4FC3F7]
                      rounded
                      cursor-pointer
                      text-[#737373]
                      transition
                    '
                    onClick={() => {
                      if (!value) return;

                      setValue('companyName', value, { shouldDirty: true });

                      dispatch(
                        saveNameCheck({
                          available: true,
                          message: 'Selected alternative name',
                          loading: false
                        })
                      );
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Object */}
          <div className="space-y-2 flex-1">
            <Label className="font-semibold text-md text-[#737373] md:font-medium  md:text-md">
              Object
            </Label>

            {/* <Textarea
              {...register('object', {
                required: 'LLP purpose is required'
              })}
              placeholder="Write your LLP’s purpose in your own words – simple, raw, straight from you."
    className="
      min-h-[160px]
      border border-[#4FC3F7]
      rounded
      hover:border-[#4FC3F7]
      focus:border-[#4FC3F7]
      focus-visible:border-[#4FC3F7]
      focus:ring-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
    "          /> */}

            <div className="relative w-full">
              {/* Original Badge */}
              {/* <span
                className="
        absolute
        top-3
        left-3
        z-10
        rounded
        bg-[#E5F6FE]
        px-5
        py-2
        w-22
        h-9
        text-sm
        font-medium
        text-[#535454]
      "
              >
                Original
              </span> */}

              {/* <button
                type="button"
                className="
        absolute
        top-3
        right-3
        z-10
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded
        bg-[#1565C0]
        text-white
        text-xs
        hover:bg-[#1565C0]
      "
              >
                <Icons.AIIcon />
              </button> */}

              {/* Textarea */}
              <Textarea
                {...register("object", {
                  required: "LLP purpose is required",
                })}
                placeholder="Write your LLP’s purpose in your own words – simple, raw, straight from you."
                className="
        min-h-[160px]
        border
        border-[#4FC3F7]
        rounded
      pt-3
        px-4
        hover:border-[#4FC3F7]
        focus:border-[#4FC3F7]
        focus-visible:border-[#4FC3F7]
        focus:ring-0
        focus-visible:ring-0
        focus-visible:ring-offset-0
      "
              />
            </div>


            {errors.object && (
              <p className='text-sm text-red-500'>{errors.object.message}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-12">
          <Button
            type="submit"
            className="h-11 px-4 md:h-9 md:px-5 bg-[#1565C0]  rounded hover:bg-[#1565C0]"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Next"}
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
  );
}
