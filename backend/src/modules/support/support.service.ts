import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketRepository } from '../../repositories/concrete.repositories';
import { Types } from 'mongoose';

@Injectable()
export class SupportService {
  constructor(private readonly ticketRepository: TicketRepository) {}

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
    // Set status to In Progress if agent replies, or Open if customer replies
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
}
