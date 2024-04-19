import { BadRequestAppException } from "./handlers/bad-request.exception.handler";
import { BaseAppException } from "./handlers/base.exception.handler";
import { ForbiddenAppException } from "./handlers/forbidden.exception.handler";
import { NotAuthorizedAppException } from "./handlers/not-authorized.exception.handler";
import { NotFoundAppException } from "./handlers/not-found.exception.handler";
import { ServerAppException } from "./handlers/server.exception.handler";
import { UnAuthorizedAppException } from "./handlers/unauthorized.exception.handler";
import { ValidationAppException } from "./handlers/validation.exception.handler";

export default {
    BaseAppException,
    BadRequestAppException,
    ForbiddenAppException,
    NotAuthorizedAppException,
    NotFoundAppException,
    ValidationAppException,
    ServerAppException,
    UnAuthorizedAppException,
}