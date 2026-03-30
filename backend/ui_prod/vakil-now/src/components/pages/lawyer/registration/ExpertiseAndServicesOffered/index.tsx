'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import LawyerRegistrationBackButton from '../Buttons/LawyerRegistrationBackButton';
import LawyerRegistrationNextButton from '../Buttons/LawyerRegistrationNextButton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hook';
import { submitExpertiseDetails } from '../../../../../../redux/slices/lawyer/lawyerOnboardingThunk';
import { LAW_SERVICES } from './constants/index'
/* ===================== TYPES ===================== */

interface ExpertiseFormValues {
    servicesByField: Record<string, string[]>;
}



const scrollToFirstError = () => {
    requestAnimationFrame(() => {
        const el = document.querySelector('[aria-invalid="true"], .border-red-500');
        if (el instanceof HTMLElement) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus?.();
        }
    });
};

interface ExpertiseProps {
    onNext: () => void;
    onBack: () => void;
}

export default function ExpertiseAndServicesOffered({ onNext, onBack }: ExpertiseProps) {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useAppDispatch();

    const { expertise, loading, error } = useAppSelector((state) => state.lawyerOnboardingReducer);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ExpertiseFormValues>({
        defaultValues: expertise,
        values: expertise
    });

    const servicesByField = watch("servicesByField");

    const handleSelectField = (field: string, currentVal: Record<string, string[]>) => {
        if (!currentVal[field]) {
            setValue("servicesByField", { ...currentVal, [field]: [] }, { shouldValidate: true });
            setActiveTab(field);
        }
    };

    const handleRemoveField = (field: string, e: React.MouseEvent, currentVal: Record<string, string[]>) => {
        e.stopPropagation();
        const updated = { ...currentVal };
        delete updated[field];
        setValue("servicesByField", updated, { shouldValidate: true });
        if (activeTab === field) {
            const keys = Object.keys(updated);
            setActiveTab(keys.length > 0 ? keys[0] : null);
        }
    };

    const filteredServices = useMemo(() => {
        if (!activeTab || !LAW_SERVICES[activeTab]) return [];
        const rawStages = LAW_SERVICES[activeTab];
        if (!searchQuery.trim()) return rawStages;

        return rawStages
            .map((stage) => ({
                ...stage,
                services: stage.services.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
            }))
            .filter(stage => stage.services.length > 0);
    }, [activeTab, searchQuery]);

    const onSubmit = async (data: ExpertiseFormValues) => {
        const resultAction = await dispatch(submitExpertiseDetails(data));
        if (submitExpertiseDetails.fulfilled.match(resultAction)) {
            onNext();
        }
    };


    return (
        <Card className='p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl h-full flex flex-col'>
            <form onSubmit={handleSubmit(onSubmit, () => scrollToFirstError())} className="flex flex-col flex-1">
                <div className="mb-10">
                    <h2 className="text-[16px] font-semibold text-[#BFBFBF]">Step 3/4</h2>
                    <h1 className="font-inter font-bold text-[24px] text-[#0A2342] mt-2">Expertise & Services Offered</h1>
                    <p className="text-[#595959] font-inter font-semibold text-[16px] mt-[2px]">This will be used for official communication and client coordination.</p>
                </div>

                <h2 className="font-inter font-semibold text-[#595959] text-[20px] mb-5">Area(s) of Expertise / Field of Law</h2>

                <div className="mb-10">
                    <label htmlFor="servicesByField" className=" block text-[16px] font-inter font-semibold text-[#737373] mb-2">Select Services</label>
                    <Controller
                        name="servicesByField"
                        control={control}
                        rules={{
                            validate: (val) => {
                                const keys = Object.keys(val);
                                if (keys.length === 0) return "Please select at least one Area of Expertise";
                                const incomplete = keys.find(k => val[k].length === 0);
                                if (incomplete) return `Please select services for ${incomplete}`;
                                return true;
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <div className={cn("rounded-md")} aria-invalid={!!fieldState.error}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className={cn(
                                            "flex items-center justify-between border rounded-md p-3 bg-white cursor-pointer",
                                            fieldState.error && Object.keys(field.value).length === 0 ? "border-red-500" : "border-[#4FC3F7]"
                                        )}>
                                            <span className="text-[#BFBFBF] text-sm">Multi-select</span>
                                            <ChevronDown className="text-[#4FC3F7]" size={20} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[calc(100vw-40px)]  md:w-[600px] bg-white z-[500]">
                                        {Object.keys(LAW_SERVICES).map((law) => (
                                            <DropdownMenuItem
                                                key={law}
                                                className="cursor-pointer hover:bg-[#EDF9FE] flex justify-between items-center"
                                                onClick={() => handleSelectField(law, field.value)}
                                            >
                                                {law}
                                                {field.value[law] && <Check size={16} className="text-[#1565C0]" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {fieldState.error && Object.keys(field.value).length === 0 && (
                                    <p className="text-sm text-red-500 mt-2">{fieldState.error.message}</p>
                                )}

                                <div className="flex flex-wrap gap-3 mt-5">
                                    {Object.keys(field.value).map(fName => (
                                        <div
                                            key={fName}
                                            onClick={() => setActiveTab(fName)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded border cursor-pointer text-sm font-medium transition-all",
                                                "bg-[#EDF9FE] border-[#4FC3F7] text-[#1565C0]",
                                                field.value[fName].length === 0 && errors.servicesByField ? "border-red-500" : ""
                                            )}
                                        >
                                            {fName}
                                            <X size={14} className="hover:text-red-500" onClick={(e) => handleRemoveField(fName, e, field.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    />
                </div>


                {activeTab && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-[#595959] text-[20px]">Services Within {activeTab} Area</h3>
                            {/* Service-specific error exactly below heading */}
                            {errors.servicesByField && servicesByField[activeTab]?.length === 0 && (
                                <p className="text-sm text-red-500 font-medium">Please select at least one service for {activeTab}</p>
                            )}
                        </div>

                        <div className="relative mb-[12px]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search Services Within ${activeTab}...`}
                                className="w-full border border-[#4FC3F7] rounded-md p-3 pr-10 text-sm focus:outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-[#9E9E9E]"
                            />
                            <Search className="absolute right-3 top-3 text-[#4FC3F7]" size={20} />
                        </div>

                        <div className="space-y-5">
                            {filteredServices.map((stage) => {
                                // Logic for Stage Checkbox (Select All in Stage)
                                const currentSelected = servicesByField[activeTab] || [];
                                const isAllInStageSelected = stage.services.every(s => currentSelected.includes(s));

                                return (
                                    <div key={stage.id} className="border border-[#E0E0E0] rounded-lg overflow-hidden bg-white shadow-sm">
                                        <div className="bg-[#EDF9FE] p-3 flex items-center gap-3 border-b border-[#E0E0E0]">
                                            <Checkbox
                                                id={`stage-${stage.id}`}
                                                // className='size-[12px]'
                                                checked={isAllInStageSelected}
                                                onCheckedChange={(checked) => {
                                                    let updated = [...currentSelected];
                                                    if (checked) {
                                                        // Add missing services from this stage
                                                        const toAdd = stage.services.filter(s => !updated.includes(s));
                                                        updated = [...updated, ...toAdd];
                                                    } else {
                                                        // Remove services of this stage
                                                        updated = updated.filter(s => !stage.services.includes(s));
                                                    }
                                                    setValue("servicesByField", { ...servicesByField, [activeTab]: updated }, { shouldValidate: true });
                                                }}
                                            />
                                            <Label htmlFor={`stage-${stage.id}`} className="font-bold text-sm text-[#0A0A0A] bg-[#edf9fe] cursor-pointer">
                                                {stage.stage}
                                            </Label>
                                        </div>
                                        <div className="p-4 grid grid-cols-1 gap-4">
                                            {stage.services.map((service, idx) => (
                                                <div key={`${stage.id}-${idx}`} className="flex items-start gap-3 group">
                                                    <Checkbox
                                                        id={`${stage.id}-${service}`}
                                                        checked={currentSelected.includes(service)}
                                                        onCheckedChange={(checked) => {
                                                            const updated = checked
                                                                ? [...currentSelected, service]
                                                                : currentSelected.filter(s => s !== service);
                                                            setValue("servicesByField", { ...servicesByField, [activeTab]: updated }, { shouldValidate: true });
                                                        }}
                                                    />
                                                    <Label htmlFor={`${stage.id}-${service}`} className="text-sm text-[#0A0A0A] font-normal cursor-pointer group-hover:text-[#0A0A0A]">
                                                        {service}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-auto pt-12">
                    <LawyerRegistrationBackButton onClick={onBack} className='bg-[#E8E8E8] hover:bg-[#E8E8E8]' />
                    <LawyerRegistrationNextButton type="submit" loading={loading} />
                </div>

                <div className="mt-8 flex gap-1 w-full">
                    <div className="h-[2px] w-1/2 bg-[#1565C0]" />
                    <div className="h-[2px] w-1/2 bg-[#B7E3F8]" />
                </div>
            </form>
        </Card>
    );
}


