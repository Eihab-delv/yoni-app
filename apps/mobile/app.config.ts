import type { ExpoConfig, ConfigContext } from 'expo/config';
import { readFileSync } from 'fs';
import { join } from 'path';

// Function to read version from version.txt
function getVersionFromFile(): string {
  try {
    const versionPath = join(__dirname, 'version.txt');
    const version = readFileSync(versionPath, 'utf8').trim();
    return version;
  } catch (error) {
    console.warn('Could not read version.txt, falling back to default version');
    return '0.0.1';
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const PROD = 'prod'
  const DEV = 'dev'
  const env = process.env.ENVIRONMENT ?? DEV
  const ext = env === PROD ? '' : `.${env}`
  let name = `yoni (${ext.slice(1).toUpperCase()})`
  const version = getVersionFromFile()

  return {
    ...config,
    name,
    version,
    "runtimeVersion": "runtime-1",
    slug: "yoni-app",
    ios: {
      ...config.ios,
      bundleIdentifier: `com.delv.yoni${ext}`,
     // googleServicesFile: `./google-services/GoogleService-Info${ext}.plist`,
      entitlements: config.ios ? {
        ...config.ios.entitlements,
      } : {}
    },
    android: {
      ...config.android,
      //googleServicesFile: `./google-services/google-services${ext}.json`,
      package: `com.delv.yoni${ext}`,
    },
  }
};
