'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LawyerRegistrationBackButton from '../Buttons/LawyerRegistrationBackButton';
import LawyerRegistrationNextButton from '../Buttons/LawyerRegistrationNextButton';
import UploadContainer from '@/components/pages/customer/dashboard/services/components/Upload';
import InputWithLabel from '@/components/pages/customer/dashboard/services/components/InputWithLabel';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hook';
import { submitIdentityVerification } from '../../../../../../redux/slices/lawyer/lawyerOnboardingThunk';


/* ===================== TYPES ===================== */
interface IdentityFormValues {
    fullName: string;
    mobileNumber: string;
    emailAddress: string;
    gender: string;
    barRegistrationNumber: string;
    barCouncilState: string;
    collegeName: string;
    highestQualification: 'LLB' | 'LLM' | 'Other' | '';
    profilePhoto: File | string | null;
    governmentId: File | string | null;
    barCouncilId: File | string | null;
}

interface IdentityAndVerificationProps {
    onNext: () => void;
    onBack: () => void;
}


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const JPG_ONLY = "image/jpeg,image/jpg";
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];


const scrollToFirstError = () => {
    requestAnimationFrame(() => {
        const el = document.querySelector('[aria-invalid="true"], .border-red-500');
        if (el instanceof HTMLElement) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus?.();
        }
    });
};


