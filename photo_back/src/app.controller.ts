import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { memoryStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.bucket = this.config.get<string>('SUPABASE_BUCKET') ?? 'photo';

    if (!url || !key) {
      throw new Error(
        'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env',
      );
    }

    this.supabase = createClient(url, key);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async postUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is required');

    const ext = file.originalname?.split('.').pop() ?? 'bin';
    const path = `temp/${crypto.randomUUID()}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });

    if (error) throw new BadRequestException(error.message);

    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);

    return { ok: true, path, publicUrl: data.publicUrl };
  }
}
