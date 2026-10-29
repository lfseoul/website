import {TagIcon} from '@sanity/icons/Tag'
import {defineType, defineField} from 'sanity'

export const schoolFeature = defineType({
  name: 'schoolFeature',
  title: 'News Feature',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'object',
      fields: [
        defineField({name: 'en', title: 'English', type: 'text'}),
        defineField({name: 'fr', title: 'French', type: 'text'}),
        defineField({name: 'kr', title: 'Korean', type: 'text'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'badge',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cardType',
      title: 'Card Type',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Centered Text', value: 'centered'},
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'badge.en',
      media: 'image',
    },
  },
})
