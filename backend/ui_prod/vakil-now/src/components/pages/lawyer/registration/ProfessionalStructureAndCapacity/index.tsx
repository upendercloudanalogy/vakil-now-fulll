'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LawyerRegistrationBackButton from '../Buttons/LawyerRegistrationBackButton';
import LawyerRegistrationNextButton from '../Buttons/LawyerRegistrationNextButton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import InputWithLabel from '@/components/pages/customer/dashboard/services/components/InputWithLabel';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hook';
import { submitProfessionalDetails } from '../../../../../../redux/slices/lawyer/lawyerOnboardingThunk';

/* ===================== TYPES ===================== */
interface ProfessionalFormValues {
    servicesWillingToProvide: 'Consultation' | 'FullLegalService' | '';
    practiceType: 'Individual' | 'LawFirm' | '';
    officeAddressLine1: string;
    officeAddressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    willingToServeOutside: 'yes' | 'no' | '';
}

interface ProfessionalProps {
    onNext: () => void;
    onBack: () => void;
}

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


export default function ProfessionalStructureAndCapacity({ onNext, onBack }: ProfessionalProps) {
    const [stateOpen, setStateOpen] = React.useState(false);
    const [stateSearch, setStateSearch] = React.useState("");
    const dispatch = useAppDispatch();
    const { professionalStructure, loading, error } = useAppSelector((state) => state.lawyerOnboardingReducer);
    const { control, handleSubmit, formState: { errors } } = useForm<ProfessionalFormValues>({
        defaultValues: professionalStructure,
        values: professionalStructure
    });

    const onSubmit = async (data: ProfessionalFormValues) => {
        const resultAction = await dispatch(submitProfessionalDetails(data));
        if (submitProfessionalDetails.fulfilled.match(resultAction)) {
            onNext();
        }
    };

    return (
        <Card className='p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl'>
            <form onSubmit={handleSubmit(onSubmit, () => scrollToFirstError())}>
                {/* Header Section */}
                <div className="mb-10">
                    <h2 className="text-[16x] font-semibold text-[#BFBFBF]">Step 2/4</h2>
                    <h1 className="font-inter font-bold text-[24px] text-[#0A2342] mt-2">
                        Professional Structure & Capacity
                    </h1>
                    <p className="font-inter font-semibold text-[#595959] text-[16px] mt-[2px]">
                        This will be used for official communication and client coordination.
                    </p>
                </div>

                {/* Professional Details Section */}
                <div className="mb-10 space-y-5">
                    <h3 className="font-semibold text-[#595959] text-[20px]">Professional Details</h3>

                    {/* Services Willing to Provide  */}
                    <div className="space-y-3  mb-10">
                        <Label className="font-inter font-semibold text-[16px] text-[#737373]">Services You Are Willing to Provide</Label>
                        <Controller
                            name="servicesWillingToProvide"
                            control={control}
                            rules={{ required: 'Please select the services you provide' }}
                            render={({ field, fieldState }) => ( // ✅ Destructure fieldState here
                                <div aria-invalid={!!fieldState.error} className="flex flex-col gap-2"> {/* Wrapper for spacing */}
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value} // ✅ Use value instead of defaultValue for strict validation
                                        className="flex flex-col md:flex-row md:gap-12 gap-4 mt-2"
                                    >
                                        <label className="flex items-center gap-2 font-normal text-[16px] text-[#767676] cursor-pointer">
                                            <RadioGroupItem value="Consultation" className={cn("border-[#E5E5E5] ",
                                                "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                            Only Consultation
                                        </label>
                                        <label className="flex items-center gap-2 font-normal text-[16px] text-[#767676] cursor-pointer">
                                            <RadioGroupItem value="FullLegalService" className={cn("border-[#E5E5E5] ",
                                                "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                            Full Legal Service Delivery & Representation
                                        </label>
                                    </RadioGroup>

                                    {/* ✅ Consistent Error Handling Pattern */}
                                    {/* <div className="min-h-[20px]">  */}
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                    {/* </div> */}
                                </div>
                            )}
                        />
                    </div>

                    {/* Practice Type */}
                    {/* Practice Type */}
                    <div className="space-y-3">
                        <Label className="font-inter font-semibold text-[16px] text-[#737373]">Practice Type</Label>
                        <Controller
                            name="practiceType"
                            control={control}
                            rules={{ required: 'Please select your practice type' }}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2" aria-invalid={!!fieldState.error}>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value} // ✅ Controlled value for validation
                                        className="flex gap-12 mt-2"
                                    >
                                        <label className="flex items-center gap-2 font-normal text-[16px] text-[#767676] cursor-pointer">
                                            <RadioGroupItem value="Individual" className={cn("border-[#E5E5E5] ",
                                                "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                            Individual
                                        </label>
                                        <label className="flex items-center gap-2 font-normal text-[16px] text-[#767676] cursor-pointer">
                                            <RadioGroupItem value="LawFirm" className={cn("border-[#E5E5E5] ",
                                                "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                            Part of a Law Firm
                                        </label>
                                    </RadioGroup>

                                    {/* ✅ Inline Error Handling */}
                                    {/* <div className="min-h-[20px]"> */}
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                    {/* </div> */}
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Location Section */}
                <div className="mb-10 space-y-5">
                    <h3 className="font-semibold text-[20px] text-[#595959]">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            name="officeAddressLine1"
                            control={control}
                            rules={{ required: 'Office address is required' }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel label="Office Address Line 1"
                                    labelClassName='font-inter font-semibold text-[16px] text-[#737373]'
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    placeholder="Primary Office Address" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="officeAddressLine2"
                            control={control}
                            render={({ field }) => (
                                <InputWithLabel label="Office Address Line 2"
                                    labelClassName='font-inter font-semibold text-[16px] text-[#737373]'
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    placeholder="(Optional)" value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: 'City is required' }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName='font-inter font-semibold text-[16px] text-[#737373]'
                                    className=" placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    label="City" placeholder="City" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
                            )}
                        />
                        <div className="flex flex-col">
                            <Label className="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]">State</Label>
                            <Controller
                                name="state"
                                control={control}
                                rules={{ required: 'State is required' }}
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
                            {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                            {/* </div> */}
                        </div>


                        <Controller
                            name="pinCode"
                            control={control}
                            rules={{ required: 'PIN Code is required', pattern: { value: /^\d{6}$/, message: 'Enter valid 6-digit PIN' } }}
                            render={({ field, fieldState }) => (
                                <InputWithLabel labelClassName='font-inter font-semibold text-[16px] text-[#737373]'
                                    maxLength={6}
                                    inputMode="numeric"
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                    className="placeholder:font-inter placeholder:font-normal placeholder:text-[16.49px] placeholder:leading-[24.74px] placeholder:text-[#9E9E9E]"
                                    label="PIN Code" placeholder="PIN Code" value={field.value} error={fieldState.error?.message} />
                            )}
                        />
                        <div className="flex flex-col">
                            <Label className="font-inter font-semibold text-[16px] leading-[24px] text-[#737373]">
                                Country
                            </Label>
                            <Controller
                                name="country"
                                control={control}
                                rules={{ required: 'Country is required' }}
                                render={({ field, fieldState }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger
                                            aria-invalid={!!fieldState.error}
                                            className={cn(
                                                // Core box styling: Exact height and padding sync
                                                "w-full rounded-[4px] h-[42px] px-3 font-inter border-[#4FC3F7]",

                                                // ✅ THE FONT FIX: Matches your State and InputWithLabel exactly
                                                "text-[16.49px] leading-[24.74px]",

                                                // Color Logic: Use font-normal to prevent the "big" bold look
                                                !field.value ? "text-[#9E9E9E] font-normal" : "text-[#404040] font-normal",

                                                // Error State
                                                fieldState.error ? "border-red-500" : "border-[#4FC3F7]",

                                                // Icon consistency
                                                "[&>svg]:stroke-[#4FC3F7] [&>svg]:opacity-100 [&>svg]:size-4"
                                            )}
                                        >
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="India" className="font-inter text-[16.49px]">
                                                India
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {/* <div className="min-h-[20px]"> */}
                            {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                            {/* </div> */}
                        </div>
                    </div>
                </div>

                {/* Optional Section */}
                <div className="mb-10 space-y-5">
                    <h3 className="font-semibold text-[20px] text-[#595959] text-base">Optional</h3>
                    <div className="space-y-2">
                        <Label className="font-inter font-semibold text-[16px] text-[#737373]">
                            Willing to serve clients outside primary city
                        </Label>
                        <Controller
                            name="willingToServeOutside"
                            control={control}
                            rules={{ required: 'Please select an option' }}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2" aria-invalid={!!fieldState.error}>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value} // ✅ Use value for controlled validation
                                        className="flex gap-12 mt-2"
                                    >
                                        <label className="flex items-center gap-2 font-normal text-[16px] text-[#767676] cursor-pointer">
                                            <RadioGroupItem value="yes" className={cn("border-[#E5E5E5]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-2 font-normal text-[16px] text-[#767676] cursor-pointer">
                                            <RadioGroupItem value="no" className={cn("border-[#E5E5E5]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]",
                                                "[&_[data-slot=radio-group-indicator]_svg]:stroke-none",
                                                "[&_[data-slot=radio-group-indicator]_svg]:scale-100")} />
                                            No
                                        </label>
                                    </RadioGroup>

                                    {/* ✅ Inline Error message logic */}
                                    {/* <div className="min-h-[20px]"> */}
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                    {/* </div> */}
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex justify-between items-center mt-12">
                    <LawyerRegistrationBackButton onClick={onBack} />
                    <LawyerRegistrationNextButton type="submit" loading={loading}>
                        {loading ? "Saving..." : "Next"}
                    </LawyerRegistrationNextButton>
                </div>

                {/* Progress Bar (Step 2 of 4) */}
                <div className="mt-8 flex gap-1 w-full">
                    <div className="h-[2px] w-1/2 bg-[#1565C0]" />
                    <div className="h-[2px] w-1/2 bg-[#B7E3F8]" />
                </div>
            </form>
        </Card>
    );
}
