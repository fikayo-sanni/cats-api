import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { ParseIntPipe } from '../../../../../common/pipes/parse-int.pipe';
import { CatsService } from '../services/cats.service';
import { CreateCatDto } from '../dto/cat.create.dto';
import { BaseAppController } from 'src/http/api/base/base.controller';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { Response } from 'express';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { IPaginationOptions } from 'src/common/interfaces/pagination.interface';
import { IAuthRequest } from 'src/common/types/auth.types';
import { generateMetaResponse } from 'src/common/utils/pagination.util';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UpdateCatDto } from '../dto/cat.update.dto';
import { UserRole } from 'src/common/types/user.types';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('api/v1/cats')
export class CatsController extends BaseAppController {
  constructor(private readonly catsService: CatsService) {
    super();
  }

  @Post()
  @Roles([UserRole.ADMIN])
  async create(
    @Body(new CustomValidationPipe()) createCatDto: CreateCatDto,
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const result = await this.catsService.create(createCatDto, req.user.sub);

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Put('/:id')
  @Roles([UserRole.ADMIN])
  async update(
    @Param('id', new ParseIntPipe()) id: number, 
    @Body(new CustomValidationPipe()) updateCatDto: UpdateCatDto,
    @Res() res: Response
  ) {
    const result = await this.catsService.update(id, updateCatDto);

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Delete('/:id')
  @Roles([UserRole.ADMIN])
  async delete(
    @Param('id', new ParseIntPipe()) id: number, 
    @Res() res: Response
  ) {
    const result = await this.catsService.remove(id);

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Get()
  @UsePipes(new PaginationPipe())
  async findAll(@Query() filterQuery: IPaginationOptions, @Req() req: IAuthRequest,
    @Res() res: Response) {
    const { items, count } = await this.catsService.findAll(filterQuery);

    const meta = generateMetaResponse(count, filterQuery, req);

    return this.getHttpResponse().sendResponseBody(res, { data: items, meta });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response
  ) {
    const result = await this.catsService.findOne(id);

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }
}
