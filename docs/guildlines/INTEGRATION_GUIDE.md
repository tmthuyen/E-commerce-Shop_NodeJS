# Hướng Dẫn Tích Hợp AI, Elasticsearch và CI/CD

## 📋 Tổng Quan

Tài liệu này hướng dẫn cách tích hợp và sử dụng các tính năng đã được implement:
- ✅ **Elasticsearch** - Advanced search với fuzzy search, autocomplete
- ✅ **AI Integration** - Chatbot và AI-powered recommendations
- ✅ **CI/CD Pipeline** - GitHub Actions automation

---

## 🔍 1. Elasticsearch Integration

### Setup

1. **Đảm bảo Elasticsearch đang chạy**:
   ```bash
   # Với Docker Compose
   docker-compose up -d elasticsearch
   
   # Hoặc chạy standalone
   docker run -d -p 9200:9200 -e "discovery.type=single-node" \
     -e "xpack.security.enabled=false" \
     -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
     docker.elastic.co/elasticsearch/elasticsearch:8.15.0
   ```

2. **Kiểm tra Elasticsearch**:
   ```bash
   curl http://localhost:9200
   ```

3. **Environment Variables** (`.env`):
   ```env
   ELASTIC_URL=http://localhost:9200
   ```

### API Endpoints

#### 1. Search Products
```http
GET /api/products/search?q=laptop&page=1&limit=12&sort=relevance
GET /api/products/search?q=ram&category_id=1&min_price=1000000&max_price=5000000&min_rating=4
```

**Query Parameters**:
- `q` - Search keyword
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category_id` - Filter by category
- `brand_id` - Filter by brand
- `min_price`, `max_price` - Price range
- `min_rating` - Minimum rating
- `sort` - `relevance`, `price_asc`, `price_desc`, `rating_desc`, `name_asc`, `name_desc`, `created_desc`

#### 2. Autocomplete
```http
GET /api/products/autocomplete?q=lap&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": 1,
      "name": "Laptop Dell XPS 15",
      "slug": "laptop-dell-xps-15",
      "price": 25000000,
      "image": "https://..."
    }
  ]
}
```

### Auto-Indexing

Products sẽ tự động được index vào Elasticsearch khi:
- ✅ Tạo mới product (`POST /api/products`)
- ✅ Cập nhật product (`PUT /api/products/:id`)
- ✅ Thay đổi status (`PATCH /api/products/:id/change-status`)
- ✅ Xóa product (`DELETE /api/products/:id/soft`)
- ✅ Khôi phục product (`POST /api/products/:id/restore`)

### Manual Re-indexing

Nếu cần re-index tất cả products:
```javascript
// Trong BE/src/app.js, uncomment:
const productSearchService = require('./services/productSearchService');
productSearchService.reindexAllProducts().catch(console.error);
```

---

## 🤖 2. AI Integration

### Setup

1. **Cài đặt OpenAI API Key** (hoặc AI service khác):
   ```env
   OPENAI_API_KEY=sk-...
   AI_API_URL=https://api.openai.com/v1
   AI_MODEL=gpt-3.5-turbo
   ```

   **Lưu ý**: Nếu không có API key, AI service vẫn hoạt động nhưng sẽ trả về fallback responses.

2. **Alternative**: Có thể dùng Google Gemini, local model, hoặc tắt AI:
   ```env
   # Tắt AI
   OPENAI_API_KEY=
   ```

### API Endpoints

#### 1. AI Chatbot
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "Tôi cần mua laptop cho học tập, giá khoảng 15 triệu",
  "context": {}
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "Dựa trên nhu cầu của bạn, tôi đề xuất...",
    "usage": {
      "prompt_tokens": 50,
      "completion_tokens": 100
    }
  }
}
```

#### 2. AI Recommendations
```http
GET /api/ai/recommendations?preferences=gaming laptop
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": 1,
      "name": "Laptop Gaming ASUS ROG",
      ...
    }
  ],
  "meta": {
    "aiEnabled": true,
    "suggestions": [...]
  }
}
```

