import { PartialType } from '@nestjs/swagger';
import { CreateBlogPostDto } from './create-blog.dto';

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
