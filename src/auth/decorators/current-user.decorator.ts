import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ValidRoles } from "../enums/valid-roles.enum";


export const CurrentUser = createParamDecorator(
    (roles: ValidRoles[] = [], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        //ctx.getContext().req.user;

        if(!user) {
            throw new InternalServerErrorException('error en decorator no user')
        }
        if (roles.length === 0) return user;
        for (const role of user.roles) {
            if (roles.includes(role as ValidRoles)) {
                return user;
            }
        }
        throw new ForbiddenException(`el usuario no cuenta con permisos de administrador`)
    }
)