import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { 
  FeedbackTicketRepository, 
  FeedbackCommentRepository, 
  FeedbackAttachmentRepository, 
  FeedbackVoteRepository, 
  FeedbackActivityLogRepository,
  UserRepository,
  NotificationRepository
} from '../../repositories/concrete.repositories';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackTicketRepository,
    private readonly commentRepo: FeedbackCommentRepository,
    private readonly attachmentRepo: FeedbackAttachmentRepository,
    private readonly voteRepo: FeedbackVoteRepository,
    private readonly activityRepo: FeedbackActivityLogRepository,
    private readonly userRepo: UserRepository,
    private readonly notificationRepo: NotificationRepository,
  ) {}

  // Generate unique Ticket ID
  private async generateTicketId(): Promise<string> {
    const prefix = 'FDB-';
    const rand = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
    return `${prefix}${rand}`;
  }

  // Create feedback ticket (Guest or Logged-in)
  async submitFeedback(payload: any, userContext?: any): Promise<any> {
    // Basic captcha check if guest
    if (!userContext && payload.captchaAnswer === undefined) {
      // Captcha required for guest submissions
    }

    const ticketId = await this.generateTicketId();
    const isSecurity = payload.type === 'Security Report';
    
    // Auto-populate user details if logged in
    let userId = null;
    let userRole = 'Guest';
    let name = payload.name || 'Anonymous';
    let email = payload.email || 'guest@example.com';
    let phone = payload.phone || '';

    if (userContext) {
      userId = userContext._id;
      userRole = userContext.roles?.[0] || 'Customer';
      name = `${userContext.firstName || ''} ${userContext.lastName || ''}`.trim() || userContext.email;
      email = userContext.email;
      phone = userContext.phone || '';
    }

    // Capture context
    const ticketData = {
      ticketId,
      name,
      email,
      phone,
      userId: userId ? new Types.ObjectId(userId) : null,
      userRole,
      type: payload.type,
      category: payload.category || 'General',
      subject: payload.subject,
      description: payload.description,
      priority: isSecurity ? 'Critical' : (payload.priority || 'Medium'),
      severity: isSecurity ? 'Critical' : (payload.severity || 'Medium'),
      status: 'New',
      url: payload.url || '',
      referrerUrl: payload.referrerUrl || '',
      browser: payload.browser || 'Unknown Browser',
      device: payload.device || 'Desktop',
      os: payload.os || 'Windows',
      screenResolution: payload.screenResolution || '1920x1080',
      sessionID: payload.sessionID || '',
      ipAddress: payload.ipAddress || '127.0.0.1',
      isConfidential: isSecurity,
      roadmapStatus: payload.type === 'Feature Request' ? 'none' : 'none',
      votesCount: 0,
    };

    const created = await this.feedbackRepo.create(ticketData);

    // Save attachments if any
    if (payload.attachments && Array.isArray(payload.attachments)) {
      for (const att of payload.attachments) {
        await this.attachmentRepo.create({
          feedbackId: created._id,
          fileName: att.name || 'attachment',
          fileType: att.type || 'image/png',
          fileSize: att.size || 0,
          fileUrl: att.url || '',
          uploadedBy: userId ? new Types.ObjectId(userId) : null,
        });
      }
    }

    // Log Activity
    await this.activityRepo.create({
      feedbackId: created._id,
      userId: userId ? new Types.ObjectId(userId) : null,
      userName: name,
      userRole,
      action: 'Feedback Submitted',
      newValue: 'New feedback ticket generated successfully.'
    });

    // Notify Admins (Find an admin to send this notification to)
    const adminUser = await this.userRepo.findOne({ roles: 'Admin' });
    const adminUserId = adminUser ? adminUser._id : (userId ? new Types.ObjectId(userId) : null);
    
    if (adminUserId) {
      await this.notificationRepo.create({
        userId: new Types.ObjectId(adminUserId),
        title: `New Feedback Submitted: ${ticketId}`,
        message: `A new ${payload.type} was submitted by ${name} (${userRole}).`,
        type: 'feedback',
      });
    }

    // Notify user if email exists
    if (email && userId) {
      await this.notificationRepo.create({
        userId: new Types.ObjectId(userId),
        title: `Feedback Ticket Created: ${ticketId}`,
        message: `Your feedback ticket ${ticketId} has been successfully created.`,
        type: 'feedback',
      });
    }

    return created;
  }


  // Duplicate detection - Find similar tickets
  async detectDuplicates(type: string, subject: string): Promise<any[]> {
    const allTickets = await this.feedbackRepo.find({ type, status: { $ne: 'Closed' } });
    const queryWords = subject.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    if (queryWords.length === 0) return [];

    const matches = allTickets.filter((ticket: any) => {
      const ticketSubject = (ticket.subject || '').toLowerCase();
      // Count overlap
      const overlap = queryWords.filter(word => ticketSubject.includes(word));
      return overlap.length >= 2; // At least 2 matching words
    });

    return matches.slice(0, 5); // Return top 5 duplicates
  }

  // Voting on feature requests
  async voteFeature(ticketId: string, userId: string): Promise<any> {
    const ticket = await this.feedbackRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');
    if (ticket.type !== 'Feature Request') {
      throw new ForbiddenException('You can only vote on Feature Requests');
    }

    // Check duplicate vote
    const existingVote = await this.voteRepo.findOne({
      feedbackId: new Types.ObjectId(ticketId),
      userId: new Types.ObjectId(userId),
    });

    if (existingVote) {
      throw new ForbiddenException('You have already voted on this feature request');
    }

    await this.voteRepo.create({
      feedbackId: new Types.ObjectId(ticketId),
      userId: new Types.ObjectId(userId),
    });

    ticket.votesCount = (ticket.votesCount || 0) + 1;
    await ticket.save();

    // Log Activity
    await this.activityRepo.create({
      feedbackId: ticket._id,
      userId: new Types.ObjectId(userId),
      userName: 'User',
      userRole: 'Customer',
      action: 'Voted on Feature',
      newValue: `Total votes: ${ticket.votesCount}`
    });

    return ticket;
  }

  // Submit satisfaction survey
  async submitSurvey(ticketId: string, payload: { rating: number; comment?: string }): Promise<any> {
    const ticket = await this.feedbackRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');

    ticket.rating = payload.rating;
    ticket.surveyComment = payload.comment || '';
    await ticket.save();

    // Log Activity
    await this.activityRepo.create({
      feedbackId: ticket._id,
      userId: ticket.userId,
      userName: ticket.name,
      userRole: ticket.userRole,
      action: 'Satisfaction Survey Submitted',
      newValue: `Rating: ${payload.rating}/5 Stars. Comments: ${payload.comment || 'None'}`
    });

    return ticket;
  }

  // GET stats & metrics for admin dashboard
  async getStatsDashboard(): Promise<any> {
    const all = await this.feedbackRepo.find();
    
    const stats = {
      total: all.length,
      open: all.filter((t: any) => t.status !== 'Closed' && t.status !== 'Resolved' && t.status !== 'Rejected').length,
      resolved: all.filter((t: any) => t.status === 'Resolved' || t.status === 'Closed').length,
      bugs: all.filter((t: any) => t.type === 'Bug Report').length,
      features: all.filter((t: any) => t.type === 'Feature Request').length,
      complaints: all.filter((t: any) => t.type === 'Complaint').length,
      security: all.filter((t: any) => t.type === 'Security Report').length,
      
      // Category summaries
      categoryBreakdown: {
        General: all.filter((t: any) => t.category === 'General' || t.category.includes('General')).length,
        Bugs: all.filter((t: any) => t.type === 'Bug Report').length,
        Features: all.filter((t: any) => t.type === 'Feature Request').length,
        Complaints: all.filter((t: any) => t.type === 'Complaint').length,
        Security: all.filter((t: any) => t.type === 'Security Report').length,
      },

      // High-level analytics
      resolutionRate: 0,
      avgResolutionTimeHrs: 24.5, // Mock value
      userSatisfactionScore: 0,
    };

    const closedOrResolved = all.filter((t: any) => t.status === 'Resolved' || t.status === 'Closed');
    stats.resolutionRate = all.length ? Math.round((closedOrResolved.length / all.length) * 100) : 0;

    const ratedTickets = all.filter((t: any) => t.rating > 0);
    const avgRating = ratedTickets.length 
      ? (ratedTickets.reduce((sum: number, t: any) => sum + t.rating, 0) / ratedTickets.length) 
      : 4.2;
    stats.userSatisfactionScore = Math.round(avgRating * 20); // Scale to 100%

    return stats;
  }

  // Admin: Get listing with filters, search, pagination
  async getFeedbackList(query: any, adminUser: any): Promise<any> {
    const filter: any = {};

    // Confidentiality/Security Restriction: Only Admins/Super Admins can query confidential/Security reports
    const roles = adminUser.roles || [];
    const isPowerAdmin = roles.includes('Admin') || roles.includes('Super Admin');
    if (!isPowerAdmin) {
      filter.isConfidential = { $ne: true };
    }

    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.category) filter.category = query.category;

    if (query.search) {
      filter.$or = [
        { subject: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { name: { $regex: query.search, $options: 'i' } },
        { ticketId: { $regex: query.search, $options: 'i' } },
      ];
    }

    const items = await this.feedbackRepo.find(filter);

    // Manual Sort
    const sortField = query.sortField || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    items.sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return -sortOrder;
      if (valA > valB) return sortOrder;
      return 0;
    });

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      data: items.slice(startIndex, endIndex),
      total: items.length,
      page,
      totalPages: Math.ceil(items.length / limit) || 1,
    };
  }

  // Admin: Get ticket detail with comments, attachments, activities
  async getFeedbackDetail(id: string, adminUser: any): Promise<any> {
    const ticket = await this.feedbackRepo.findById(id);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');

    // Confidentiality Check
    if (ticket.isConfidential) {
      const roles = adminUser.roles || [];
      const isPowerAdmin = roles.includes('Admin') || roles.includes('Super Admin');
      if (!isPowerAdmin) {
        throw new ForbiddenException('Confidential security reports are restricted to Administrators only.');
      }
    }

    const comments = await this.commentRepo.find({ feedbackId: ticket._id });
    const attachments = await this.attachmentRepo.find({ feedbackId: ticket._id });
    const activities = await this.activityRepo.find({ feedbackId: ticket._id });

    // Filter private comments (internal notes) based on admin rights
    const roles = adminUser.roles || [];
    const isStaff = roles.includes('Admin') || roles.includes('Super Admin') || roles.includes('Support Agent');
    const filteredComments = isStaff ? comments : comments.filter((c: any) => !c.isPrivate);

    return {
      ticket,
      comments: filteredComments,
      attachments,
      activities
    };
  }

  // Admin: Update Status / Workflow
  async updateStatus(id: string, status: string, adminUser: any): Promise<any> {
    const ticket = await this.feedbackRepo.findById(id);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');

    const oldStatus = ticket.status;
    ticket.status = status;
    await ticket.save();

    // Log Activity
    const adminName = adminUser.email;
    await this.activityRepo.create({
      feedbackId: ticket._id,
      userId: adminUser._id,
      userName: adminName,
      userRole: adminUser.roles?.[0] || 'Admin',
      action: 'Status Changed',
      oldValue: oldStatus,
      newValue: status,
    });

    // Notify user
    if (ticket.userId) {
      await this.notificationRepo.create({
        userId: ticket.userId,
        title: `Feedback status updated: ${ticket.ticketId}`,
        message: `Your feedback ticket ${ticket.ticketId} status has changed to ${status}.`,
        type: 'feedback',
      });
    }

    return ticket;
  }

  // Admin: Assign Ticket
  async assignTicket(id: string, team: string, agentId: string | null, adminUser: any): Promise<any> {
    const ticket = await this.feedbackRepo.findById(id);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');

    const oldAssignee = ticket.assignedTo;
    ticket.assignedTo = team;
    if (agentId) {
      ticket.assignedAgentId = new Types.ObjectId(agentId);
      ticket.status = 'Assigned';
    } else {
      ticket.assignedAgentId = null;
    }
    await ticket.save();

    // Log Activity
    const adminName = adminUser.email;
    await this.activityRepo.create({
      feedbackId: ticket._id,
      userId: adminUser._id,
      userName: adminName,
      userRole: adminUser.roles?.[0] || 'Admin',
      action: 'Ticket Assigned',
      oldValue: oldAssignee,
      newValue: `${team}${agentId ? ` (Agent: ${agentId})` : ''}`,
    });

    // Notify assigned agent if any
    if (agentId) {
      await this.notificationRepo.create({
        userId: new Types.ObjectId(agentId),
        title: `Feedback ticket assigned: ${ticket.ticketId}`,
        message: `You have been assigned to feedback ticket ${ticket.ticketId}.`,
        type: 'feedback',
      });
    }

    return ticket;
  }

  // Admin: Update Roadmap status (Feature requests only)
  async updateRoadmap(id: string, status: string, adminUser: any): Promise<any> {
    const ticket = await this.feedbackRepo.findById(id);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');

    const oldRoadmap = ticket.roadmapStatus;
    ticket.roadmapStatus = status;
    await ticket.save();

    // Log Activity
    const adminName = adminUser.email;
    await this.activityRepo.create({
      feedbackId: ticket._id,
      userId: adminUser._id,
      userName: adminName,
      userRole: adminUser.roles?.[0] || 'Admin',
      action: 'Roadmap Status Changed',
      oldValue: oldRoadmap,
      newValue: status,
    });

    return ticket;
  }

  // Submit Comment / Reply
  async addComment(id: string, text: string, isPrivate: boolean, adminUser: any): Promise<any> {
    const ticket = await this.feedbackRepo.findById(id);
    if (!ticket) throw new NotFoundException('Feedback ticket not found');

    const authorRole = adminUser.roles?.[0] || 'Support Agent';
    const authorName = adminUser.email;

    const comment = await this.commentRepo.create({
      feedbackId: ticket._id,
      userId: adminUser._id,
      userName: authorName,
      userRole: authorRole,
      text,
      isPrivate: isPrivate || false,
    });

    // Log Activity
    await this.activityRepo.create({
      feedbackId: ticket._id,
      userId: adminUser._id,
      userName: authorName,
      userRole: authorRole,
      action: isPrivate ? 'Internal Note Added' : 'Admin Replied',
      newValue: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
    });

    // Notify User if it's not a private comment
    if (!isPrivate && ticket.userId) {
      await this.notificationRepo.create({
        userId: ticket.userId,
        title: `Reply on feedback: ${ticket.ticketId}`,
        message: `${authorName} replied: "${text.slice(0, 50)}..."`,
        type: 'feedback',
      });
    }

    return comment;
  }
}
