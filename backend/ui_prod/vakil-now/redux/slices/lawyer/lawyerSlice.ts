import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fulllawyerOnboaringData, submitExpertiseDetails, submitIdentityVerification, submitOnboardingFeedback, submitProfessionalDetails } from './lawyerOnboardingThunk';

// Define types based on your Step 1 & 2 Source Code
export interface LawyerOnboardingState {
    // Step 1: Identity & Verification
    identity: {
        fullName: string;
        mobileNumber: string;
        emailAddress: string;
        gender: string;
        barRegistrationNumber: string;
        barCouncilState: string;
        collegeName: string;
        highestQualification: 'LLB' | 'LLM' | 'Other' | '';
        // Store only file names/metadata in Redux, real files stay in Form State or specialized store
        profilePhoto: File | string | null;
        governmentId: File | string | null;
        barCouncilId: File | string | null;
    };

    // Step 2: Professional Structure
    professionalStructure: {
        servicesWillingToProvide: 'Consultation' | 'FullLegalService' | '';
        practiceType: 'Individual' | 'LawFirm' | '';
        officeAddressLine1: string;
        officeAddressLine2: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
        willingToServeOutside: 'yes' | 'no' | '';
    };

    // Step 3: Expertise
    expertise: {
        servicesByField: Record<string, string[]>;
    };

    // Step 4: Feedback
    feedback: {
        q1: string[];
        q2: string;
        q3: string[];
        q4: string;
        q5: string;
        q6: string;
        q7: string[];
    };
    successfullyRegistered:boolean,
    currentStep: number;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
    completedWelcomePages:boolean
}

const initialState: LawyerOnboardingState = {
    identity: {
        fullName: '',
        mobileNumber: '',
        emailAddress: '',
        gender: '',
        barRegistrationNumber: '',
        barCouncilState: '',
        collegeName: '',
        highestQualification: '',
        profilePhoto: null,
        governmentId: null,
        barCouncilId: null,
    },
    professionalStructure: {
        servicesWillingToProvide: '',
        practiceType: '',
        officeAddressLine1: '',
        officeAddressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        country: 'India',
        willingToServeOutside: '',
    },
    expertise: {
        servicesByField: {},
    },
    feedback: {
        q1: [], q2: '', q3: [], q4: '', q5: '', q6: '', q7: []
    },
    completedWelcomePages:false,
    currentStep: 0,
    successfullyRegistered:false,
    loading: false,
    error: null,
    isInitialized: false,
};

export const lawyerOnboardingSlice = createSlice({
    name: 'lawyerOnboarding',
    initialState,
    reducers: {
        // Update Step 1
        setIdentity: (state, action: PayloadAction<Partial<LawyerOnboardingState['identity']>>) => {
            state.identity = { ...state.identity, ...action.payload };
        },

        // Update Step 2
        setProfessionalStructure: (state, action: PayloadAction<Partial<LawyerOnboardingState['professionalStructure']>>) => {
            state.professionalStructure = { ...state.professionalStructure, ...action.payload };
        },

        // Update Step 3
        setExpertise: (state, action: PayloadAction<Record<string, string[]>>) => {
            state.expertise.servicesByField = action.payload;
        },

        // Update Step 4
        setFeedback: (state, action: PayloadAction<Partial<LawyerOnboardingState['feedback']>>) => {
            state.feedback = { ...state.feedback, ...action.payload };
        },

        // Navigation
        nextStep: (state) => {
            if (state.currentStep < 4) state.currentStep += 1;
        },
        prevStep: (state) => {
            if (state.currentStep > 1) state.currentStep -= 1;
        },
        setWelcomePagesCompleted: (state) => {
            state.completedWelcomePages = true;
            // Agar currentStep pehle se 0 hai (yaani user bilkul naya hai), 
            // tabhi use 1 par bhejo. Warna purana step rehne do.
            if (state.currentStep === 0) {
                state.currentStep = 1;
            }
        },

        // Reset after success
        resetOnboarding: () => initialState,
    },
    extraReducers: (builder) => {
        // Handle async thunks here (e.g., submitIdentityVerification)
        builder
            .addCase(submitIdentityVerification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitIdentityVerification.fulfilled, (state, action) => {
                state.loading = false;
                // Backend se jo verified data aaya, use state mein bhar do
                state.identity = { ...state.identity, ...action.payload?.identity };
                // Step automatically aage badha do
                state.currentStep = 2;
            })
            .addCase(submitIdentityVerification.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message || 'Something went wrong';
            })

            .addCase(submitProfessionalDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitProfessionalDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.professionalStructure = { ...state.professionalStructure, ...action.payload.professionalStructure };
                state.currentStep = 3;
            })
            .addCase(submitProfessionalDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message || 'Failed to save professional info';
            })
            .addCase(submitExpertiseDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitExpertiseDetails.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload should return the servicesByField object from backend
                state.expertise.servicesByField = action.payload.servicesByField || action.payload;
                state.currentStep = 4;
            })
            .addCase(submitExpertiseDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message || 'Failed to save expertise';
            })
            .addCase(submitOnboardingFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitOnboardingFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedback = action.payload.feedback || action.payload;
                state.successfullyRegistered = true;
            })
            .addCase(submitOnboardingFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message || 'Something went wrong';
            })
            .addCase(fulllawyerOnboaringData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fulllawyerOnboaringData.fulfilled, (state, action) => {
                state.loading = false;
                state.isInitialized=true;
                const onboardingData = action.payload?.data;
                if (onboardingData) {
                    // 1. Map Identity (Step 1)
                    if (onboardingData.identity) {
                        state.identity = { ...initialState?.identity, ...onboardingData.identity };
                    }
                    if (onboardingData.professionalStructure) {
                        state.professionalStructure = {
                            ...initialState?.professionalStructure,
                            ...onboardingData.professionalStructure
                        };
                        
                    }
                
                    if (onboardingData.expertise?.servicesByField) {
                        state.expertise.servicesByField = onboardingData.expertise.servicesByField;
                        
                    }

                    // 4. Map Feedback (Step 4)
                    if (onboardingData.feedback) {
                        state.feedback = { ...initialState?.feedback, ...onboardingData.feedback };
                    }
                    
                    if (onboardingData.currentStep) {
                        state.currentStep = onboardingData.currentStep;
                    }

                    // 3. Sync the final registration status
                    if (onboardingData.isSuccessfullyRegistered) {
                        state.successfullyRegistered = true;
                    }
                }
            
            })
            .addCase(fulllawyerOnboaringData.rejected, (state, action) => {
                state.loading = false;
                state.isInitialized = true;
                state.error = (action.payload as any)?.message || 'Something went wrong';
            })
        }

});

export const {
    setIdentity,
    setProfessionalStructure,
    setExpertise,
    setFeedback,
    nextStep,
    prevStep,
    resetOnboarding,
    setWelcomePagesCompleted
} = lawyerOnboardingSlice.actions;

export default lawyerOnboardingSlice.reducer;