import { Controller, Get, Header, Request } from '@nestjs/common';
import { SeoService } from './seo.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('SEO / GEO / AEO & LLM Discovery (UCP)')
@Controller()
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  @ApiOperation({ summary: 'Retrieve dynamic XML Sitemap' })
  async getSitemap(@Request() req: any) {
    const host = req.headers.host || 'localhost:5001';
    return this.seoService.generateSitemapXml(host);
  }

  @Get('ai-discovery.json')
  @ApiOperation({
    summary: 'Retrieve AI agent discovery metadata (UCP compliant)',
  })
  async getAiDiscovery() {
    return this.seoService.getAiDiscovery();
  }

  @Get('model-context.json')
  @ApiOperation({ summary: 'Retrieve Model Context profile details' })
  async getModelContext() {
    return this.seoService.getModelContext();
  }

  @Get('llms.txt')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Retrieve LLM friendly catalog summary file' })
  async getLlmsText(@Request() req: any) {
    const host = req.headers.host || 'localhost:5001';
    return this.seoService.getLlmsText(host);
  }
}
