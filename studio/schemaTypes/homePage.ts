import {defineType, defineField, defineArrayMember} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page Content',
  type: 'document',
  fields: [
    defineField({name: 'heroTitle', title: 'Hero Title', type: 'localizedString'}),
    defineField({name: 'heroDescription', title: 'Hero Description', type: 'localizedBlock'}),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'featureLayout',
      title: 'School Features Layout',
      type: 'string',
      hidden: true,
      readOnly: true,
      options: {
        list: [
          {title: 'Barrel', value: 'barrel'},
          {title: 'Helix', value: 'helix'},
        ],
        layout: 'radio',
      },
      initialValue: 'barrel',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'newsArticles',
      title: 'News & Events',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'newsArticle'}]})],
    }),

    defineField({
      name: 'sections',
      title: 'Scroll Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localizedString'}),
            defineField({name: 'text', title: 'Text', type: 'localizedBlock'}),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'backgroundVideo',
              title: 'Background Video (MP4)',
              type: 'file',
              description:
                'Upload a raw .mp4 video file. Completely bypasses YouTube and eliminates console errors.',
              options: {accept: 'video/mp4'},
            }),
            defineField({
              name: 'youtubeId',
              title: 'YouTube Video ID',
              type: 'string',
              description:
                'The 11-character ID from the YouTube URL (e.g., dQw4w9WgXcQ). If provided, this will override the static image.',
            }),
          ],
          preview: {
            select: {
              title: 'title.en',
              media: 'image',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle.en',
      subtitle: 'heroDescription.en.0.children.0.text',
      media: 'heroImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Home Page Content',
        subtitle: subtitle ? `English: ${subtitle}` : 'Localized homepage content',
        media,
      }
    },
  },
})
