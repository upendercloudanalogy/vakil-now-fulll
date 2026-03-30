
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../axios/api";
import { AnnouncementItem } from "./announcementSlice";
import { API_PATHS } from "../../apiPaths";

export const fetchAnnouncements = createAsyncThunk<AnnouncementItem[]>(
    "announcement/fetchAnnouncements",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_PATHS.ANNOUNCEMENTS.BASE);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch announcements");
        }
    }
);



export const markAllAnnouncementsRead = createAsyncThunk<{ success: boolean; count: number }, string | undefined>(
    "announcement/markAllRead",
    async (type, { rejectWithValue }) => {
        try {
            const query = type ? `?type=${type}` : "";
            const response = await api.patch(`${API_PATHS.ANNOUNCEMENTS.MARK_ALL_READ}${query}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark all as read");
        }
    }
);
