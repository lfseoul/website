import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import { crossDatasetDuplicator } from '@sanity/cross-dataset-duplicator' // 1. Import the plugin
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
    // 2. Add the plugin to your shared plugins array
    crossDatasetDuplicator({
      // Optional: Add the names of your schema types here if you want to restrict 
      // which documents can be duplicated (e.g., types: ['page', 'article']). 
      // Leaving it empty or omitting `types` makes it available for all document types.
      types: [], 
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