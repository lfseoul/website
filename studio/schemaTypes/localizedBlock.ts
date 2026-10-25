import { defineType, defineField } from 'sanity';

export const localizedBlock = defineType({
  name: 'localizedBlock',
  title: 'Localized Rich Text',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'fr', title: 'French', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'kr', title: 'Korean', type: 'array', of: [{ type: 'block' }] }),
  ]
});