import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorites.controllers';
import { FavoritesService } from '../services/favorites.service';
import { Response } from 'express';
import { IAuthRequest } from 'src/common/types/auth.types';
import { IPaginationOptions } from 'src/common/interfaces/pagination.interface';
import { UserRole } from 'src/common/types/user.types';
import { CreateFavoriteResult, FetchManyLikes, FetchManyLikesPaginationMeta } from '../mocks/favorites.mocks';
import { MockPaginationParams } from 'src/common/mocks/common.mocks';
import { HttpResponse } from 'src/common/utils/http.util';

// Mock the entire pagination.util.ts module
jest.mock('src/common/utils/pagination.util', () => ({
    __esModule: true,
    generateMetaResponse: jest.fn().mockReturnValue({
        first: "http://localhost:5001/api/v1/favorites/cat/1?page=1",
        last: "http://localhost:5001/api/v1/favorites/cat/1?page=NaN",
        prev: "http://localhost:5001/api/v1/favorites/cat/1?page=NaN",
        next: "http://localhost:5001/api/v1/favorites/cat/1?page=NaN",
        currentPage: null,
        previousPage: null,
        lastPage: null,
        total: 1
    }),
}));

describe('FavoriteController', () => {
    let controller: FavoriteController;
    let favoritesService: FavoritesService;
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<IAuthRequest>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FavoriteController],
            providers: [
                {
                    provide: FavoritesService,
                    useValue: {
                        create: jest.fn(),
                        remove: jest.fn(),
                        findAllByParams: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<FavoriteController>(FavoriteController);
        favoritesService = module.get<FavoritesService>(FavoritesService);
        mockResponse = {
            send: jest.fn(),
        };
        mockRequest = {
            user: { sub: 3, roles: [UserRole.ADMIN] },
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

    it('should create a favorite', async () => {
        const cat_id = 2;
        const expectedResult = CreateFavoriteResult;

        jest.spyOn(favoritesService, 'create').mockResolvedValueOnce(expectedResult);

        await controller.create(cat_id, mockResponse as Response, mockRequest as IAuthRequest);

        expect(favoritesService.create).toHaveBeenCalledWith({ user_id: mockRequest.user.sub, cat_id });
        expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
            'data',
            expectedResult,
        );
    });

    it('should delete a favorite', async () => {
        const cat_id = 2;
        const expectedResult = null;

        jest.spyOn(favoritesService, 'remove').mockResolvedValueOnce(expectedResult);

        await controller.delete(cat_id, mockResponse as Response, mockRequest as IAuthRequest);

        expect(favoritesService.remove).toHaveBeenCalledWith({ user_id: mockRequest.user.sub, cat_id });
        expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
            'data',
            expectedResult,
        );
    });

    it('should fetch likes for a cat', async () => {
        const cat_id = 2;
        const filterQuery: IPaginationOptions = MockPaginationParams;
        const items = FetchManyLikes.items;
        const count = FetchManyLikes.count;
        const expectedResult = { data: items, meta: FetchManyLikesPaginationMeta };

        jest.spyOn(favoritesService, 'findAllByParams').mockResolvedValueOnce({ items, count });
        jest.spyOn(controller, 'getHttpResponse').mockReturnValue({
            sendResponseBody: jest.fn().mockReturnThis(),
        } as unknown as HttpResponse);

        await controller.fetchCatLikes(filterQuery, cat_id, mockResponse as Response, mockRequest as IAuthRequest);

        expect(favoritesService.findAllByParams).toHaveBeenCalledWith({ cat_id }, filterQuery);
        expect(controller.getHttpResponse().sendResponseBody).toHaveBeenCalledWith(
            mockResponse as Response,
            expectedResult,
        );
    });

    it('should fetch likes for a user', async () => {
        const user_id = 3;
        const filterQuery: IPaginationOptions = MockPaginationParams;
        const items = FetchManyLikes.items;
        const count = FetchManyLikes.count;
        const expectedResult = { data: items, meta: FetchManyLikesPaginationMeta };

        jest.spyOn(favoritesService, 'findAllByParams').mockResolvedValueOnce({ items, count });
        jest.spyOn(controller, 'getHttpResponse').mockReturnValue({
            sendResponseBody: jest.fn().mockReturnThis(),
        } as unknown as HttpResponse);

        await controller.fetchUserLikes(filterQuery, user_id, mockResponse as Response, mockRequest as IAuthRequest);

        expect(favoritesService.findAllByParams).toHaveBeenCalledWith({ user_id }, filterQuery);
        expect(controller.getHttpResponse().sendResponseBody).toHaveBeenCalledWith(
            mockResponse as Response,
            expectedResult,
        );
    });

    it('should fetch likes for the session user', async () => {
        const filterQuery: IPaginationOptions = MockPaginationParams;
        const items = FetchManyLikes.items;
        const count = FetchManyLikes.count;
        const expectedResult = { data: items, meta: FetchManyLikesPaginationMeta };

        jest.spyOn(favoritesService, 'findAllByParams').mockResolvedValueOnce({ items, count });
        jest.spyOn(controller, 'getHttpResponse').mockReturnValue({
            sendResponseBody: jest.fn().mockReturnThis(),
        } as unknown as HttpResponse);

        await controller.fetchSessionUserLikes(filterQuery, mockResponse as Response, mockRequest as IAuthRequest);

        expect(favoritesService.findAllByParams).toHaveBeenCalledWith({ user_id: mockRequest.user.sub }, filterQuery);
        expect(controller.getHttpResponse().sendResponseBody).toHaveBeenCalledWith(
            mockResponse as Response,
            expectedResult,
        );
    });
});
