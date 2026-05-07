// src/lib/initProductIndex.js
const es = require('./elasticSearchClient');

async function initProductIndex() {
  const index = 'products';

  const exists = await es.indices.exists({ index });
  if (!exists) {
    await es.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { 
              type: 'text',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            slug: { type: 'keyword' },
            description: { type: 'text' },
            category_id: { type: 'integer' },
            brand_id: { type: 'integer' },
            min_price: { type: 'float' },
            max_price: { type: 'float' },
            average_rating: { type: 'float' },
            review_count: { type: 'integer' },
            status: { type: 'keyword' },
            images: { type: 'keyword' },
            createdAt: { type: 'date' }
          }
        }
      }
    });
  }
}

module.exports = initProductIndex;
