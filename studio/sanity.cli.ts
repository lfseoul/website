import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '925755f8',
    dataset: 'production'
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'xuv8v7p44bzww6i0qz187yvt',
  },
})
