import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../axios/api';
import { API_PATHS } from '../../apiPaths';

export const submitIdentityVerification = createAsyncThunk(
    'lawyerOnboarding/submitIdentityVerification',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post(API_PATHS.LAWYER_ONBOARDING.IDENTITY, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'Network error' });
            }
        }
    }
);


export const submitProfessionalDetails = createAsyncThunk(
    'lawyerOnboarding/submitProfessionalDetails',
    async (data: any, { rejectWithValue }) => {
        try {
            // Note: No 'multipart/form-data' needed here as there are no files
            const response = await api.post(API_PATHS.LAWYER_ONBOARDING.PROFESSIONAL, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: 'Failed to save professional details' });
        }
    }
);


export const submitExpertiseDetails = createAsyncThunk(
    'lawyerOnboarding/submitExpertiseDetails',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post(API_PATHS.LAWYER_ONBOARDING.EXPERTISE, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: 'Failed to save expertise details' });
        }
    }
);


export const submitOnboardingFeedback = createAsyncThunk(
    'lawyerOnboarding/submitFeedback',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post(API_PATHS.LAWYER_ONBOARDING.FEEDBACK, data);
            return response.data; // Expected: { feedback: { q1: [], q2: "", ... } }
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: 'Feedback submission failed' });
        }
    }
);




export const fulllawyerOnboaringData = createAsyncThunk(
    'lawyer/onboarding/data',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_PATHS.LAWYER_ONBOARDING.FULL_DATA);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: 'fetch of lawyer onboarding data failed' });
        }
    }
);
