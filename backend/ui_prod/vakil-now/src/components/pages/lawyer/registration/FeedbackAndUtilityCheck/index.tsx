'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import LawyerRegistrationBackButton from '../Buttons/LawyerRegistrationBackButton';
import LawyerRegistrationNextButton from '../Buttons/LawyerRegistrationNextButton';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FeedbackAndUtilityCheckImage } from "@/lib/icons";
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hook';
import { submitOnboardingFeedback } from '../../../../../../redux/slices/lawyer/lawyerOnboardingThunk';
import { useSocket } from '../../../../../../sockets/SocketContext';

interface FeedbackFormValues {
    q1: string[];
    q2: string;
    q3: string[];
    q4: string;
    q5: string;
    q6: string;
    q7: string[];
}

interface FeedbackAndUtilityCheckProps {
    onNext: () => void;
    onBack: () => void;
}

export default function FeedbackAndUtilityCheck({ onNext, onBack }: FeedbackAndUtilityCheckProps) {
    const dispatch = useAppDispatch();
    const { feedback, loading, error } = useAppSelector((state) => state.lawyerOnboardingReducer);
    const { control, handleSubmit, formState: { errors } } = useForm<FeedbackFormValues>({
        defaultValues: feedback,
        values: feedback
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        const resultAction = await dispatch(submitOnboardingFeedback(data));

        if (submitOnboardingFeedback.fulfilled.match(resultAction)) {
            // Success logic (e.g., showing success screen)
            onNext();
        }
    };

    return (
        <Card className='p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl'>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[28px]">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-[12px]">
                    <h1 className="font-inter font-bold text-[32px] text-[#1565C0]">Help Us Build VakilNow for You</h1>
                    <p className="text-[#595959] text-[20px] font-medium">
                        A quick, optional check to personalise tools and workflows for your practice
                    </p>
                    <p className='font-inter font-normal text-[16px] text-[#595959]'>Takes less than 2 minutes. Your responses help us design better systems for you.</p>
                    <div className='flex flex-row gap-10 mt-[36px] mb-[20px]'>
                        <div>
                            <FeedbackAndUtilityCheckImage width={320} height={200} />
                        </div>
                        <div className='flex flex-col items-center h-[110px] mt-10'>
                            <div className='flex-1 w-0 border-l-[2px] border-dashed border-[#4FC3F7]' />
                            <div className='w-3 h-3 border-b-2 border-r-2 border-[#4FC3F7] rotate-45 -mt-[7px]' />
                        </div>
                    </div>
                </div>

                {/* Question 1: Multi-select with "Up to 2" Validation */}
                <QuestionWrapper
                    title="1. Which parts of your daily legal work consume the most time?"
                    subtitle="(Select up to 2)"
                    error={errors.q1?.message}
                >
                    <Controller
                        name="q1"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) return "Please select at least one option";
                                if (value.length > 2) return "You can only select up to 2 options";
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <div className="space-y-4">
                                {["Client communication & follow-ups", "Document drafting & version management", "Organising case files & records", "Billing, payments & fee tracking", "Coordination with juniors / staff", "Finding or onboarding new clients"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <Checkbox
                                            className='border border-[#E5E5E5] shadow-sm'
                                            id={`q1-${opt}`}
                                            checked={field.value?.includes(opt)}
                                            onCheckedChange={(checked) => {
                                                const currentValues = field.value || [];
                                                if (checked && currentValues.length >= 2) return;
                                                const newValue = checked
                                                    ? [...currentValues, opt]
                                                    : currentValues.filter((v: string) => v !== opt);
                                                field.onChange(newValue);

                                            }}
                                        />
                                        <Label htmlFor={`q1-${opt}`} className={`text-[#0A0A0A] cursor-pointer font-normal text-sm ${!field.value?.includes(opt) && field.value?.length >= 2 ? 'opacity-50' : ''}`}>
                                            {opt}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </QuestionWrapper>

                {/* Question 2: Single-select Required */}
                <QuestionWrapper title="2. How would you describe your current use of technology in practice management?" error={errors.q2?.message}>
                    <Controller
                        name="q2"
                        control={control}
                        rules={{ required: "This selection is required" }}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-4">
                                {["Very comfortable – I actively use digital tools", "Moderately comfortable – I use basic tools", "Limited – mostly manual with minimal tech", "Prefer minimal technology"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <RadioGroupItem value={opt} id={`q2-${opt}`} className="border border-[#E5E5E5] shadow-sm" />
                                        <Label htmlFor={`q2-${opt}`} className="text-[#0A0A0A] cursor-pointer font-normal text-sm">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )} />
                </QuestionWrapper>

                {/* Question 3: Multi-select Required */}
                <QuestionWrapper title="3. Which tools would genuinely help you deliver legal services more efficiently if managed through VakilNow?" subtitle="(Select all that apply)" error={errors.q3?.message}>
                    <Controller
                        name="q3"
                        control={control}
                        rules={{ validate: (val) => val.length > 0 || "Please select at least one tool" }}
                        render={({ field }) => (
                            <div className="space-y-4">
                                {["Cloud-based document storage & organised case files", "Secure client communication (chat / call / updates)", "Task & deadline tracking for cases", "Centralised client and matter management", "Billing, invoicing & payment collection handled by platform", "Internal coordination tools for staff/juniors"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <Checkbox
                                            className='border border-[#E5E5E5] shadow-sm'
                                            id={`q3-${opt}`}
                                            checked={field.value?.includes(opt)}
                                            onCheckedChange={(checked) => {
                                                const newValue = checked ? [...field.value, opt] : field.value.filter((v: string) => v !== opt);
                                                field.onChange(newValue);
                                            }}
                                        />
                                        <Label htmlFor={`q3-${opt}`} className="text-[#0A0A0A] cursor-pointer font-normal text-sm">{opt}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </QuestionWrapper>

                {/* Question 4: Single-select Required */}
                <QuestionWrapper title="4. How would you prefer work to be assigned to you on VakilNow?" error={errors.q4?.message}>
                    <Controller
                        name="q4"
                        control={control}
                        rules={{ required: "Selection is required" }}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-4">
                                {["Based on my expertise and practice area", "Based on workload availability", "Balanced mix of expertise and availability", "Prefer fewer but higher-value matters"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <RadioGroupItem value={opt} id={`q4-${opt}`} className="border border-[#E5E5E5] shadow-sm" />
                                        <Label htmlFor={`q4-${opt}`} className="text-[#0A0A0A] cursor-pointer font-normal text-sm">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )} />
                </QuestionWrapper>

                {/* Question 5: Single-select Required */}
                <QuestionWrapper title="5. Which role are you most interested in on the VakilNow platform?" error={errors.q5?.message}>
                    <Controller
                        name="q5"
                        control={control}
                        rules={{ required: "Selection is required" }}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-4">
                                {["Providing paid consultations only", "Handling service-based legal work (drafting, filings, compliances, etc.)", "Both consultations and service work"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <RadioGroupItem value={opt} id={`q5-${opt}`} className="border border-[#E5E5E5] shadow-sm" />
                                        <Label htmlFor={`q5-${opt}`} className="text-[#0A0A0A] cursor-pointer font-normal text-sm">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )} />
                </QuestionWrapper>

                {/* Question 6: Single-select Required */}
                <QuestionWrapper title="6. How important is it for you that VakilNow manages most client communication on your behalf?" error={errors.q6?.message}>
                    <Controller
                        name="q6"
                        control={control}
                        rules={{ required: "Selection is required" }}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-4">
                                {["Very important – I prefer structured, platform-led communication", "Moderately important – I'm open to mixed communication", "Not important – I prefer direct communication"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <RadioGroupItem value={opt} id={`q6-${opt}`} className="border border-[#E5E5E5] shadow-sm" />
                                        <Label htmlFor={`q6-${opt}`} className="text-[#0A0A0A] cursor-pointer font-normal text-sm">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )} />
                </QuestionWrapper>

                {/* Question 7: Multi-select with "Up to 2" Validation */}
                <QuestionWrapper
                    title="7. What matters most to you in a long-term association with VakilNow?"
                    subtitle="(Select up to 2)"
                    error={errors.q7?.message}
                >
                    <Controller
                        name="q7"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) return "Please select at least one option";
                                if (value.length > 2) return "You can only select up to 2 options";
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <div className="space-y-4">
                                {["Consistent and quality client flow", "Reduced administrative burden", "Access to strong practice-management technology", "Professional credibility and brand association"].map(opt => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <Checkbox
                                            className='border border-[#E5E5E5] shadow-sm'
                                            id={`q7-${opt}`}
                                            checked={field.value?.includes(opt)}
                                            onCheckedChange={(checked) => {
                                                const currentValues = field.value || [];
                                                if (checked && currentValues.length >= 2) return;

                                                const newValue = checked
                                                    ? [...currentValues, opt]
                                                    : currentValues.filter((v: string) => v !== opt);
                                                field.onChange(newValue);
                                            }}
                                        />
                                        <Label htmlFor={`q7-${opt}`} className={`text-[#0A0A0A] cursor-pointer font-normal text-sm ${!field.value?.includes(opt) && field.value?.length >= 2 ? 'opacity-50' : ''}`}>
                                            {opt}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </QuestionWrapper>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-8">
                    <LawyerRegistrationBackButton onClick={onBack} variant="outline" className='bg-transparent hover:bg-transparent border border-[#B8B8B8]' />
                    <LawyerRegistrationNextButton type="submit">
                        Submit
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

function QuestionWrapper({ title, subtitle, children, error }: { title: string; subtitle?: string; children: React.ReactNode; error?: string }) {
    return (
        <div className={`p-8 border rounded-xl space-y-6 transition-all ${error ? 'border-red-500 bg-[#f5fcff]' : 'border-[#4FC3F7] bg-[#f5fcff]'}`}>
            <div className="space-y-1">
                <h3 className="font-bold text-[20px] text-[#595959]">{title}</h3>
                {subtitle && <p className="text-[16px] font-normal text-[#595959]">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4">{children}</div>
            {error && <p className="text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
    );
}