import {defineType, defineField} from 'sanity'

export const schoolFeaturesSettings = defineType({
  name: 'schoolFeaturesSettings',
  title: 'School Features Layout',
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
      return {title: 'School Features Layout'}
    },
  },
})
