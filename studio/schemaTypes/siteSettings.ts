import {defineType, defineField, defineArrayMember} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'localizedBlock',
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'quickLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localizedString'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'localizedString'}),
        defineField({name: 'phoneNumber', title: 'Phone Number', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'email'}),
        defineField({name: 'website', title: 'Website', type: 'url'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      subtitle: 'contactInfo.email',
    },
  },
})
