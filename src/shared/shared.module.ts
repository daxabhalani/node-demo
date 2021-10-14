import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainSchema } from '../model/domain.model';
import { UserSchema } from '../model/user.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Domain', schema: DomainSchema },
    ]),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class SharedModule {}
