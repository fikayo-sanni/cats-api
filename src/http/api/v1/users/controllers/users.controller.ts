import { Controller } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { BaseAppController } from "src/http/api/base/base.controller";

@Controller('api/v1/users')
export class UsersController extends BaseAppController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
}