import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import coffeesConfig from './config/coffees.config';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CoffeeMongoDB } from './entities/coffee.mongo';

// Esto hay implementarlo a nivel global
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

const createMockModel = <T = any>(): MockModel<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  let coffeeModel: MockModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        { provide: COFFEE_BRANDS, useValue: {} },
        { provide: coffeesConfig.KEY, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getModelToken(CoffeeMongoDB.name),
          useValue: createMockModel(),
        },
      ],
    }).compile();

    service = await module.resolve<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
    coffeeModel = module.get<MockModel>(getModelToken(CoffeeMongoDB.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException', async () => {
        const coffeeId = '1';

        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      }, 30000);
    });
  });

  describe('findOne Mongo', () => {
    it('should return the coffee object', async () => {
      const coffeeId = '1';
      const expectedCoffee = {};

      coffeeModel.findOne.mockReturnValue(expectedCoffee);
      const coffee = await service.findOneMongo(coffeeId);
      expect(coffee).toEqual(expectedCoffee);
    });
  });
});
