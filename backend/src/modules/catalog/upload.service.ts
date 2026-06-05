import { Injectable, BadRequestException } from '@nestjs/common';
import {
  FileMetadataRepository,
  LogRepository,
} from '../../repositories/concrete.repositories';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { Types } from 'mongoose';

@Injectable()
export class UploadService {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly logRepository: LogRepository,
  ) {}

  // A list of common test virus signatures (including EICAR standard)
  private readonly VIRUS_SIGNATURES = [
    '58554f2540505e2b48454c4f502d5354414e444152442d414e544956495255532d544553542d46494c452124482b482a', // EICAR hex
  ];

  async validateAndScanFile(
    userId: string,
    filename: string,
    mimeType: string,
    buffer: Buffer,
  ) {
    const sizeBytes = buffer.length;

    // 1. Size Check (Limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (sizeBytes > MAX_SIZE) {
      throw new BadRequestException('File size exceeds maximum limit of 5MB');
    }

    // 2. MIME Whitelist
    const whitelistedMimes = [
      'image/jpeg',
      'image/png',
      'text/csv',
      'application/pdf',
      'application/json',
    ];
    if (!whitelistedMimes.includes(mimeType)) {
      throw new BadRequestException(`MIME type '${mimeType}' is not allowed`);
    }

    // 3. Virus Signature Scan
    const fileHex = buffer.toString('hex');
    const md5Hash = crypto.createHash('md5').update(buffer).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    let isSafe = true;
    for (const signature of this.VIRUS_SIGNATURES) {
      if (fileHex.includes(signature)) {
        isSafe = false;
        break;
      }
    }

    const scanStatus = isSafe ? 'Safe' : 'Infected';

    // 4. Save file metadata
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}_${filename}`;
    const storagePath = path.join(uploadDir, uniqueName);
    
    if (isSafe) {
      fs.writeFileSync(storagePath, buffer);
    }

    const metadata = await this.fileMetadataRepository.create({
      userId: new Types.ObjectId(userId),
      filename,
      mimeType,
      sizeBytes,
      scanStatus,
      sha256: sha256Hash,
      storageUrl: isSafe ? `/static/uploads/${uniqueName}` : '',
    });

    // 5. Audit Logging
    await this.logRepository.create({
      userId: new Types.ObjectId(userId),
      action: 'FileUploadScan',
      details: `File ${filename} scanned. Status: ${scanStatus}. MD5: ${md5Hash}`,
      type: 'Audit',
    });

    if (!isSafe) {
      throw new BadRequestException('Security threat detected! File has been blocked.');
    }

    return metadata;
  }
}
