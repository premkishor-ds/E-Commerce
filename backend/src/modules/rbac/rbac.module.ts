import { Module, Global } from '@nestjs/common';
import { SchemasModule } from '../../schemas/schemas.module';
import { RbacService } from './rbac.service';

@Global()
@Module({
  imports: [SchemasModule],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
