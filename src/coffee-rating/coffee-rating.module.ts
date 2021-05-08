import { Module }              from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule }       from "../coffees/coffees.module";
import { DatabaseModule }      from "../database/database.module";

@Module({
  imports: [
    /*DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      password: 'passsword',
      port: 5432,
    }),*/ // Modulo dinámico, con el ejemplo de una DB
    CoffeesModule,
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
