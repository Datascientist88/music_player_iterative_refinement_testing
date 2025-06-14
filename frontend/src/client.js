// frontend/src/client.js

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '54jcspdi', // Use the same Project ID from sanity.json
  dataset: 'production',
  apiVersion: '2025-06-14', // Use today's date
  useCdn: false, // `false` if you want to ensure fresh data
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);