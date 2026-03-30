import { Inject, Injectable } from "@nestjs/common";


import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { schema } from "src/db/schema";
import { AnnouncementType } from "./dto/create-announcement.dto";

@Injectable(

)
export class AnnouncementsService {
    constructor(

        @Inject('DrizzleAsyncProvider') private db: any
    ) { }

    /**
     * Create announcement (admin)
     */
    async create(dto: any) {
        return this.db.insert(schema.announcements).values({
            id: randomUUID(),
            ...dto,
        });
    }

    /**
     * Fetch announcements for logged-in user
     */
    async findAll(
        userId: string,
        type?: "offer" | "activity"
    ) {
        return this.db
            .select({
                id: schema.announcements.id,
                type: schema.announcements.type,
                status: schema.announcements.status,
                // badgeText: schema.announcements.badgeText,
                title: schema.announcements.title,
                description: schema.announcements.description,
                createdAt: schema.announcements.createdAt,
                isRead: schema.announcementReads.isRead,
                startDate: schema.announcements.startDate,
                endDate: schema.announcements.endDate,
            })
            .from(schema.announcements)
            .leftJoin(
                schema.announcementReads,
                and(
                    eq(schema.announcementReads.announcementId, schema.announcements.id),
                    eq(schema.announcementReads.userId, userId),
                ),
            )
            .where(type ? eq(schema.announcements.type, type) : undefined)
            .groupBy(schema.announcements.id)
            .orderBy(schema.announcements.createdAt);
    }

    /**
     * Mark ALL announcements as read for a user
     */
    async markAllAsRead(userId: string, type?: AnnouncementType) {
        // 1. Get all announcement IDs for the implementation
        const allAnnouncements = await this.db
            .select({ id: schema.announcements.id })
            .from(schema.announcements)
            .where(type ? eq(schema.announcements.type, type) : undefined);

        if (allAnnouncements.length === 0) {
            return { success: true, count: 0 };
        }

        const announcementIds = allAnnouncements.map((a: { id: string }) => a.id);

        const existingReads = await this.db
            .select({
                announcementId: schema.announcementReads.announcementId,
            })
            .from(schema.announcementReads)
            .where(
                and(
                    eq(schema.announcementReads.userId, userId)

                )
            );

        const existingReadSet = new Set(existingReads.map((r: { announcementId: string }) => r.announcementId));

        // 3. Separate into NEW and EXISTING
        const toInsert: any[] = [];
        const toUpdateIds: string[] = [];

        for (const id of announcementIds) {
            if (existingReadSet.has(id)) {
                toUpdateIds.push(id);
            } else {
                toInsert.push({
                    userId,
                    announcementId: id,
                    isRead: true,
                    readAt: new Date(), // Use JS Date object, Drizzle handles serialization
                });
            }
        }

        // 4. Perform Operations
        if (toInsert.length > 0) {
            await this.db.insert(schema.announcementReads).values(toInsert);
        }

        if (toUpdateIds.length > 0) {

        }

        // Return count of processed
        return { success: true, count: announcementIds.length };
    }
}
