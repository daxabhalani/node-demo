import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainsService } from './domains.service';
import { CreateDomain, PaginationDto } from './domains.dto';

@Controller('api/v1/domain')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post('/')
  @HttpCode(200)
  async CreateDomain(@Body() data: CreateDomain, @Res() res: Response) {
    return await this.domainsService.createDomain(data, res);
  }

  @Get('/')
  @HttpCode(200)
  async getAllDomains(@Query() query: PaginationDto, @Res() res: Response) {
    return await this.domainsService.getAllDomains(query, res);
  }

  @Put('/:domainId')
  @HttpCode(200)
  async updateDomain(
    @Param('domainId') domainId: string,
    @Body() data: CreateDomain,
    @Res() res: Response,
  ) {
    return await this.domainsService.updateDomain(domainId, data, res);
  }

  @Get('/byOwner/:ownerId')
  @HttpCode(200)
  async getDomainsByOwner(
    @Param('ownerId') ownerId: string,
    @Res() res: Response,
  ) {
    return await this.domainsService.getDomainsByOwner(ownerId, res);
  }

  @Post('/search')
  @HttpCode(200)
  async searchDomain(@Query('q') query: string, @Res() res: Response) {
    return await this.domainsService.searchDomain(query, res);
  }
}
