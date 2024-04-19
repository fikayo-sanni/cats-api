import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { ParseIntPipe } from '../../../../../common/pipes/parse-int.pipe';
import { CatsService } from '../services/cats.service';
import { CreateCatDto } from '../dto/create-cat.dto';
import { Cat } from '../interfaces/cat.interface';
import { BaseAppController } from 'src/http/api/base/base.controller';

@UseGuards(RolesGuard)
@Controller('api/v1/cats')
export class CatsController extends BaseAppController {
  constructor(private readonly catsService: CatsService) {
    super();
  }

  @Post()
  @Roles(['admin'])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe())
    id: number,
  ) {
    // get by ID logic
  }
}
