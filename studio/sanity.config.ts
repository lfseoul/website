import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// 1. Group all existing settings so they apply to both workspaces
const sharedConfig = {
  projectId: '925755f8',
  plugins: [
    structureTool(), 
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
}

// 2. Export an array of workspaces instead of a single object
export default defineConfig([
  {
    name: 'production',
    title: 'LFS Website (Production)',
    dataset: 'production',
    basePath: '/production',
    ...sharedConfig,
  },
  {
    name: 'staging',
    title: 'LFS Website (Staging)',
    dataset: 'staging',
    basePath: '/staging',
    ...sharedConfig,
  }
])