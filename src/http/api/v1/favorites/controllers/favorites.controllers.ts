import { Body, Controller, Delete, Param, ParseIntPipe, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { BaseAppController } from "src/http/api/base/base.controller";
import { FavoritesService } from "../services/favorites.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { CustomValidationPipe } from "src/common/pipes/custom-validation.pipe";
import { IAuthRequest } from "src/common/types/auth.types";
import { CreateCatDto } from "../../cats/dto/cat.create.dto";
import { Response } from "express";

@UseGuards(AccessTokenGuard)
@Controller('api/v1/favorites')
export class CatsController extends BaseAppController {
  constructor(private readonly favoritesService: FavoritesService) {
    super();
  }

  @Post('/:cat_id')
  @Roles(['admin'])
  async create(
    @Param('cat_id', new ParseIntPipe()) cat_id: number, 
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const result = await this.favoritesService.create({user_id: req.user.sub, cat_id});

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Delete('/:cat_id')
  @Roles(['admin'])
  async delete(
    @Param('cat_id', new ParseIntPipe()) cat_id: number, 
    @Res() res: Response,
    @Req() req: IAuthRequest
  ) {
    const result = await this.favoritesService.remove({user_id: req.user.sub, cat_id});

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }
}