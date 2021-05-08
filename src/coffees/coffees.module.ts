import { Injectable, Module, Scope } from '@nestjs/common';
import { CoffeesController }         from './coffees.controller';
import { CoffeesService }            from './coffees.service';
import { TypeOrmModule }             from "@nestjs/typeorm";
import { Coffee }                    from "./entities/coffee.entity";
import { Flavor }                    from "./entities/flavor.entity";
import { Event }                     from "../events/entities/event.entity";
import {
  COFFEE_BRANDS,
  COFFEE_BRANDS_DATA,
  COFFEE_BRANDS_FACTORY,
  COFFEE_BRANDS_FACTORY_DB
}                                    from './coffees.constants';
import { Connection }                from "typeorm";

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    /* ... do something ... */
    return COFFEE_BRANDS_DATA;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    { provide: COFFEE_BRANDS, useValue: COFFEE_BRANDS_DATA }, // Podemos inyectar datos duros como providers
    {
      provide: COFFEE_BRANDS_FACTORY,
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
      inject: [CoffeeBrandsFactory],
      scope: Scope.TRANSIENT, // Instanciado
    }, // Podemos inyectar datos duros como providers por factory
    {
      provide: COFFEE_BRANDS_FACTORY_DB,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve(COFFEE_BRANDS_DATA);
        // console.log('[!] Async factory');
        return coffeeBrands;
      },
      inject: [Connection],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
