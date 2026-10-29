import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineType, defineField} from 'sanity'

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'News Articles',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en', maxLength: 96},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true

          const client = context.getClient({apiVersion: '2026-02-01'})
          const documentId = context.document?._id?.replace(/^drafts\./, '')
          const idsToIgnore = documentId ? [documentId, `drafts.${documentId}`] : []
          const existingCount = await client.fetch<number>(
            'count(*[_type == "newsArticle" && slug.current == $slug && !(_id in $idsToIgnore)])',
            {slug: slug.current, idsToIgnore},
          )

          return existingCount === 0 || 'Slug already exists'
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Academic', value: 'academic'},
          {title: 'Admissions', value: 'admissions'},
          {title: 'Campus Life', value: 'campusLife'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localizedString',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
      media: 'mainImage',
    },
  },
})
