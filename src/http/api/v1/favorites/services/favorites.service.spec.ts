import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorites.entity';
import { UsersService } from '../../users/services/users.service';
import { CatsService } from '../../cats/services/cats.service';
import { BadRequestAppException, NotFoundAppException } from 'src/common/exceptions';
import { ResponseMessages } from 'src/common/exceptions/constants/messages.constants';
import { FavoriteDto } from '../dtos/favorites.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';
import { CreateFavoriteResult, FetchManyLikes } from '../mocks/favorites.mocks';
import { MockPaginationParams } from 'src/common/mocks/common.mocks';

describe('FavoritesService', () => {
    let service: FavoritesService;
    let repository: Repository<Favorite>;
    let userService: UsersService;
    let catService: CatsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FavoritesService,
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: CatsService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: 'FavoriteRepository',
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<FavoritesService>(FavoritesService);
        repository = module.get<Repository<Favorite>>('FavoriteRepository');
        userService = module.get<UsersService>(UsersService);
        catService = module.get<CatsService>(CatsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a favorite', async () => {
            const createFavoriteDto: FavoriteDto = { user_id: CreateFavoriteResult.user.id, cat_id: CreateFavoriteResult.cat.id };
            const user = CreateFavoriteResult.user;
            const cat = CreateFavoriteResult.cat;
            const expectedResult = CreateFavoriteResult;

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
            jest.spyOn(catService, 'findOne').mockResolvedValueOnce(cat);
            jest.spyOn(repository, 'create').mockReturnValueOnce(expectedResult);
            jest.spyOn(repository, 'save').mockResolvedValueOnce(expectedResult);

            const result = await service.create(createFavoriteDto);

            expect(service.findOne).toHaveBeenCalledWith(createFavoriteDto);
            expect(userService.findOne).toHaveBeenCalledWith(createFavoriteDto.user_id);
            expect(catService.findOne).toHaveBeenCalledWith(createFavoriteDto.cat_id);
            expect(repository.create).toHaveBeenCalledWith({ user, cat });
            expect(repository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });

        it('should throw BadRequestAppException if favorite already exists', async () => {
            const createFavoriteDto: FavoriteDto = { user_id: CreateFavoriteResult.user.id, cat_id: CreateFavoriteResult.cat.id };
            const existingFavorite: Favorite = CreateFavoriteResult;

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(existingFavorite);

            await expect(service.create(createFavoriteDto)).rejects.toThrow(BadRequestAppException);
        });
    });

    describe('remove', () => {
        it('should remove a favorite', async () => {
            const params: FavoriteDto = { user_id: CreateFavoriteResult.user.id, cat_id: CreateFavoriteResult.cat.id };
            const favorite: Favorite = CreateFavoriteResult

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(favorite);
            jest.spyOn(repository, 'remove').mockResolvedValueOnce(null);

            await service.remove(params);

            expect(service.findOne).toHaveBeenCalledWith(params);
            expect(repository.remove).toHaveBeenCalledWith(favorite);
        });

        it('should throw NotFoundAppException if favorite does not exist', async () => {
            const params: FavoriteDto = { user_id: CreateFavoriteResult.user.id, cat_id: CreateFavoriteResult.cat.id };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

            await expect(service.remove(params)).rejects.toThrow(NotFoundAppException);
        });
    });

    describe('findAllByParams', () => {
        it('should find all favorites by params', async () => {
            const params: Partial<FavoriteDto> = { user_id: CreateFavoriteResult.user.id, cat_id: CreateFavoriteResult.cat.id };
            const pagination: IPaginationOptions = MockPaginationParams;
            const items: Favorite[] = FetchManyLikes.items;
            const count: number = FetchManyLikes.count;
            const expectedResult: IPaginationResult<Favorite> = { items, count };

            jest.spyOn(catService, 'findOne').mockResolvedValueOnce(CreateFavoriteResult.cat);
            jest.spyOn(userService, 'findOne').mockResolvedValueOnce(CreateFavoriteResult.user);
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValueOnce(items),
            } as any);
            jest.spyOn(repository, 'count').mockResolvedValueOnce(count);

            const result = await service.findAllByParams(params, pagination);

            expect(catService.findOne).toHaveBeenCalledWith(params.cat_id);
            expect(userService.findOne).toHaveBeenCalledWith(params.user_id);
            expect(repository.createQueryBuilder).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });
});
