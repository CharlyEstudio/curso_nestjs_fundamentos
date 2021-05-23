import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  // SetMetadata,
  // UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { Protocol } from '../common/decorators/protocol.decorator';

// @UsePipes(ValidationPipe)
// @UsePipes(new ValidationPipe()) // Podemos específicar validaciones únicas
@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    // console.log('CoffeesController created');
    /*console.log(request.url);
    console.log(request.params);
    console.log(request.body);
    console.log(request.query);
    console.log(request.headers);
    console.log(request.method);*/
  }

  // @UsePipes(ValidationPipe) // Podemos validar por método
  @Public() // Decorador genérico para hacer public este path, a pesar que se pida API KEY en todo el aplicativo
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Para probar el timeout
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  // Manejar los tipos de dato de un param => ParseIntPipe,
  // pero como ya manejamos uno global, este ya no funciona
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coffeesService.findOne('' + id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  // update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) { // Podemos validar el cuerpo
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
