import { cleanEnv, str } from 'envalid';

// Expo replaces `process.env.*` by the value coming from /app/expo/.env if explicitely mentioned
const env = cleanEnv(
  {
    // GENERAL CONFIG
    ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
    VERBOSE: process.env.EXPO_PUBLIC_VERBOSE,
    // BACKEND CONFIG
    BACKEND_BASEURL: process.env.EXPO_PUBLIC_BACKEND_BASEURL,
    REALM: process.env.EXPO_PUBLIC_REALM,
    UNSAFE_CLIENT_ID: process.env.EXPO_PUBLIC_UNSAFE_CLIENT_ID,
    UNSAFE_CLIENT_SECRET: process.env.EXPO_PUBLIC_UNSAFE_CLIENT_SECRET,
    UNSAFE_TEMPLATE_ID: process.env.EXPO_PUBLIC_UNSAFE_TEMPLATE_ID,
  },
  {
    // Generic config params
    ENVIRONMENT: str({
      default: 'production',
      choices: ['production', 'staging', 'development'],
    }),
    VERBOSE: str({
      choices: ['info', 'debug', 'log', 'warn', 'error', 'none'],
      default: 'warn',
      devDefault: 'info',
    }),
    BACKEND_BASEURL: str({ default: undefined }),
    REALM: str({ default: 'vanuatupass-dev' }),
    UNSAFE_CLIENT_ID: str({ default: '' }),
    UNSAFE_CLIENT_SECRET: str({ default: '' }),
    UNSAFE_TEMPLATE_ID: str({ default: '' }),
  },
);

// Export ENV variables
export const {
  ENVIRONMENT,
  VERBOSE,
  BACKEND_BASEURL,
  REALM,
  UNSAFE_CLIENT_ID,
  UNSAFE_CLIENT_SECRET,
  UNSAFE_TEMPLATE_ID,
} = env;

// Compute some ENV variables
export const NODE_ENV = process.env.NODE_ENV || env.ENVIRONMENT;
