import { IsString, IsNotEmpty, IsArray, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsSafeHtml } from '../../../common/validators/is-safe-html.validator';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'My First Blog Post', description: 'The title of the blog post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'my-first-blog-post', description: 'Unique slug for the blog post url' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: '<p>Welcome to ApexStore</p>', description: 'HTML content of the post' })
  @IsString()
  @IsNotEmpty()
  @IsSafeHtml()
  content: string;

  @ApiPropertyOptional({ example: ['news', 'promo'], description: 'List of tags' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1511512578047-dfb367046420', description: 'Featured banner image url' })
  @IsString()
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ example: 'Draft', enum: ['Draft', 'Published', 'Archived'], default: 'Draft' })
  @IsString()
  @IsOptional()
  status?: string;
}
