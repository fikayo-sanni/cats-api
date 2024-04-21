import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { BaseAppController } from "src/http/api/base/base.controller";
import { AuthRequest } from "src/common/types/auth.types";
import { CreateUserDto } from "../../users/dto/user.create.dto";
import { LoginAuthDto } from "../dto/auth.login.dto";

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

  @Post('logout')
  public async logout(@Req() req: AuthRequest) {
    await this.authService.logout(req.user.sub);
  }
}
