import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MySqlDatabase } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { schema } from 'src/db/schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UploadService } from 'src/global/upload/upload.service';
import { and, eq, or, inArray, sql, desc } from 'drizzle-orm';
import { S3Service } from 'src/global/aws-s3/aws-s3.service';
import { Public } from '../auth/decorators/public.decorator';

@Injectable()
export class SupportComplaintsService {
    constructor (
        @Inject(DrizzleAsyncProvider) private db: MySqlDatabase<any, any>,
        private readonly uploadService: UploadService,
    ) { }

    private formatDate (date: Date | null): string | null {
        if (!date) return null;


        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',   // 👈 December
            year: 'numeric',
        }).format(date);
    }


    async createTicket (body: CreateTicketDto, file: Express.Multer.File) {

        try {
            return await this.db.transaction(async (tx) => {
                const title = body?.title?.trim();
                const query = body?.query?.trim();
                if (!title || !query) {
                    throw new BadRequestException('Title and query are required');
                }

                const [ticket] = await tx.insert(schema.supportAndComplaints)
                    .values({
                        title,
                        query
                    })
                    .$returningId();

                if (!ticket?.id) {
                    throw new InternalServerErrorException('Failed to create ticket');
                }

                let fileKey: string | null = null;
                try {


                    if (file) {
                        fileKey = await this.uploadService.upload(
                            file,
                            'support-tickets',
                            String(ticket.id)
                        );
                    }
                } catch (error) {
                    throw new InternalServerErrorException('File upload failed');
                }

                await tx.update(schema.supportAndComplaints)
                    .set({ attachmentKey: fileKey })
                    .where(eq(schema.supportAndComplaints.id, ticket.id));
            

                const signedUrl = fileKey
                ? await this.uploadService.getPreviewUrl(fileKey)
                : null;
            return {
                message: 'Ticket Created Successfully',
                success: true,
                ticketId: ticket.id,
                attachment: signedUrl,
            }
        });
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error;
        }

        throw new InternalServerErrorException('Something went wrong');
    }
}


    async getOpenTicket(page = 1, limit = 10) {
    try {
        const offset = (page - 1) * limit;

        const tickets = await this.db
            .select({
                id: schema.supportAndComplaints.id,
                title: schema.supportAndComplaints.title,
                query: schema.supportAndComplaints.query,
                status: schema.supportAndComplaints.status,
                createdAt: schema.supportAndComplaints.createdAt,
            })
            .from(schema.supportAndComplaints)
            .where(
                or(
                    eq(schema.supportAndComplaints.status, 'PENDING'),
                    eq(schema.supportAndComplaints.status, 'IN PROGRESS'),
                )
            )
            .orderBy(desc(schema.supportAndComplaints.createdAt))
            .limit(limit)
            .offset(offset);

        const [{ count }] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(schema.supportAndComplaints)
            .where(
                or(
                    eq(schema.supportAndComplaints.status, 'PENDING'),
                    eq(schema.supportAndComplaints.status, 'IN PROGRESS'),
                )
            );

        const formattedTickets = tickets.map(ticket => ({
            ...ticket,
            createdAt: this.formatDate(ticket.createdAt),
        }));

        return {
            success: true,
            pagination: {
                page,
                limit,
                totalRecords: Number(count),
                totalPages: Math.ceil(Number(count) / limit),
            },
            data: formattedTickets,
        };
    } catch (error) {
        throw new InternalServerErrorException('Failed to fetch open tickets');
    }
}


    async getClosedTicket(page = 1, limit = 10) {
    try {
        const offset = (page - 1) * limit;

        const tickets = await this.db
            .select({
                id: schema.supportAndComplaints.id,
                title: schema.supportAndComplaints.title,
                query: schema.supportAndComplaints.query,
                status: schema.supportAndComplaints.status,
                createdAt: schema.supportAndComplaints.createdAt,
            })
            .from(schema.supportAndComplaints)
            .where(eq(schema.supportAndComplaints.status, 'CLOSED'))
            .orderBy(desc(schema.supportAndComplaints.createdAt))
            .limit(limit)
            .offset(offset);

        const [{ count }] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(schema.supportAndComplaints)
            .where(eq(schema.supportAndComplaints.status, 'CLOSED'));

        const formattedTickets = tickets.map(ticket => ({
            ...ticket,
            createdAt: this.formatDate(ticket.createdAt),
        }));

        return {
            success: true,
            pagination: {
                page,
                limit,
                totalRecords: Number(count),
                totalPages: Math.ceil(Number(count) / limit),
            },
            data: formattedTickets,
        };
    } catch (error) {
        throw new InternalServerErrorException('Failed to fetch closed tickets');
    }
}




}


