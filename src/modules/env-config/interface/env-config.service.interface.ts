import {
  IAvatarConfig,
  IDatabaseConfig,
  IJwtConfig,
} from 'src/common/types/base.type';

export interface IEnvConfigService {
  getDatabaseConfig(): IDatabaseConfig;
  getJwtConfig(): IJwtConfig;
  getAvatarConfig(): IAvatarConfig;
}
