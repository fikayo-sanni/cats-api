import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { BaseAppController } from "src/http/api/base/base.controller";
import { FavoritesService } from "../services/favorites.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { CustomValidationPipe } from "src/common/pipes/custom-validation.pipe";
import { IAuthRequest } from "src/common/types/auth.types";
import { CreateCatDto } from "../../cats/dto/cat.create.dto";
import { Response } from "express";
import { PaginationPipe } from "src/common/pipes/pagination.pipe";
import { IPaginationOptions } from "src/common/interfaces/pagination.interface";
import { generateMetaResponse } from "src/common/utils/pagination.util";
import { RolesGuard } from "src/common/guards/roles.guard";

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('api/v1/favorites')
export class FavoriteController extends BaseAppController {
  constructor(private readonly favoritesService: FavoritesService) {
    super();
  }

  @Post('/:cat_id')
  async create(
    @Param('cat_id', new ParseIntPipe()) cat_id: number, 
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const result = await this.favoritesService.create({user_id: req.user.sub, cat_id});

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Delete('/:cat_id')
  async delete(
    @Param('cat_id', new ParseIntPipe()) cat_id: number, 
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const result = await this.favoritesService.remove({user_id: req.user.sub, cat_id});

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Get('/cat/:cat_id')
  @UsePipes(new PaginationPipe())
  async fetchCatLikes(
    @Query() filterQuery: IPaginationOptions,
    @Param('cat_id', new ParseIntPipe()) cat_id: number, 
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const {items, count} = await this.favoritesService.findAllByParams({cat_id}, filterQuery);

    const meta = generateMetaResponse(count, filterQuery, req);

    return this.getHttpResponse().sendResponseBody(res, { data: items, meta });
  }

  @Get('/user/:user_id')
  @Roles(['admin'])
  @UsePipes(new PaginationPipe())
  async fetchUserLikes(
    @Query() filterQuery: IPaginationOptions,
    @Param('user_id', new ParseIntPipe()) user_id: number, 
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const {items, count} = await this.favoritesService.findAllByParams({user_id}, filterQuery);

    const meta = generateMetaResponse(count, filterQuery, req);

    return this.getHttpResponse().sendResponseBody(res, { data: items, meta });
  }

  @Get('/user')
  @UsePipes(new PaginationPipe())
  async fetchSessionUserLikes(
    @Query() filterQuery: IPaginationOptions,
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const {items, count} = await this.favoritesService.findAllByParams({user_id: req.user.sub}, filterQuery);

    const meta = generateMetaResponse(count, filterQuery, req);

    return this.getHttpResponse().sendResponseBody(res, { data: items, meta });
  }
}