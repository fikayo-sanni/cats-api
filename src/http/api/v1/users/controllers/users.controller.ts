import { Body, Controller, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { BaseAppController } from "src/http/api/base/base.controller";
import { Roles } from "src/common/decorators/roles.decorator";
import { CustomValidationPipe } from "src/common/pipes/custom-validation.pipe";
import { IAuthRequest } from "src/common/types/auth.types";
import { CreateCatDto } from "../../cats/dto/cat.create.dto";
import { Response } from "express";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

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
}