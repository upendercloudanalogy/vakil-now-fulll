import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySqlDatabase } from 'drizzle-orm/mysql2';
import { count, eq, sql , desc } from 'drizzle-orm';
import { schema } from 'src/db/schema';
import { SocketService } from 'src/global/sockets/socket.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySqlDatabase<any, any>,
    private readonly socketService: SocketService,
  ) { }

  async getDetailsOfDashboardCards() {
    try {
      // Lawyers Count
      const lawyersResult = await this.db
        .select({ totalLawyers: count() })
        .from(schema.users)
        .where(eq(schema.users.type, 'LAWYER'));

      const totalLawyers = lawyersResult[0].totalLawyers;

      // Users Count
      const usersResult = await this.db
        .select({ totalUsers: count() })
        .from(schema.users)
        .where(eq(schema.users.type, 'USER'));

      const totalUsers = usersResult[0].totalUsers;

      // TEMP: Services & packages (replace later)
      const totalServices = 0;
      const activePackages = 0;

      return {
        success: true,
        message: 'Dashboard card details fetched successfully',
        data: {
          totalLawyers,
          totalUsers,
          totalServices,
          activePackages,
        },
      };

    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getGrowthGrapthData() {
    try {
      const yearlyUsers = await this.db
        .select({
          year: sql<number>`YEAR(${schema.users.createdAt})`,
          type: schema.users.type,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.users)
        .groupBy(sql`YEAR(${schema.users.createdAt})`,
          schema.users.type
        )
        .orderBy(sql`YEAR(${schema.users.createdAt})`);


      const graphData: Array<{ year: number; client: number; lawyer: number }> = [];
      const yearMap: Record<number, { year: number; client: number; lawyer: number }> = {};

      for (let i = 0; i < yearlyUsers.length; i++) {
        const item = yearlyUsers[i];
        const year = item.year as number;

        // Create year entry if it doesn't exist
        if (!yearMap[year]) {
          yearMap[year] = { year, client: 0, lawyer: 0 };
          graphData.push(yearMap[year]);
        }

        if (item.type === 'USER') {
          yearMap[year].client = item.count;
        }
        else if (item.type === 'LAWYER') {
          yearMap[year].lawyer = item.count;
        }
        graphData.sort((a, b) => b.year - a.year);
      }

      return graphData;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }


  async getSupportTicketsCounts () {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [counts] = await this.db.select({
        newTickets: sql<number>`
        SUM(CASE 
          WHEN ${schema.supportAndComplaints.createdAt} >= ${last24Hours}
          THEN 1 ELSE 0 END)
      `,
        pendingTickets: sql<number>`
        SUM(CASE 
          WHEN ${schema.supportAndComplaints.status} = 'PENDING'
          THEN 1 ELSE 0 END)
      `,
        inProgressTickets: sql<number>`
        SUM(CASE 
          WHEN ${schema.supportAndComplaints.status} = 'IN PROGRESS'
          THEN 1 ELSE 0 END)
      `,
        resolvedTickets: sql<number>`
        SUM(CASE 
          WHEN ${schema.supportAndComplaints.status} = 'CLOSED'
          THEN 1 ELSE 0 END)
      `,
      })
        .from(schema.supportAndComplaints);

      return {
        success: true,
        data: {
          newTickets: Number(counts.newTickets),
          pendingTickets: Number(counts.pendingTickets),
          inProgressTickets: Number(counts.inProgressTickets),
          resolvedTickets: Number(counts.resolvedTickets),
        }
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch ticket counts');
    }
  }


  async createAnnouncement (body: any) {
    try {
      const { type, title, description, startDate , endDate  } = body;
      if (!type || !title || !description || !startDate || !endDate) {
        throw new InternalServerErrorException('All fields are required');
      }
      const [newAnnouncement] = await this.db.insert(schema.announcements).values({
        type,
        title,
        description,
        startDate,
        endDate,
        status: 'active',
      }).$returningId();

      if(!newAnnouncement || !newAnnouncement.id) {
        throw new InternalServerErrorException('Failed to create announcement');
      }

      const socketPayload = {
        id: newAnnouncement.id,
        type: type,
        title: title,
        description: description,
        date: 'Today', // Frontend formatting ke liye
        isRead: false, // Kyunki naya hai toh kisi ne nahi padha
      };

      this.socketService.emitToAll('new_announcement', socketPayload);

      return {
        success: true,
        message: 'Announcement created and broadcasted successfully',
        data: {
          id: newAnnouncement.id,
        },
      };

  }catch (error) {  
      throw new InternalServerErrorException('Failed to create announcement');
    }
}


// async getLawyersRequests(){
//    const rows = await this.db.select({
//    }).from(schema.lawyerProfiles)
// }


  async getLawyerRequestFullDetails(){
    const rows = await this.db
      .select()
      .from(schema.lawyerProfiles)
      .leftJoin(
        schema.lawyerProfessionalDetails,
        eq(schema.lawyerProfiles.id, schema.lawyerProfessionalDetails.lawyerId)
      )
      .leftJoin(
        schema.lawyerExpertise,
        eq(schema.lawyerProfiles.id, schema.lawyerExpertise.lawyerId)
      )
      .leftJoin(
        schema.lawyerOnboardingFeedback,
        eq(schema.lawyerProfiles.id, schema.lawyerOnboardingFeedback.lawyerId)
      )
      .where(eq(schema.lawyerProfiles.verificationStatus, 'PENDING'))
      .orderBy(desc(schema.lawyerProfiles.createdAt));

      // console.log(rows);
    return rows.map((row: any) => {
      return {
        identity: row.lawyer_profiles,
        professionalStructure: row.lawyer_professional_details ? {
          ...row.lawyer_professional_details,
          willingToServeOutside: row.lawyer_professional_details.willingToServeOutside ? 'yes' : 'no'
        } : {},
        expertise: row.lawyer_expertise?.servicesByField
          ? JSON.parse(row.lawyer_expertise.servicesByField)
          : {},
        feedback: row.lawyer_onboarding_feedback?.responses
          ? JSON.parse(row.lawyer_onboarding_feedback.responses)
          : {}
      };
    });
  }

}
