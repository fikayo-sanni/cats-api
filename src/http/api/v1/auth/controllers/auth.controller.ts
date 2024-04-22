import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { BaseAppController } from "src/http/api/base/base.controller";
import { IAuthRequest } from "src/common/types/auth.types";
import { CreateUserDto } from "../../users/dto/user.create.dto";
import { LoginAuthDto } from "../dto/auth.login.dto";
import { Response } from "express";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { CustomValidationPipe } from "src/common/pipes/custom-validation.pipe";
import { RefreshAuthDto } from "../dto/auth.refresh.dto";

@Controller('api/v1/auth')
export class AuthController extends BaseAppController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('register')
  public async signup(
    @Body(new CustomValidationPipe()) user: CreateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.register(user);

    return this.getHttpResponse().setDataWithKey('data', result).send(res);
  }

  @Post('login')
  public async signin(
    @Body(new CustomValidationPipe()) data: LoginAuthDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.login(data);

    return this.getHttpResponse().setAuthDataWithKey('data', result).send(res);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  public async sessionUser(@Req() req: IAuthRequest, @Res() res: Response,) {
    const result = await this.authService.sessionUser(req.user.sub);

    return this.getHttpResponse().setAuthDataWithKey('data', result).send(res);
  }

  @Put('refresh')
  public async refreshUserTokens(@Body(new CustomValidationPipe()) data: RefreshAuthDto, @Res() res: Response,) {
    const result = await this.authService.refreshTokens(data.refresh_token);

    return this.getHttpResponse().setAuthDataWithKey('data', result).send(res);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  public async logout(@Req() req: IAuthRequest, @Res() res: Response,) {
    const result = await this.authService.logout(req.user.sub);

    return this.getHttpResponse().setAuthDataWithKey('data', result).send(res);
  }
}
