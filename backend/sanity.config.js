// backend/sanity.config.js

import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
// 1. Import your track schema correctly
import track from './schemaTypes/track'

export default defineConfig({
  name: 'default',
  title: 'Music App',

  projectId: '54jcspdi', // <-- Paste your Project ID from sanity.json here
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    // 2. Add your track schema to this array
    types: [track], 
  },
})