export default function IdentityAndVerification({ onNext, onBack }: IdentityAndVerificationProps) {

    const { identity, loading, error } = useAppSelector((state) => state.lawyerOnboardingReducer);
    const dispatch = useAppDispatch();
    const { control, handleSubmit, formState: { errors } } = useForm<IdentityFormValues>({
        defaultValues: identity,
        values: identity
    });
    const [stateOpen, setStateOpen] = React.useState(false);
    const [stateSearch, setStateSearch] = React.useState("");

    const onSubmit = async (data: IdentityFormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });

        const result = await dispatch(submitIdentityVerification(formData))
        if (submitIdentityVerification.fulfilled.match(result)) {
            // Success: Ab onNext call karke Step 2 par chale jayein
            onNext();
        } else {
            // Error handling: extraReducers ne state.error update kar diya hoga
            console.error("Verification failed:", error);
        }
    };

    return (
        <Card className='p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl'>
            <form onSubmit={handleSubmit(onSubmit, () => scrollToFirstError())}>
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-[16px] font-semibold text-[#BFBFBF]">Step 1/4</h2>
                    <h1 className="font-inter font-bold text-[24px] text-[#0A2342] mt-1">
                        Identity & Verification
                    </h1>
                    <p className="text-[#595959] text-[16px] font-semibold mt-2">
                        This will be used for official communication and client coordination.
                    </p>
                </div>

                {/* Basic Details Section */}
                <div className="mb-10">
                    <h3 className="font-semibold text-[#595959] text-[20px] mb-4">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            name="fullName"
                            control={control}
                            rules={{ required: 'Full name is required' }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]"
                                    label="Full Name"
                                    placeholder="as per Bar Council"
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    error={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="mobileNumber"
                            control={control}
                            rules={{
                                required: 'Mobile number is required',
                                validate: (v) => INDIAN_MOBILE_REGEX.test(v) || "Enter a valid 10-digit Indian number"
                            }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]"
                                    label="Mobile Number" placeholder="Mobile Number"
                                    maxLength={10}
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                    error={fieldState.error?.message} />
                            )}
                        />


                        <Controller
                            name="emailAddress"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: { value: EMAIL_REGEX, message: 'Invalid email format' }
                            }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]"
                                    label="Email Address" placeholder="Email Address" value={field.value} onChange={field.onChange}
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    error={fieldState.error?.message} />
                            )}
                        />
                        <div className="flex flex-col">
                            <Label className="font-inter font-semibold text-[16px] leading-[24px] text-[#737373] ">
                                Gender
                            </Label>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: 'Gender is required' }}
                                render={({ field, fieldState }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger
                                            aria-invalid={!!fieldState.error}
                                            className={cn(
                                                "w-full border-[#4FC3F7] rounded-[4px] font-inter font-normal text-[16.49px] leading-[24.74px] h-[42px]",
                                                !field.value
                                                    ? "font-inter font-normal text-[16.49px] leading-[24.74px] !text-[#9E9E9E]"
                                                    : "font-inter font-normal text-[16.49px] leading-[24.74px] !text-[#0A2342]",
                                                "[&>svg]:stroke-[#4FC3F7] [&>svg]:opacity-100",
                                                "placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] !placeholder:text-[#9E9E9E]",
                                                fieldState.error ? "border-red-500" : "border-[#4FC3F7]"
                                            )}>
                                            <SelectValue placeholder="Gender" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="MALE">MALE</SelectItem>
                                            <SelectItem value="FEMALE">FEMALE</SelectItem>
                                            <SelectItem value="OTHER">OTHER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender && (
                                <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Qualification & Authority Section */}
                <div className="mb-10">
                    <h3 className="font-semibold text-[20px] text-[#595959] mb-4">Qualification & Authority</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            name="barRegistrationNumber"
                            rules={{ required: 'Bar registration number is required' }}
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]"
                                    inputMode="numeric"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Removes all non-digits
                                        field.onChange(value);
                                    }}
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    label="Bar Council Registration Number" placeholder="Bar Council Registration Number" value={field.value}
                                    error={fieldState.error?.message} />
                            )}
                        />
                        {/* <Controller
                            name="barCouncilState"
                            control={control}
                            rules={{ required: 'Bar Council State is required' }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]"
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    label="Bar Council State" placeholder="Bar Council State" value={field.value} onChange={field.onChange} 
                                    error={fieldState.error?.message}/>
                            )}
                        /> */}
                        <div className="flex flex-col">
                            <Label className="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]">Bar Council State</Label>
                            <Controller
                                name="barCouncilState"
                                control={control}
                                rules={{ required: 'Bar Council State is required' }}
                                render={({ field, fieldState }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger
                                            aria-invalid={!!fieldState.error}
                                            className={cn(
                                                // Core box styling: Force exact height and match your input's horizontal padding
                                                "w-full rounded-[4px] h-[42px] px-3 font-inter border-[#4FC3F7]",

                                                // ✅ THE FONT FIX: Use exact size and leading to match image_7a78ba.png
                                                "text-[16.49px] leading-[24.74px]",

                                                // Color Logic: Placeholder vs. Selected
                                                !field.value ? "text-[#9E9E9E] font-normal" : "text-[#404040] font-normal",

                                                // Error State
                                                fieldState.error ? "border-red-500" : "border-[#4FC3F7]",

                                                // Ensure icon doesn't push text or look bulky
                                                "[&>svg]:stroke-[#4FC3F7] [&>svg]:opacity-100 [&>svg]:size-4"
                                            )}
                                        >
                                            <SelectValue placeholder="State" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {INDIAN_STATES.map((s) => (
                                                <SelectItem key={s} value={s} className="font-inter text-[16.49px]">
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {/* <div className="min-h-[20px]"> */}
                            {errors.barCouncilState && <p className="text-sm text-red-500">{errors.barCouncilState.message}</p>}
                            {/* </div> */}
                        </div>
                        <Controller
                            name="collegeName"
                            control={control}
                            rules={{ required: 'College Name is required' }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]"
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    label="College Name" placeholder="College Name" value={field.value} onChange={field.onChange}
                                    error={fieldState.error?.message} />
                            )}
                        />
                        <div className="flex flex-col gap-2">
                            <Label className="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]">Highest Qualification</Label>
                            <Controller
                                name="highestQualification"
                                control={control}
                                rules={{ required: 'Highest Qualification is required' }}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6 mt-2">
                                        {['LLB', 'LLM', 'Other'].map((option) => (
                                            <label key={option} className="flex items-center gap-2 text-sm text-[#767676] cursor-pointer">
                                                <RadioGroupItem value={option} className={cn("border-[#E5E5E5] ",
                                                    "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                    "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                    "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                                {option.replace('LLB', 'LL.B').replace('LLM', 'LL.M')}
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                            {errors.highestQualification && (
                                <p className="text-sm text-red-500 mt-1">{errors.highestQualification.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Uploads Section */}
                <div className="mb-10">
                    <h3 className="font-inter font-semibold  text-[#595959] text-[20px] mb-1">Uploads</h3>
                    <h2 className='font-inter font-normal text-[16px] text-[#737373]'>
                        <span className='text-[#737373] font-semibold'>Bar Council Registration Number </span>(Front & Back – single or two uploads)
                    </h2>
                    <h2 className='font-inter font-normal text-[16px] text-[#8F8F8F] mb-[20px]'>
                        “Documents are used only for verification and are not shared publicly.”
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            name="profilePhoto"
                            control={control}
                            rules={{ required: 'Profile photo is required' }}
                            render={({ field, fieldState }) => (
                                <UploadContainer
                                    heading="Profile Photo"
                                    accept={JPG_ONLY}
                                    description={<span className="text-[#4FC3F7] text-[14px]">Jpeg format</span>}
                                    value={field.value}
                                    onChange={field.onChange}
                                    headingClassName='text-[16px]'
                                    uploadNameClassName='font-medium text-[13px]'
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="governmentId"
                            control={control}
                            rules={{ required: 'Government Id is required' }}
                            render={({ field, fieldState }) => (
                                <UploadContainer
                                    accept={JPG_ONLY}
                                    heading="Government ID"
                                    description={<span className="text-[#4FC3F7] font-medium text-[12px]"><span className="text-[#104c90]  font-bold ">Aadhar (Recommended)</span> | Voter ID/ Driving Licence / Passport (Any)</span>}
                                    value={field.value}
                                    onChange={field.onChange}
                                    headingClassName='text-[16px]'
                                    uploadNameClassName='font-medium text-[13px]'
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="barCouncilId"
                            control={control}
                            rules={{ required: 'Bar Council Id is required' }}
                            render={({ field, fieldState }) => (
                                <UploadContainer
                                    heading="Bar Council ID"
                                    accept={JPG_ONLY}
                                    description={<span className="text-[#4FC3F7] text-[14px]">Jpeg format</span>}
                                    value={field.value}
                                    onChange={field.onChange}
                                    headingClassName='text-[16px]'
                                    uploadNameClassName='font-medium text-[13px]'
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex justify-between items-center mt-12">
                    <LawyerRegistrationBackButton onClick={onBack} />
                    <LawyerRegistrationNextButton type="submit" loading={loading}>
                        {loading ? "Processing..." : "Next"}
                    </LawyerRegistrationNextButton>
                </div>

                {/* Progress Bar (Figma style) */}
                <div className="mt-8 flex gap-1 w-full">
                    <div className="h-[2px] w-1/2 bg-[#1565C0]" />
                    <div className="h-[2px] w-1/2 bg-[#B7E3F8]" />
                </div>
            </form>
        </Card>
    );
}