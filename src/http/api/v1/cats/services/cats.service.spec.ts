import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { Repository } from 'typeorm';
import { Cat } from '../entities/cats.entity';
import { CreateCatDto } from '../dto/cat.create.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';
import { NotAuthorizedAppException, NotFoundAppException } from 'src/common/exceptions';
import { UpdateCatDto } from '../dto/cat.update.dto';
import { UsersService } from '../../users/services/users.service';
import { Favorite } from '../../favorites/entities/favorites.entity';
import { CreateCatRequest, CreateCatResponse, FetchManyCats, UpdateCatRequest } from '../mocks/cats.mocks';
import { MockPaginationParams } from 'src/common/mocks/common.mocks';

describe('CatsService', () => {
  let service: CatsService;
  let catRepository: Repository<Cat>;
  let favoriteRepository: Repository<Favorite>;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: 'CatRepository',
          useValue: {
            update: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: 'FavoriteRepository',
          useValue: {
            delete: jest.fn()
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    catRepository = module.get<Repository<Cat>>('CatRepository');
    favoriteRepository = module.get<Repository<Favorite>>('FavoriteRepository');
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat', async () => {
      const createCatDto: CreateCatDto = CreateCatRequest;
      const user_id = 4;
      const user = CreateCatResponse.user;
      const cat: Cat = CreateCatResponse;
      const expectedResult: Cat = CreateCatResponse;

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(catRepository, 'create').mockReturnValueOnce(cat);
      jest.spyOn(catRepository, 'save').mockResolvedValueOnce(expectedResult);

      const result = await service.create(createCatDto, user_id);

      expect(userService.findOne).toHaveBeenCalledWith(user_id);
      expect(catRepository.create).toHaveBeenCalledWith({ ...createCatDto, user });
      expect(catRepository.save).toHaveBeenCalledWith(cat);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotAuthorizedAppException if user does not exist', async () => {
      const createCatDto: CreateCatDto = CreateCatRequest;
      const user_id = 55;

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(service.create(createCatDto, user_id)).rejects.toThrow(NotAuthorizedAppException);
    });
  });

  describe('findAll', () => {
    it('should return a list of cats', async () => {
      const paginationOptions: IPaginationOptions = MockPaginationParams;
      const cats: Cat[] = FetchManyCats.items;
      const count = FetchManyCats.count;

      jest.spyOn(catRepository, 'createQueryBuilder').mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce(cats),
      } as any);
      jest.spyOn(catRepository, 'count').mockResolvedValueOnce(count);

      const result = await service.findAll(paginationOptions);

      expect(catRepository.createQueryBuilder).toHaveBeenCalled();
      expect(catRepository.count).toHaveBeenCalled();
      expect(result).toEqual({ items: cats, count });
    });
  });

  describe('findOne', () => {
    it('should return a cat by id', async () => {
      const id = 2;
      const cat: Cat = CreateCatResponse;

      jest.spyOn(catRepository, 'createQueryBuilder').mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(cat),
      } as any);

      const result = await service.findOne(id);

      expect(catRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(cat);
    });

    it('should throw NotFoundAppException if cat does not exist', async () => {
      const id = 4;

      jest.spyOn(catRepository, 'createQueryBuilder').mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundAppException);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const id = 4;
      const updateCatDto: UpdateCatDto = UpdateCatRequest;
      const cat: Cat = CreateCatResponse;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(cat);
      jest.spyOn(catRepository, 'update').mockResolvedValueOnce(null);

      await service.update(id, updateCatDto);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(catRepository.update).toHaveBeenCalledWith(id, updateCatDto);
    });
  });

  describe('remove', () => {
    it('should remove a cat', async () => {
      const id = 4;
      const cat: Cat = CreateCatResponse;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(cat);
      jest.spyOn(favoriteRepository, 'delete').mockResolvedValueOnce(null);
      jest.spyOn(catRepository, 'remove').mockResolvedValueOnce(null);

      await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(favoriteRepository.delete).toHaveBeenCalledWith({ cat_id: id });
      expect(catRepository.remove).toHaveBeenCalledWith(cat);
    });
  });
});

