import { defineType, defineField } from 'sanity';

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string' }),
    defineField({ name: 'fr', title: 'French', type: 'string' }),
    defineField({ name: 'kr', title: 'Korean', type: 'string' }),
  ]
});
