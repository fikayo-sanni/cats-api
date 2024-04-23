import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CleanUserUpdateDto } from '../dto/user.clean.update.dto';
import { Response } from 'express';
import { IAuthRequest } from 'src/common/types/auth.types';
import { UserRole } from 'src/common/types/user.types';
import { MockPaginationParams } from 'src/common/mocks/common.mocks';
import { FetchManyUsers, FetchManyUsersPaginationMeta, UpdateUserRequest } from '../mocks/users.mocks';
import { HttpResponse } from 'src/common/utils/http.util';

// Mock the entire pagination.util.ts module
jest.mock('src/common/utils/pagination.util', () => ({
    __esModule: true,
    generateMetaResponse: jest.fn().mockReturnValue({
        first: "http://localhost:5001/api/v1/users?page=1",
        last: "http://localhost:5001/api/v1/users?page=NaN",
        prev: "http://localhost:5001/api/v1/users?page=NaN",
        next: "http://localhost:5001/api/v1/users?page=NaN",
        currentPage: null,
        previousPage: null,
        lastPage: null,
        total: 2
    }),
}));

describe('UsersController', () => {
    let controller: UsersController;
    let usersService: UsersService;
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<IAuthRequest>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        makeAdmin: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
        mockResponse = {
            send: jest.fn(),
        };
        mockRequest = {
            user: { sub: 1, roles: [UserRole.ADMIN] },
        };

        // Manually create a mock for getHttpResponse and assign it to the controller instance
        controller.getHttpResponse = jest.fn().mockReturnValue({
            setDataWithKey: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            sendResponseBody: jest.fn().mockReturnThis(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should make a user admin', async () => {
        const id = 1;
        const expectedResult = null;

        jest.spyOn(usersService, 'makeAdmin').mockResolvedValueOnce(expectedResult);

        await controller.makeAdmin(id, mockResponse as Response);

        expect(usersService.makeAdmin).toHaveBeenCalledWith(id);
        expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
            'data',
            expectedResult,
        );
    });

    it('should find all users', async () => {
        const filterQuery = MockPaginationParams;
        const items = FetchManyUsers.items;
        const count = FetchManyUsers.count;
        const expectedResult = { data: items, meta: FetchManyUsersPaginationMeta };

        jest.spyOn(usersService, 'findAll').mockResolvedValueOnce({ items, count });
        jest.spyOn(controller, 'getHttpResponse').mockReturnValue({
            sendResponseBody: jest.fn().mockReturnThis(),
        } as unknown as HttpResponse);

        await controller.findAll(filterQuery, mockRequest as IAuthRequest, mockResponse as Response);

        expect(usersService.findAll).toHaveBeenCalledWith(filterQuery);
        expect(controller.getHttpResponse().sendResponseBody).toHaveBeenCalledWith(
            mockResponse as Response,
            expectedResult,
        );
    });

    it('should find one user', async () => {
        const id = 3;
        const expectedResult = FetchManyUsers.items.find((user) => user.id == id);

        jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(expectedResult);

        await controller.findOne(id, mockRequest as IAuthRequest, mockResponse as Response);

        expect(usersService.findOne).toHaveBeenCalledWith(id);
        expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
            'data',
            expectedResult,
        );
    });

    it('should update an admin user', async () => {
        const id = 3;
        const user: CleanUserUpdateDto = UpdateUserRequest;
        const expectedResult = null;

        jest.spyOn(usersService, 'update').mockResolvedValueOnce(expectedResult);

        await controller.updateAdminUser(id, user, mockRequest as IAuthRequest, mockResponse as Response);

        expect(usersService.update).toHaveBeenCalledWith(id, user);
        expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
            'data',
            expectedResult,
        );
    });

    it('should update a session user', async () => {
        const user: CleanUserUpdateDto = UpdateUserRequest;
        const expectedResult = null;

        jest.spyOn(usersService, 'update').mockResolvedValueOnce(expectedResult);

        await controller.updateSessionUser(user, mockRequest as IAuthRequest, mockResponse as Response);

        expect(usersService.update).toHaveBeenCalledWith(mockRequest.user.sub, user);
        expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
            'data',
            expectedResult,
        );
    });
});
