import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dto/user.create.dto';
import { UpdateUserDto } from '../dto/user.update.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';
import { NotFoundAppException } from 'src/common/exceptions';
import { UserRole } from 'src/common/types/user.types';
import { AppLogger } from 'src/common/utils/logger.util';
import { RegisterBody, RegisterResult } from '../../auth/mocks/auth.mocks';
import { MockPaginationParams } from 'src/common/mocks/common.mocks';
import { FetchManyUsers } from '../mocks/users.mocks';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let logger: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: {
            update: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn()
          },
        },
        {
          provide: AppLogger,
          useValue: {
            logInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>('UserRepository');
    logger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = RegisterBody;
      const user: User = RegisterResult;
      const expectedResult: User = RegisterResult;

      jest.spyOn(repository, 'create').mockReturnValueOnce(RegisterResult);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(expectedResult);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const params: IPaginationOptions = MockPaginationParams;
      const items: User[] = FetchManyUsers.items;
      const count: number = FetchManyUsers.count;
      const expectedResult: IPaginationResult<User> = { items, count };

      jest.spyOn(repository, 'find').mockResolvedValueOnce(items);
      jest.spyOn(repository, 'count').mockResolvedValueOnce(count);

      const result = await service.findAll(params);

      expect(repository.find).toHaveBeenCalledWith(params);
      expect(repository.count).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const id = 3;
      const user: User = RegisterResult;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundAppException if user does not exist', async () => {
      const id = 55;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundAppException);
    });
  });

  describe('findByParams', () => {
    it('should find a user by parameters', async () => {
      const params: Omit<Partial<UpdateUserDto>, 'roles'> = {first_name: "Oluwafikayo"};
      const user: User = RegisterResult;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findByParams(params);

      expect(repository.findOne).toHaveBeenCalledWith({ where: params });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 3;
      const updateUserDto: UpdateUserDto = {first_name: "Oluwafikayo"};

      await service.update(id, updateUserDto);

      expect(logger.logInfo).toHaveBeenCalledWith(updateUserDto);
      expect(repository.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 3;
      const user: User = RegisterResult;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(null);

      await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).toHaveBeenCalledWith(user);
    });
  });

  describe('makeAdmin', () => {
    it('should make a user admin', async () => {
      const id = 3;
      const user: User = RegisterResult;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(null);

      await service.makeAdmin(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, { roles: expect.arrayContaining([UserRole.ADMIN]) });
    });

    it('should not make a user admin if already admin', async () => {
      const id = 4;
      const user: User = FetchManyUsers.items[0];

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(null);

      await service.makeAdmin(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
