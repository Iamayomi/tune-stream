import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  PORT: string;

  DATABASE_URL: string;

  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXP: string;

  ELASTICSEARCH_NODE: string;
  ELASTICSEARCH_USERNAME: string;
  ELASTICSEARCH_CLOUD: string;
  ELASTICSEARCH_PASSWORD: string;

  GOOGLE_AUTH_PASSWORD: string;
  GOOGLE_AUTH_USER: string;

  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_API_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
