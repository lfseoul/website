import {defineConfig, defineSingleton} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {crossDatasetDuplicator} from '@sanity/cross-dataset-duplicator' // 1. Import the plugin
import {schemaTypes} from './schemaTypes'

const siteSettingsSingleton = defineSingleton({
  id: 'siteSettings',
  documentId: 'siteSettings',
  schemaType: 'siteSettings',
})

const schoolFeaturesSettingsSingleton = defineSingleton({
  id: 'schoolFeaturesSettings',
  documentId: 'schoolFeaturesSettings',
  schemaType: 'schoolFeaturesSettings',
})

// 1. Group all existing settings so they apply to both workspaces
const sharedConfig = {
  projectId: '925755f8',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website Content')
          .items([
            S.documentTypeListItem('homePage').title('Home Page Content'),
            S.divider(),
            S.listItem()
              .title('News Feature')
              .child(
                S.list()
                  .title('News Feature')
                  .items([
                    S.listItem()
                      .title('News Feature Layout')
                      .child(
                        S.document()
                          .schemaType('schoolFeaturesSettings')
                          .documentId('schoolFeaturesSettings'),
                      ),
                    S.documentTypeListItem('schoolFeature').title('News Feature'),
                  ]),
              ),
            S.documentTypeListItem('newsArticle').title('News Article'),
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
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
  document: {
    singletons: [siteSettingsSingleton, schoolFeaturesSettingsSingleton],
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
  },
])
