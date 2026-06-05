import { Injectable } from '@nestjs/common';

@Injectable()
export class FallbackService {
  suggestGoals(query: string): { question: string; suggestions: string[] } {
    const lower = query.toLowerCase();

    if (lower.includes('need') || lower.includes('want') || lower.includes('something')) {
      return {
        question: "I'm not quite sure what you need. Are you looking to shop, check your orders, get support, or update your profile?",
        suggestions: ['Go Shopping', 'Check Orders', 'Get Support', 'Update Profile'],
      };
    }

    return {
      question: "I'm sorry, I couldn't quite understand that. Would you like to check out some popular products, view your orders, or open a help ticket?",
      suggestions: ['Browse Products', 'My Orders', 'Create Ticket'],
    };
  }
}