#### 3. Generate Product Description
```http
POST /api/ai/generate-description
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "specifications": {
    "CPU": "Intel Core i7",
    "RAM": "16GB",
    "Storage": "512GB SSD"
  }
}
```

### Frontend Integration Example

```javascript
// Chatbot component
import { api } from '../api/axios';

const sendMessage = async (message) => {
  const response = await api.post('/api/ai/chat', { message });
  return response.data.data.response;
};

// Recommendations
const getRecommendations = async () => {
  const response = await api.get('/api/ai/recommendations', {
    params: { preferences: 'gaming' }
  });
  return response.data.data;
};
```

---

## 🚀 3. CI/CD Pipeline

### GitHub Actions Setup

1. **File đã được tạo**: `.github/workflows/ci-cd.yml`

2. **Workflow sẽ chạy khi**:
   - Push to `main` hoặc `develop`
   - Pull request to `main` hoặc `develop`

3. **Jobs bao gồm**:
   - ✅ Backend tests & build
   - ✅ Frontend tests & build
   - ✅ Docker Compose validation
   - ✅ Security scan (npm audit)
   - ✅ Deploy (chỉ trên main branch)

### Manual Trigger

```bash
# Push code để trigger
git push origin main

# Hoặc tạo PR
git checkout -b feature/new-feature
git push origin feature/new-feature
```

### Secrets (nếu cần)

Trong GitHub repo → Settings → Secrets:
- `REACT_APP_BACKEND_URL` - Frontend build URL
- `DEPLOY_SSH_KEY` - SSH key để deploy (nếu có)
- `DEPLOY_HOST` - Server host (nếu có)

### Local Testing

```bash
# Test backend
cd BE
npm test

# Test frontend
cd fe
npm test

# Test Docker Compose
docker-compose -f docker-compose.dev.yml config
```

---

## 📝 4. Environment Variables

Tạo file `.env` trong root:

```env
# Database
MONGO_URI=mongodb://localhost:27017/e_commerce_final_dev
MONGO_HOST=mongo
MONGO_PORT=27017

# Elasticsearch
ELASTIC_URL=http://localhost:9200

# AI Service
OPENAI_API_KEY=sk-...  # Optional
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=8000
NODE_ENV=development
```

---

## 🧪 5. Testing

### Test Elasticsearch

```bash
# Test search
curl "http://localhost:8000/api/products/search?q=laptop"

# Test autocomplete
curl "http://localhost:8000/api/products/autocomplete?q=lap"
```

### Test AI

```bash
# Test chatbot
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Xin chào"}'

# Test recommendations (cần auth token)
curl "http://localhost:8000/api/ai/recommendations?preferences=gaming" \
  -H "Authorization: Bearer <token>"
```

### Test CI/CD

```bash
# Push code để trigger
git add .
git commit -m "test: CI/CD pipeline"
git push origin main
```

---

## 🐛 Troubleshooting

### Elasticsearch không kết nối được

1. Kiểm tra Elasticsearch đang chạy:
   ```bash
   curl http://localhost:9200
   ```

2. Kiểm tra environment variable:
   ```bash
   echo $ELASTIC_URL
   ```

3. Xem logs:
   ```bash
   docker logs elasticsearch
   ```

### AI Service không hoạt động

1. Kiểm tra API key:
   ```bash
   echo $OPENAI_API_KEY
   ```

2. Nếu không có API key, service sẽ trả về fallback responses (không lỗi)

3. Xem logs trong console để debug

### CI/CD Pipeline fails

1. Xem GitHub Actions logs
2. Kiểm tra:
   - Node version compatibility
   - Dependencies có install được không
   - Tests có pass không
   - Docker build có thành công không

---

## 📚 Tài Liệu Tham Khảo

- [Elasticsearch Node.js Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## ✅ Checklist

- [ ] Elasticsearch đang chạy
- [ ] Environment variables đã set
- [ ] Test search endpoint
- [ ] Test autocomplete endpoint
- [ ] Test AI chatbot (nếu có API key)
- [ ] Test AI recommendations
- [ ] CI/CD pipeline chạy thành công
- [ ] Docker images build thành công

---

**Chúc bạn thành công!** 🎉

