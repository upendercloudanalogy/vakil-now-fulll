
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAnnouncements, markAllAnnouncementsRead } from "./announcementThunk";

export interface AnnouncementItem {
    id: string;
    type: "offer" | "activity";
    status: "active" | "expired";
    title: string;
    description: string;
    createdAt: string;
    startDate?: string;
    endDate?: string;
    isRead: boolean;
}

interface AnnouncementState {
    items: AnnouncementItem[];
    loading: boolean;
    error: string | null;
}

const initialState: AnnouncementState = {
    items: [],
    loading: false,
    error: null,
};

const announcementSlice = createSlice({
    name: "announcement",
    initialState,
    reducers: {
        markLocalAsRead(state, action: PayloadAction<string[]>) {
            const ids = new Set(action.payload);
            state.items = state.items.map((item) =>
                ids.has(item.id) ? { ...item, isRead: true } : item
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAnnouncements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch announcements";
            })

            .addCase(markAllAnnouncementsRead.fulfilled, (state) => {
                // Explicitly DO NOT update state.items here to keep "unread" UI until next fetch
                state.loading = false;
            });
    },
});

export const { markLocalAsRead } = announcementSlice.actions;
export default announcementSlice.reducer;
