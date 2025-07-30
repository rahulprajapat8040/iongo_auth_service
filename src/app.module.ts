import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import Modules from './modules';
import { AuthMiddleWare } from './middlewares/auth.middleware';
import { excludeRoutes } from './utils/common/excludedRoutes';

@Module({
  imports: Modules,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).exclude(...excludeRoutes).forRoutes("*path")
  }
}
