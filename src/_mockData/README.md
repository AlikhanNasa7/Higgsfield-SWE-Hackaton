# Mock Data Folder

This folder contains all the demo/mock data for the AI Content Chat Frontend.

## 🗂 Files

- `chats.ts` - Mock chat data (8 sample chats)
- `messages.ts` - Mock message data for each chat
- `contents.ts` - Mock content items (images/videos) for each chat
- `index.ts` - Exports all mock data

## 🚀 Backend Integration

When you're ready to integrate with a real backend:

### 1. Remove Mock Data

```bash
rm -rf src/_mockData/
```

### 2. Update API Configuration

In `src/lib/api.ts`, remove the mock data import:

```typescript
// Remove this line:
import { mockChats, mockMessages, mockContents } from '@/mockData'
```

### 3. Set Environment Variables

```env
NEXT_PUBLIC_USE_MOCK=0
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

### 4. Update TypeScript Paths

In `tsconfig.json`, remove the mock data path:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
      // Remove: "@/mockData": ["./src/_mockData"]
    }
  }
}
```

## 📊 Mock Data Overview

- **8 Sample Chats**: Various creative projects and use cases
- **Realistic Conversations**: Multi-turn conversations with different scenarios
- **Content Variety**: Mix of images and videos with proper metadata
- **Time Stamps**: Realistic creation and update timestamps
- **Rich Messages**: Assistant responses with buttons and content references

The mock data provides a comprehensive demo experience showcasing all the app's features.
