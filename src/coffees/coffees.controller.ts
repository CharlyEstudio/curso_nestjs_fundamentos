import {
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param,
  Patch,
  Post,
  Query,
}                             from '@nestjs/common';
import { CoffeesService }     from './coffees.service';
import { CreateCoffeeDto }    from './dto/create-coffee.dto';
import { UpdateCoffeeDto }    from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST }            from "@nestjs/core";
import { Request }            from "express";

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('CoffeesController created');
    console.log(request.url);
    console.log(request.params);
    console.log(request.body);
    console.log(request.query);
    console.log(request.headers);
    console.log(request.method);
  }

  @Get('flavors')
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne('' + id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
