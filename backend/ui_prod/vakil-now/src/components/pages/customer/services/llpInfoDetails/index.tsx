'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateFileField } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { submitLlpInfo } from '../../../../../../redux/slices/llp/llpThunk';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import InputWithLabel from '../../dashboard/services/components/InputWithLabel';
import UploadContainer from '../../dashboard/services/components/Upload';

/* ===================== TYPES ===================== */

export interface StepNavigationProps {
  onNext: () => void;
  onBack: () => void;
}

interface LLPFormValues {
  email: string;
  mobileNumber1: string;
  mobileNumber2?: string;
  address: string;
  durationOfStay: string;
  residentialProof: File | null;
  noc: File | null;
  /** ✅ explicit delete intent */
  removeResidentialProof?: boolean;
  removeNoc?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

/* ===================== COMPONENT ===================== */

export default function InformationAndDocumentForLLP ({
  onNext,
  onBack
}: StepNavigationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const llpId = useSelector((s: RootState) => s.llpReducer.llpId);
  const savedLlpInfo = useSelector((s: RootState) => s.llpReducer.llpInfo);

  const hydrated = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<LLPFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      mobileNumber1: '',
      mobileNumber2: '',
      address: '',
      durationOfStay: '',
      residentialProof: null,
      noc: null,
      removeResidentialProof: false,
      removeNoc: false
    }
  });

  /* ===================== HYDRATE ===================== */

  useEffect(() => {
    if (!hydrated.current && savedLlpInfo) {
      // reset(
      //   {
      //     email: savedLlpInfo.email ?? '',
      //     mobileNumber1: savedLlpInfo.mobileNumber1 ?? '',
      //     mobileNumber2: savedLlpInfo.mobileNumber2 ?? '',
      //     address: savedLlpInfo.address ?? '',
      //     durationOfStay: savedLlpInfo.durationOfStay ?? '',
      //     residentialProof: null,
      //     noc: null
      //   },
      //   { keepDirty: false }
      // );
      reset(
        {
          email: savedLlpInfo.email ?? '',
          mobileNumber1: savedLlpInfo.mobileNumber1 ?? '',
          mobileNumber2: savedLlpInfo.mobileNumber2 ?? '',
          address: savedLlpInfo.address ?? '',
          durationOfStay: savedLlpInfo.durationOfStay ?? '',

          residentialProof: null,
          noc: null,

          removeResidentialProof: false,
          removeNoc: false
        },
        { keepDirty: false }
      );

      hydrated.current = true;
    }
  }, [savedLlpInfo, reset]);

  /* ===================== SUBMIT ===================== */

  const onSubmit = async (data: LLPFormValues) => {
    if (!llpId) return;

    if (
      !isDirty &&
      !data.removeResidentialProof &&
      !data.removeNoc
    ) {
      onNext();
      return;
    }


    const payload = {
      email: data.email,
      mobileNumber1: data.mobileNumber1,
      mobileNumber2: data.mobileNumber2,
      address: data.address,
      durationOfStay: data.durationOfStay,
      residentialProof:
        data.residentialProof instanceof File ? data.residentialProof : undefined,
      noc: data.noc instanceof File ? data.noc : undefined,
      removeResidentialProof: data.removeResidentialProof === true,
      removeNoc: data.removeNoc === true
    };

    const result = await dispatch(submitLlpInfo({ llpId, form: payload }));

    if (submitLlpInfo.fulfilled.match(result)) {
      onNext();
    }
  };
  const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;


  return (

    <Card className="p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div className="grid grid-cols-1 gap-3 md:gap-10">

          {/* ================= HEADER ================= */}
          <div>
            <h2 className="text-md text-semibold text-[#BFBFBF]">Step 3/4</h2>
            <h1 className="font-inter font-semibold md:font-bold text-[18px] md:text-2xl text-[#04103B] md:text-[#0A2342] md:mt-1">
              Information & Documents for LLP
            </h1>
            <p className="font-medium text-sm md:text-base text-[#595959] md:mt-2 md:font-semibold md:max-w-2xl">
              Write your LLP’s purpose in your own words – simple, raw, straight from you.
            </p>
          </div>

          {/* ================= EMAIL ================= */}
          {/* ================= EMAIL + MOBILE + ADDRESS ================= */}

          {/* ---------- MOBILE LAYOUT ---------- */}
          <div className="block md:hidden space-y-4">

            {/* EMAIL */}
            <div>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: EMAIL_REGEX, message: 'Invalid email format' },
                }}
                render={({ field }) => (
                  <InputWithLabel
                    label="Email ID of LLP"
                    placeholder="Email ID"
                    {...field}
                    error={errors.email?.message}
                  />
                )}
              />
              <p className="text-[#999999] font-semibold mt-1">
                * It will be used for alert / notification by govt
              </p>
            </div>

            {/* MOBILE */}
            <div>
              <label className="text-md font-medium text-[#737373]">
                Mobile Number
              </label>
              <p className="text-[#999999] font-semibold mt-2 mb-2">
                * Numbers of partners can be used as LLP mobile number
              </p>

              <div className="space-y-3">
                <Controller
                  control={control}
                  name="mobileNumber1"
                  rules={{
                    required: "Mobile number is required",
                    pattern: { value: /^\d{10}$/, message: "Mobile must be 10 digits" },
                    validate: (value) => {
                      if (!/^\d+$/.test(value)) return 'Only digits allowed';
                      if (!INDIAN_MOBILE_REGEX.test(value))
                        return 'Enter a valid 10-digit Indian mobile number';
                      if (!value) return 'Mobile number is required';
                      if (!/^\d+$/.test(value)) {
                        return 'Only digits allowed';
                      }
                      if (!/^[6-9]\d{9}$/.test(value)) {
                        return 'Enter a valid 10-digit Indian mobile number';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <InputWithLabel
                      placeholder="Mobile Number 1"
                      maxLength={10}
                      inputMode="numeric"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value)) return;
                        field.onChange(value);
                      }}
                      error={errors.mobileNumber1?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="mobileNumber2"
                  rules={{
                    validate: (value) => {
                      if (!value) return true; // optional

                      if (!/^\d+$/.test(value))
                        return 'Only digits allowed';

                      if (!INDIAN_MOBILE_REGEX.test(value))
                        return 'Enter a valid 10-digit Indian mobile number';

                      if (!/^[6-9][0-9]{9}$/.test(value)) {
                        return 'Enter a valid 10-digit Indian mobile number';
                      }
                      if (!/^[6-9]\d{9}$/.test(value)) {
                        return 'Enter a valid 10-digit Indian mobile number';
                      }

                      if (value === watch('mobileNumber1'))
                        return 'Mobile number 2 cannot be same as mobile number 1';

                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <InputWithLabel
                      placeholder="Mobile Number 2"
                      maxLength={10}
                      inputMode="numeric"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value)) return; // digits only
                        field.onChange(value);
                      }}
                      error={errors.mobileNumber2?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <Controller
                control={control}
                name="address"
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <InputWithLabel
                    label=" Address of Registered Office Proof"
                    placeholder="Address of Registered Office"
                    {...field}
                    error={errors.address?.message}
                  />
                )}
              />
            </div>

          </div>

          {/* ---------- DESKTOP LAYOUT ---------- */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">

            {/* EMAIL */}
            <div>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Invalid email format',
                  },
                }}
                render={({ field }) => (
                  <InputWithLabel
                    label="Email ID of LLP"
                    placeholder="Email ID"
                    {...field}
                    error={errors.email?.message}
                  />
                )}
              />

              <p className="text-[#999999] font-semibold mt-1">
                * It will be used for alert / notification by govt
              </p>
            </div>

            {/* ADDRESS */}
            <div>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <InputWithLabel
                    label="Registered Office Proof"
                    placeholder="Address of Registered Office"
                    {...field}
                    error={errors.address?.message}
                  />
                )}
              />
            </div>

            {/* MOBILE (FULL WIDTH) */}
            <div className="md:col-span-2 mt-4">
              <label className="text-md font-medium text-[#737373]">
                Mobile Number
              </label>


              <div className="grid grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="mobileNumber1"
                  rules={{
                    required: 'Mobile number is required',
                    pattern: {
                      value: MOBILE_REGEX,
                      message: 'Mobile must be 10 digits',
                    },
                    validate: (value) => {
                      if (!/^\d+$/.test(value)) return 'Only digits allowed';
                      if (!INDIAN_MOBILE_REGEX.test(value))
                        return 'Enter a valid 10-digit Indian mobile number';
                      if (!value) return 'Mobile number is required';
                      if (!/^\d+$/.test(value)) {
                        return 'Only digits allowed';
                      }
                      if (!/^[6-9]\d{9}$/.test(value)) {
                        return 'Enter a valid 10-digit Indian mobile number';
                      }
                      return true;
                    },
                  }}
                  render={({ field: rhfField, fieldState }) => (
                    <InputWithLabel
                      placeholder="Mobile Number 1"
                      value={rhfField.value}
                      aria-invalid={!!fieldState.error}
                      inputMode="numeric"
                      maxLength={10}               // ✅ browser enforced
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value)) return; // ✅ digits only
                        rhfField.onChange(value);            // ✅ no slicing
                      }}
                      error={errors.mobileNumber1?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="mobileNumber2"
                  rules={{
                    pattern: {
                      value: MOBILE_REGEX,
                      message: 'Mobile must be 10 digits',
                    },
                    validate: (value) => {
                      if (!value) return true; // optional

                      if (!/^\d+$/.test(value))
                        return 'Only digits allowed';

                      if (!INDIAN_MOBILE_REGEX.test(value))
                        return 'Enter a valid 10-digit Indian mobile number';

                      if (!/^[6-9][0-9]{9}$/.test(value)) {
                        return 'Enter a valid 10-digit Indian mobile number';
                      }
                      if (!/^[6-9]\d{9}$/.test(value)) {
                        return 'Enter a valid 10-digit Indian mobile number';
                      }

                      if (value === watch('mobileNumber1'))
                        return 'Mobile number 2 cannot be same as mobile number 1';

                      return true;
                    },
                  }
                  }
                  render={({ field: rhfField, fieldState }) => (
                    <InputWithLabel
                      placeholder="Mobile Number 2"
                      value={rhfField.value ?? ''}
                      aria-invalid={!!fieldState.error}
                      inputMode="numeric"
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value)) return;
                        rhfField.onChange(value);
                      }}
                      error={errors.mobileNumber2?.message}
                    />
                  )}
                />

              </div>
              <p className="text-[#999999] font-semibold mb-2">
                * Numbers of partners can be used as LLP mobile number
              </p>
            </div>

          </div>


          {/* ================= UPLOADS ================= */}
          <div className="order-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              control={control}
              name="noc"
              rules={{
                validate: () =>
                  validateFileField({
                    rhfValue: watch('noc'),
                    backendValue: savedLlpInfo?.nocUrl,
                    removed: watch('removeNoc'),
                    errorMessage: 'NOC is required',
                  }),
              }}
              render={({ field, fieldState }) => (
                <UploadContainer
                  heading="NOC"
                  description={
                    <span className="font-semibold text-[12px] md:text-[16px]">
                      *Fill the basics – we auto-draft the NOC, send it for e-sign,
                      and it pops back here signed. Done.
                    </span>
                  }
                  value={field.value ?? savedLlpInfo?.nocUrl ?? null}
                  onChange={(file) => {
                    // 1️⃣ Set new file
                    field.onChange(file);

                    // 2️⃣ CLEAR remove flag
                    setValue('removeNoc', false, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  onRemove={() => {
                    setValue('removeNoc', true, { shouldDirty: true });
                    setValue('noc', null, { shouldDirty: true });
                  }}

                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="residentialProof"
              rules={{
                validate: () =>
                  validateFileField({
                    rhfValue: watch('residentialProof'),
                    backendValue: savedLlpInfo?.residentialProofUrl,
                    removed: watch('removeResidentialProof'),
                    errorMessage: 'Residential proof is required',
                  }),
              }}
              render={({ field, fieldState }) => (
                <UploadContainer
                  heading="Residential proof"
                  description={
                    <span className="font-medium text-[12px] text-[#4FC3F7]">
                      <span className="text-red-500">
                        Bank Statement (Recommended)
                      </span>
                      {' / Telephone bill / Electricity bill (Any one not older than 2 months)'}
                    </span>
                  }
                  value={field.value ?? savedLlpInfo?.residentialProofUrl ?? null}
                  onChange={(file) => {
                    // 1️⃣ Set new file
                    field.onChange(file);

                    // 2️⃣ CLEAR remove flag
                    setValue('removeResidentialProof', false, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  onRemove={() => {
                    setValue('removeResidentialProof', true, { shouldDirty: true });
                    setValue('residentialProof', null, { shouldDirty: true });
                  }}

                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-between mt-12">
          <Button type="button" variant="outline" className="rounded h-11 px-4 text-[#1A1A1A] bg-[#E8E8E8] hover:bg-[#EDEDED] md:h-9 md:px-5" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className='bg-[#1565C0] rounded h-11 px-4 md:h-9 md:px-5 hover:bg-[#1565C0]'>
            Next
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
