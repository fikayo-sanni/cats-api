import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from '../services/cats.service';
import { CreateCatDto } from '../dto/cat.create.dto';
import { UpdateCatDto } from '../dto/cat.update.dto';
import { Response } from 'express';
import { IAuthRequest } from 'src/common/types/auth.types';
import { UserRole } from 'src/common/types/user.types';
import { CreateCatRequest, CreateCatResponse, FetchManyCats, FetchManyCatsPaginationMeta, UpdateCatRequest } from '../mocks/cats.mocks';
import { MockPaginationParams } from 'src/common/mocks/common.mocks';
import { HttpResponse } from 'src/common/utils/http.util';

// Mock the entire pagination.util.ts module
jest.mock('src/common/utils/pagination.util', () => ({
  __esModule: true,
  generateMetaResponse: jest.fn().mockReturnValue({
    first: "http://localhost:5001/api/v1/cats?page=1",
    last: "http://localhost:5001/api/v1/cats?page=NaN",
    prev: "http://localhost:5001/api/v1/cats?page=NaN",
    next: "http://localhost:5001/api/v1/cats?page=NaN",
    currentPage: null,
    previousPage: null,
    lastPage: null,
    total: 2
  }),
  modifyUrlPageParam: jest.fn(),
}));


describe('CatsController', () => {
  let controller: CatsController;
  let catsService: CatsService;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<IAuthRequest>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService);
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

  it('should create a cat', async () => {
    const createCatDto: CreateCatDto = CreateCatRequest;
    const expectedResult = CreateCatResponse;

    jest.spyOn(catsService, 'create').mockResolvedValueOnce(expectedResult);

    await controller.create(createCatDto, mockResponse as Response, mockRequest as IAuthRequest);

    expect(catsService.create).toHaveBeenCalledWith(createCatDto, mockRequest.user.sub);
    expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should update a cat', async () => {
    const id = 4;
    const updateCatDto: UpdateCatDto = UpdateCatRequest;
    const expectedResult = null;

    jest.spyOn(catsService, 'update').mockResolvedValueOnce(expectedResult);

    await controller.update(id, updateCatDto, mockResponse as Response);

    expect(catsService.update).toHaveBeenCalledWith(id, updateCatDto);
    expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should delete a cat', async () => {
    const id = 4;
    const expectedResult = null;

    jest.spyOn(catsService, 'remove').mockResolvedValueOnce(expectedResult);

    await controller.delete(id, mockResponse as Response);

    expect(catsService.remove).toHaveBeenCalledWith(id);
    expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });

  it('should find all cats', async () => {
    const filterQuery = MockPaginationParams;
    const items = FetchManyCats.items;
    const count = FetchManyCats.count;
    const expectedResult = { data: items, meta: FetchManyCatsPaginationMeta };

    jest.spyOn(catsService, 'findAll').mockResolvedValueOnce({ items, count });
    jest.spyOn(controller, 'getHttpResponse').mockReturnValue({
      sendResponseBody: jest.fn().mockReturnThis(),
    } as unknown as HttpResponse);
    await controller.findAll(filterQuery, mockRequest as IAuthRequest, mockResponse as Response);

    expect(catsService.findAll).toHaveBeenCalledWith(filterQuery);
    expect(controller.getHttpResponse().sendResponseBody).toHaveBeenCalledWith(
      mockResponse as Response,
      expectedResult,
    );
  });

  it('should find one cat', async () => {
    const id = 2;
    const expectedResult = FetchManyCats.items.find((cat) => cat.id == id);

    jest.spyOn(catsService, 'findOne').mockResolvedValueOnce(expectedResult);

    await controller.findOne(id, mockResponse as Response);

    expect(catsService.findOne).toHaveBeenCalledWith(id);
    expect(controller.getHttpResponse().setDataWithKey).toHaveBeenCalledWith(
      'data',
      expectedResult,
    );
  });
});
