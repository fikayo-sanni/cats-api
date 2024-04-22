import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { BaseAppController } from "src/http/api/base/base.controller";
import { Roles } from "src/common/decorators/roles.decorator";
import { CustomValidationPipe } from "src/common/pipes/custom-validation.pipe";
import { IAuthRequest } from "src/common/types/auth.types";
import { CreateCatDto } from "../../cats/dto/cat.create.dto";
import { Response } from "express";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { PaginationPipe } from "src/common/pipes/pagination.pipe";
import { IPaginationOptions } from "src/common/interfaces/pagination.interface";
import { generateMetaResponse } from "src/common/utils/pagination.util";

@Controller('api/v1/users')
@UseGuards(AccessTokenGuard, RolesGuard)
export class UsersController extends BaseAppController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Put('/make-admin/:id')
  @Roles(['admin'])
  async makeAdmin(
    @Param('id', new ParseIntPipe()) id: number, 
    @Res() res: Response,
  ) {
    const result = await this.usersService.makeAdmin(id);

    return this.getHttpResponse().setAuthDataWithKey('data', result).send(res);
  }

  @Get()
  @Roles(['admin'])
  @UsePipes(new PaginationPipe())
  async findAll(@Query() filterQuery: IPaginationOptions, @Req() req: IAuthRequest,
    @Res() res: Response) {
    const { items, count } = await this.usersService.findAll(filterQuery);

    const meta = generateMetaResponse(count, filterQuery, req);

    return this.getHttpResponse().sendResponseBody(res, { data: items, meta });
  }

  @Get('/:id')
  @Roles(['admin'])
  @UsePipes(new PaginationPipe())
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Req() req: IAuthRequest,
    @Res() res: Response) {
    const result = await this.usersService.findOne(id);

    return this.getHttpResponse().setAuthDataWithKey('data', result).send(res);
  }
}