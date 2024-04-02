import { Module } from '@nestjs/common';
import { WsGatewayService } from './ws-gateway.service';
import { wsGatewayProviders } from './ws-gateway.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...wsGatewayProviders, WsGatewayService],
  exports: [WsGatewayService],
})
export class WsGatewayModule {}
