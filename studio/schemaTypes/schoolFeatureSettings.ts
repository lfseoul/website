import {defineType, defineField} from 'sanity'

export const schoolFeatureSettings = defineType({
  name: 'schoolFeaturesSettings',
  title: 'News Feature Layout',
  type: 'document',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
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
  ],
  preview: {
    prepare() {
      return {title: 'News Feature Layout'}
    },
  },
})
