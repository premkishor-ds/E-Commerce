import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  TicketRepository,
  AgentStatusRepository,
  LiveChatSessionRepository,
} from '../../repositories/concrete.repositories';
import { Types } from 'mongoose';

@Injectable()
export class SupportService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly agentStatusRepository: AgentStatusRepository,
    private readonly liveChatSessionRepository: LiveChatSessionRepository,
  ) {}

  // --- STANDARD TICKETS ---

  async createTicket(userId: string, dto: any) {
    return this.ticketRepository.create({
      userId: new Types.ObjectId(userId),
      subject: dto.subject,
      priority: dto.priority || 'Medium',
      status: 'Open',
      messages: [
        {
          senderId: new Types.ObjectId(userId),
          message: dto.message,
          sentAt: new Date(),
        },
      ],
    });
  }

  async getCustomerTickets(userId: string) {
    return this.ticketRepository.find({ userId: new Types.ObjectId(userId) });
  }

  async getAllTickets() {
    return this.ticketRepository.find({});
  }

  async getTicketById(id: string) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async replyToTicket(ticketId: string, senderId: string, message: string) {
    const ticket = await this.getTicketById(ticketId);
    ticket.messages.push({
      senderId: new Types.ObjectId(senderId),
      message,
      sentAt: new Date(),
    });
    return ticket.save();
  }

  async assignTicket(ticketId: string, agentId: string) {
    const ticket = await this.getTicketById(ticketId);
    ticket.assignedAgentId = new Types.ObjectId(agentId);
    ticket.status = 'In Progress';
    return ticket.save();
  }

  async updateTicketStatus(ticketId: string, status: string) {
    const ticket = await this.getTicketById(ticketId);
    ticket.status = status;
    return ticket.save();
  }

  // --- AGENT FEATURES ---

  async setAgentStatus(agentId: string, status: string) {
    let agent = await this.agentStatusRepository.findOne({
      agentId: new Types.ObjectId(agentId),
    });
    if (!agent) {
      agent = await this.agentStatusRepository.create({
        agentId: new Types.ObjectId(agentId),
        status,
        activeQueueCount: 0,
        notes: [],
      });
    } else {
      agent.status = status;
      await agent.save();
    }
    return agent;
  }

  async addAgentNote(agentId: string, note: string) {
    const agent = await this.agentStatusRepository.findOne({
      agentId: new Types.ObjectId(agentId),
    });
    if (!agent) throw new NotFoundException('Agent not found');
    agent.notes.push(note);
    return agent.save();
  }

  async getAvailableAgents() {
    return this.agentStatusRepository.find({ status: 'Online' });
  }

  // --- LIVE CHAT SESSION ---

  async startLiveChatSession(userId: string, skillsRequired: string[] = [], userRole = 'Customer') {
    // Check if there's already an active session
    const active = await this.liveChatSessionRepository.findOne({
      userId: new Types.ObjectId(userId),
      status: 'Active',
    });
    if (active) return active;

    // Determine queue type based on user role or parameters
    let queueType = 'Regular';
    if (userRole === 'VIP' || userRole === 'Admin' || userRole === 'Super Admin') {
      queueType = 'VIP';
    } else if (userRole === 'Vendor' || userRole === 'Seller') {
      queueType = 'Priority';
    }

    // Skills matching: find online agents who possess the required skills
    const onlineAgents = await this.getAvailableAgents();
    const matchingAgents = onlineAgents.filter(agent => {
      const skills = (agent as any).skills || [];
      const hasSkills = skillsRequired.every(skill => skills.includes(skill));
      const hasCapacity = agent.activeQueueCount < ((agent as any).maxCapacity || 3);
      return hasSkills && hasCapacity;
    });

    let assignedAgentId: Types.ObjectId | null = null;
    if (matchingAgents.length > 0) {
      // Assign to the agent with the lowest load
      matchingAgents.sort((a, b) => a.activeQueueCount - b.activeQueueCount);
      const chosenAgent = matchingAgents[0];
      assignedAgentId = chosenAgent.agentId;
      chosenAgent.activeQueueCount += 1;
      
      const maxCap = (chosenAgent as any).maxCapacity || 3;
      if (chosenAgent.activeQueueCount >= maxCap) {
        chosenAgent.status = 'Busy';
      }
      // Add to agent's active sessions list
      const assigned = (chosenAgent as any).assignedSessions || [];
      assigned.push(new Types.ObjectId(userId));
      chosenAgent.markModified('assignedSessions');
      await chosenAgent.save();
    }

    // Calculate queue position if not assigned immediately
    let queuePosition = 0;
    let estimatedWaitTime = 0;
    if (!assignedAgentId) {
      const waitingInQueue = await this.liveChatSessionRepository.find({
        status: 'Active',
        assignedAgentId: null,
        queueType,
      });
      queuePosition = waitingInQueue.length + 1;
      const agentDivisor = onlineAgents.length || 1;
      estimatedWaitTime = Math.round((queuePosition * 120) / agentDivisor);
    }

    // Priority score calculated from queue type
    const priorityScore = queueType === 'VIP' ? 10 : queueType === 'Priority' ? 5 : 0;

    return this.liveChatSessionRepository.create({
      userId: new Types.ObjectId(userId),
      assignedAgentId,
      status: 'Active',
      queueType,
      priorityScore,
      estimatedWaitTime,
      messages: [
        {
          senderId: new Types.ObjectId(userId),
          senderName: 'Customer',
          message: assignedAgentId
            ? 'Chat session initiated. You are now connected with a support representative.'
            : `Chat session initiated. You are in the ${queueType} queue at position #${queuePosition}. Est. wait time: ${estimatedWaitTime}s.`,
          sentAt: new Date(),
        },
      ],
      rating: 0,
      transcript: '',
    });
  }

  async sendChatMessage(
    sessionId: string,
    senderId: string,
    senderName: string,
    message: string,
    attachmentUrl?: string,
  ) {
    const session = await this.liveChatSessionRepository.findById(sessionId);
    if (!session) throw new NotFoundException('Live chat session not found');
    if (session.status !== 'Active')
      throw new BadRequestException('Session is already closed');

    session.messages.push({
      senderId: new Types.ObjectId(senderId),
      senderName,
      message,
      sentAt: new Date(),
      attachmentUrl: attachmentUrl || '',
    });
    return session.save();
  }

  async rateLiveChatSession(sessionId: string, rating: number) {
    const session = await this.liveChatSessionRepository.findById(sessionId);
    if (!session) throw new NotFoundException('Live chat session not found');
    session.rating = rating;
    return session.save();
  }

  async forceCloseSession(sessionId: string, rating?: number) {
    const session = await this.liveChatSessionRepository.findById(sessionId);
    if (!session) throw new NotFoundException('Live chat session not found');

    session.status = 'Closed';
    session.transcript = session.messages
      .map((m) => `[${m.senderName}]: ${m.message}`)
      .join('\n');
    if (rating) session.rating = rating;
    await session.save();

    // Decrease active queue count for the agent
    if (session.assignedAgentId) {
      const agent = await this.agentStatusRepository.findOne({
        agentId: session.assignedAgentId,
      });
      if (agent) {
        agent.activeQueueCount = Math.max(0, agent.activeQueueCount - 1);
        const assigned = (agent as any).assignedSessions || [];
        const filtered = assigned.filter((id: any) => String(id) !== String(session._id));
        (agent as any).assignedSessions = filtered;
        agent.markModified('assignedSessions');

        const maxCap = (agent as any).maxCapacity || 3;
        if (agent.status === 'Busy' && agent.activeQueueCount < maxCap) {
          agent.status = 'Online';
        }
        await agent.save();
      }
    }
    return session;
  }

  async transferSession(sessionId: string, targetAgentId: string) {
    const session = await this.liveChatSessionRepository.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    const sourceAgentId = session.assignedAgentId;
    session.assignedAgentId = new Types.ObjectId(targetAgentId);
    await session.save();

    // Adjust old agent queue size
    if (sourceAgentId) {
      const oldAgent = await this.agentStatusRepository.findOne({
        agentId: sourceAgentId,
      });
      if (oldAgent) {
        oldAgent.activeQueueCount = Math.max(0, oldAgent.activeQueueCount - 1);
        const assigned = (oldAgent as any).assignedSessions || [];
        (oldAgent as any).assignedSessions = assigned.filter((id: any) => String(id) !== String(session._id));
        oldAgent.markModified('assignedSessions');
        if (oldAgent.status === 'Busy') oldAgent.status = 'Online';
        await oldAgent.save();
      }
    }

    // Adjust new agent queue size
    const newAgent = await this.agentStatusRepository.findOne({
      agentId: new Types.ObjectId(targetAgentId),
    });
    if (newAgent) {
      newAgent.activeQueueCount += 1;
      const assigned = (newAgent as any).assignedSessions || [];
      assigned.push(session._id);
      (newAgent as any).assignedSessions = assigned;
      newAgent.markModified('assignedSessions');

      const maxCap = (newAgent as any).maxCapacity || 3;
      if (newAgent.activeQueueCount >= maxCap) newAgent.status = 'Busy';
      await newAgent.save();
    }

    return session;
  }

  async getActiveSessions() {
    return this.liveChatSessionRepository.find({ status: 'Active' });
  }

  async getSessionHistory(userId: string) {
    return this.liveChatSessionRepository.find({
      userId: new Types.ObjectId(userId),
    });
  }

}
