import { defineType, defineField } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page Content',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'localizedString' }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'localizedBlock' }),
    defineField({ name: 'scroll1Title', title: 'Scroll Section 1 Title', type: 'localizedString' }),
    defineField({ name: 'scroll1Text', title: 'Scroll Section 1 Text', type: 'localizedBlock' }),
    defineField({ name: 'scroll2Title', title: 'Scroll Section 2 Title', type: 'localizedString' }),
    defineField({ name: 'scroll2Text', title: 'Scroll Section 2 Text', type: 'localizedBlock' }),
    defineField({ 
        name: 'heroImage', 
        title: 'Hero Background Image', 
        type: 'image', 
        options: { hotspot: true } 
    }),
    defineField({ 
        name: 'scroll1Image', 
        title: 'Scroll Section 1 Background', 
        type: 'image', 
        options: { hotspot: true } 
    }),
    defineField({ 
        name: 'scroll2Image', 
        title: 'Scroll Section 2 Background', 
        type: 'image', 
        options: { hotspot: true } 
    }),
  ]
});