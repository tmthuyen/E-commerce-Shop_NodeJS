// src/services/productSearchService.js
const es = require('../lib/elasticSearchClient');
const ProductModel = require('../app/models/ProductModel');
const ProductVariant = require('../app/models/ProductVariant');

/**
 * Index một product vào Elasticsearch
 */
async function indexProduct(product) {
  try {
    // Lấy variants để có giá chính xác
    const variants = await ProductVariant.find({ 
      product_id: product._id,
      status: 'ACTIVE',
      deleted: false 
    }).lean();
    
    const prices = variants.map(v => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : product.min_price || 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : product.max_price || 0;

    await es.index({
      index: 'products',
      id: String(product._id),
      document: {
        id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        category_id: product.category_id,
        brand_id: product.brand_id,
        min_price: minPrice,
        max_price: maxPrice,
        average_rating: product.average_rating || 0,
        review_count: product.review_count || 0,
        status: product.status,
        images: product.images?.map(img => img.img_url) || [],
        createdAt: product.createdAt,
      },
    });
    console.log(`✅ Indexed product ${product._id} to Elasticsearch`);
  } catch (error) {
    console.error(`❌ Error indexing product ${product._id}:`, error.message);
    throw error;
  }
}

/**
 * Xóa product khỏi Elasticsearch
 */
async function removeProduct(productId) {
  try {
    await es.delete({
      index: 'products',
      id: String(productId),
    });
    console.log(`✅ Removed product ${productId} from Elasticsearch`);
  } catch (error) {
    // Ignore nếu không tìm thấy
    if (error.statusCode !== 404) {
      console.error(`❌ Error removing product ${productId}:`, error.message);
    }
  }
}

/**
 * Update product trong Elasticsearch
 */
async function updateProduct(product) {
  try {
    await indexProduct(product);
  } catch (error) {
    console.error(`❌ Error updating product ${product._id}:`, error.message);
    throw error;
  }
}

/**
 * Search products với Elasticsearch
 */
async function searchProducts(query, options = {}) {
  const {
    page = 1,
    limit = 12,
    category_id,
    brand_id,
    min_price,
    max_price,
    min_rating,
    sort = 'relevance',
  } = options;

  const from = (page - 1) * limit;
  const size = limit;

  try {
    // Build query
    const mustQueries = [];
    const shouldQueries = [];
    const filterQueries = [];

    // Text search
    if (query && query.trim()) {
      shouldQueries.push({
        multi_match: {
          query: query.trim(),
          fields: ['name^3', 'description^2', 'slug'],
          fuzziness: 'AUTO',
          operator: 'or',
        },
      });
      
      // Exact match boost
      shouldQueries.push({
        match_phrase: {
          name: {
            query: query.trim(),
            boost: 5,
          },
        },
      });
    }

    // Filters
    if (category_id) {
      filterQueries.push({ term: { category_id: parseInt(category_id) } });
    }

    if (brand_id) {
      filterQueries.push({ term: { brand_id: parseInt(brand_id) } });
    }

    if (min_price !== undefined || max_price !== undefined) {
      const rangeQuery = { range: { min_price: {} } };
      if (min_price !== undefined) rangeQuery.range.min_price.gte = min_price;
      if (max_price !== undefined) rangeQuery.range.min_price.lte = max_price;
      filterQueries.push(rangeQuery);
    }

    if (min_rating !== undefined) {
      filterQueries.push({ range: { average_rating: { gte: min_rating } } });
    }

    // Status filter
    filterQueries.push({ term: { status: 'ACTIVE' } });

    // Build final query
    const esQuery = {
      bool: {
        must: mustQueries.length > 0 ? mustQueries : [{ match_all: {} }],
        should: shouldQueries,
        filter: filterQueries,
        minimum_should_match: query ? 1 : 0,
      },
    };

    // Sort
    let sortOptions = [];
    switch (sort) {
      case 'price_asc':
        sortOptions = [{ min_price: { order: 'asc' } }];
        break;
      case 'price_desc':
        sortOptions = [{ min_price: { order: 'desc' } }];
        break;
      case 'rating_desc':
        sortOptions = [{ average_rating: { order: 'desc' } }, { review_count: { order: 'desc' } }];
        break;
      case 'name_asc':
        sortOptions = [{ 'name.keyword': { order: 'asc' } }];
        break;
      case 'name_desc':
        sortOptions = [{ 'name.keyword': { order: 'desc' } }];
        break;
      case 'created_desc':
        sortOptions = [{ createdAt: { order: 'desc' } }];
        break;
      default:
        // Relevance (default)
        if (query) {
          sortOptions = [{ _score: { order: 'desc' } }];
        } else {
          sortOptions = [{ createdAt: { order: 'desc' } }];
        }
    }

    const result = await es.search({
      index: 'products',
      from,
      size,
      query: esQuery,
      sort: sortOptions,
    });

    // Map results
    const products = result.hits.hits.map((hit) => ({
      _id: hit._source.id,
      ...hit._source,
      _score: hit._score,
    }));

    return {
      products,
      total: result.hits.total.value,
      page,
      limit,
      totalPages: Math.ceil(result.hits.total.value / limit),
    };
  } catch (error) {
    console.error('❌ Elasticsearch search error:', error);
    throw error;
  }
}

/**
 * Autocomplete suggestions
 */
async function autocomplete(query, limit = 10) {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const result = await es.search({
      index: 'products',
      size: limit,
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query.trim(),
                fields: ['name^3', 'description'],
                type: 'bool_prefix',
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: [{ term: { status: 'ACTIVE' } }],
        },
      },
      _source: ['id', 'name', 'slug', 'min_price', 'images'],
    });

    return result.hits.hits.map((hit) => ({
      _id: hit._source.id,
      name: hit._source.name,
      slug: hit._source.slug,
      price: hit._source.min_price,
      image: hit._source.images?.[0] || null,
    }));
  } catch (error) {
    console.error('❌ Autocomplete error:', error);
    return [];
  }
}

/**
 * Re-index tất cả products (dùng khi khởi động hoặc migration)
 */
async function reindexAllProducts() {
  try {
    console.log('🔄 Starting full product reindex...');
    const products = await ProductModel.find({ 
      deleted: false,
      status: 'ACTIVE' 
    }).lean();

    let indexed = 0;
    for (const product of products) {
      try {
        await indexProduct(product);
        indexed++;
      } catch (error) {
        console.error(`Failed to index product ${product._id}:`, error.message);
      }
    }

    console.log(`✅ Reindexed ${indexed}/${products.length} products`);
    return { indexed, total: products.length };
  } catch (error) {
    console.error('❌ Reindex error:', error);
    throw error;
  }
}

module.exports = {
  indexProduct,
  removeProduct,
  updateProduct,
  searchProducts,
  autocomplete,
  reindexAllProducts,
};
