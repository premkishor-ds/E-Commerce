import { Injectable, Logger } from '@nestjs/common';
import {
  ApiLogRepository,
  SecurityLogRepository,
  LoginLogRepository,
  ImportLogRepository,
  ExportLogRepository,
  GuestLogRepository,
  ChangeHistoryRepository,
  AuditLogRepository,
  ActivityLogRepository,
  SearchLogRepository,
} from '../../repositories/concrete.repositories';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly apiLogRepo: ApiLogRepository,
    private readonly securityLogRepo: SecurityLogRepository,
    private readonly loginLogRepo: LoginLogRepository,
    private readonly importLogRepo: ImportLogRepository,
    private readonly exportLogRepo: ExportLogRepository,
    private readonly guestLogRepo: GuestLogRepository,
    private readonly changeHistoryRepo: ChangeHistoryRepository,
    private readonly auditLogRepo: AuditLogRepository,
    private readonly activityLogRepo: ActivityLogRepository,
    private readonly searchLogRepo: SearchLogRepository,
  ) {}

  // --- SENSITIVE DATA REDACTION HELPER ---
  redact(data: any): any {
    if (!data) return data;
    if (typeof data !== 'object') return data;

    const sensitiveKeys = [
      'password',
      'passwordhash',
      'password_hash',
      'otp',
      'otpcode',
      'otp_code',
      'cvv',
      'cardnumber',
      'card_number',
      'mfasecret',
      'mfa_secret',
      'token',
      'refreshtokens',
      'key',
      'apikey',
      'twiliotoken',
      'openaikey',
    ];

    const redactObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => redactObject(item));
      }
      if (obj && typeof obj === 'object') {
        const copy: Record<string, any> = {};
        for (const k of Object.keys(obj)) {
          const lowerK = k.toLowerCase();
          if (sensitiveKeys.includes(lowerK) || sensitiveKeys.some(s => lowerK.includes(s))) {
            copy[k] = '[REDACTED]';
          } else {
            copy[k] = redactObject(obj[k]);
          }
        }
        return copy;
      }
      return obj;
    };

    return redactObject(data);
  }

  // --- CENTRALIZED WRITERS ---
  async logApi(data: any) {
    try {
      return await this.apiLogRepo.create(this.redact(data));
    } catch (err) {
      this.logger.error('Failed to write API Log:', err.message);
    }
  }

  async logSecurity(data: any) {
    try {
      return await this.securityLogRepo.create(this.redact(data));
    } catch (err) {
      this.logger.error('Failed to write Security Log:', err.message);
    }
  }

  async logLogin(data: any) {
    try {
      return await this.loginLogRepo.create(data);
    } catch (err) {
      this.logger.error('Failed to write Login Log:', err.message);
    }
  }

  async logImport(data: any) {
    try {
      return await this.importLogRepo.create(data);
    } catch (err) {
      this.logger.error('Failed to write Import Log:', err.message);
    }
  }

  async logExport(data: any) {
    try {
      return await this.exportLogRepo.create(data);
    } catch (err) {
      this.logger.error('Failed to write Export Log:', err.message);
    }
  }

  async logGuest(data: any) {
    try {
      return await this.guestLogRepo.create(data);
    } catch (err) {
      this.logger.error('Failed to write Guest Log:', err.message);
    }
  }

  async logSearch(data: any) {
    try {
      return await this.searchLogRepo.create(data);
    } catch (err) {
      this.logger.error('Failed to write Search Log:', err.message);
    }
  }

  async logAudit(data: any) {
    try {
      return await this.auditLogRepo.create(this.redact(data));
    } catch (err) {
      this.logger.error('Failed to write Audit Log:', err.message);
    }
  }

  async logActivity(data: any) {
    try {
      return await this.activityLogRepo.create(this.redact(data));
    } catch (err) {
      this.logger.error('Failed to write Activity Log:', err.message);
    }
  }

  // --- DATABASE CHANGE TRACKER (Before & After states) ---
  async logChangeHistory(
    entityType: string,
    entityId: string,
    before: any,
    after: any,
    changedBy: string | null,
    changedByName: string,
    changedRole: string,
  ) {
    try {
      const bRedacted = this.redact(before || {});
      const aRedacted = this.redact(after || {});

      const allKeys = Array.from(new Set([...Object.keys(bRedacted), ...Object.keys(aRedacted)]));
      const ignoreFields = ['_id', 'id', 'createdAt', 'updatedAt', '__v', 'passwordHash', 'devices', 'refreshTokens'];

      for (const field of allKeys) {
        if (ignoreFields.includes(field)) continue;

        const valBefore = JSON.stringify(bRedacted[field] === undefined ? null : bRedacted[field]);
        const valAfter = JSON.stringify(aRedacted[field] === undefined ? null : aRedacted[field]);

        if (valBefore !== valAfter) {
          // Store each field change in ChangeHistory
          await this.changeHistoryRepo.create({
            entityType,
            entityId,
            changedField: field,
            previousValue: String(bRedacted[field] ?? 'None'),
            newValue: String(aRedacted[field] ?? 'None'),
            changedBy: changedBy ? (changedBy as any) : null,
            changedByName,
            changedRole,
          });
        }
      }
    } catch (err) {
      this.logger.error('Failed to log change history:', err.message);
    }
  }

  // --- LOG RETENTION & AUTO ARCHIVE ---
  async runRetentionPurge(daysLimit: number): Promise<{ purged: number }> {
    if (daysLimit <= 0) return { purged: 0 }; // Forever retention

    const cutOffDate = new Date(Date.now() - daysLimit * 24 * 60 * 60 * 1000);
    this.logger.log(`Running log retention purge for records older than ${daysLimit} days (${cutOffDate.toLocaleDateString()}).`);

    let totalPurged = 0;
    try {
      const q = { createdAt: { $lt: cutOffDate } };

      const apiDel = await (this.apiLogRepo as any).deleteMany(q);
      const secDel = await (this.securityLogRepo as any).deleteMany(q);
      const loginDel = await (this.loginLogRepo as any).deleteMany(q);
      const importDel = await (this.importLogRepo as any).deleteMany(q);
      const exportDel = await (this.exportLogRepo as any).deleteMany(q);
      const guestDel = await (this.guestLogRepo as any).deleteMany(q);
      const changeDel = await (this.changeHistoryRepo as any).deleteMany(q);
      const auditDel = await (this.auditLogRepo as any).deleteMany(q);
      const activityDel = await (this.activityLogRepo as any).deleteMany(q);
      const searchDel = await (this.searchLogRepo as any).deleteMany(q);

      totalPurged += (apiDel.deletedCount || 0) +
                    (secDel.deletedCount || 0) +
                    (loginDel.deletedCount || 0) +
                    (importDel.deletedCount || 0) +
                    (exportDel.deletedCount || 0) +
                    (guestDel.deletedCount || 0) +
                    (changeDel.deletedCount || 0) +
                    (auditDel.deletedCount || 0) +
                    (activityDel.deletedCount || 0) +
                    (searchDel.deletedCount || 0);

      this.logger.log(`Purged ${totalPurged} old log entries.`);
    } catch (err) {
      this.logger.error('Error in retention purge:', err.message);
    }

    return { purged: totalPurged };
  }
}
