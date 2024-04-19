import { Controller } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { BaseAppController } from "src/http/api/base/base.controller";

@Controller('api/v1/auth')
export class AuthController extends BaseAppController {
  constructor(private readonly authService: AuthService) {
    super();
  }
}