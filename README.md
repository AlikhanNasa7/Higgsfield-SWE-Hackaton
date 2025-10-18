# AI Content Chat Frontend

A production-ready **Next.js (App Router) + TypeScript** frontend for an AI chat that generates images and videos. Features a persistent sidebar with chat history and a three-panel layout for transcript, content viewer, and content list.

## 🚀 Features

- **Persistent Layout**: Leftmost chat list sidebar visible on all routes
- **Three-Panel Interface**: Resizable panels for transcript, content viewer, and content list
- **Multiple Generation Modes**: Text→Image, Text→Video, Image→Video
- **Real-time Chat**: Optimistic UI updates with error handling
- **Content Management**: View, filter, and search generated content
- **Accessibility**: Full keyboard navigation and ARIA support
- **Responsive Design**: Works on desktop and mobile devices
- **Mock Mode**: Built-in mock data for development

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router), React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: react-hook-form + zod validation
- **UI Components**: Custom components with Lucide icons
- **Resizable Panels**: react-resizable-panels
- **File Upload**: react-dropzone
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🏗 Installation

1. **Clone and install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   # For mock mode (development)
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_USE_MOCK=1

   # For real backend
   # NEXT_PUBLIC_USE_MOCK=0
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable                   | Description                               | Default                 |
| -------------------------- | ----------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL                      | `http://localhost:3001` |
| `NEXT_PUBLIC_USE_MOCK`     | Use mock data (`1`) or real backend (`0`) | `1`                     |

### Mock vs Real Backend

The app includes a comprehensive mock mode for development:

- **Mock Mode** (`NEXT_PUBLIC_USE_MOCK=1`): Uses in-memory data with simulated delays
- **Real Backend** (`NEXT_PUBLIC_USE_MOCK=0`): Connects to your backend API

## 🏛 Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── chat/[id]/         # Dynamic chat page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── chat/             # Chat-related components
│   ├── content/          # Content display components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── api.ts            # API client with mock support
│   └── store.ts          # Zustand store
└── types/                # TypeScript definitions
    ├── api.ts            # API types
    └── schemas.ts        # Zod schemas
```

### Key Components

- **`LayoutShell`**: Persistent layout with sidebar
- **`SidebarChats`**: Chat list with CRUD operations
- **`ThreePanelLayout`**: Resizable three-panel layout
- **`ChatTranscript`**: Message list with composer
- **`MessageBubble`**: Individual message rendering
- **`Composer`**: Mode selector and input form
- **`ContentViewer`**: Image/video display
- **`ContentList`**: Content thumbnails with filtering

### State Management

Uses Zustand for client-side state:

```typescript
interface UIState {
  selectedChatId: string | null
  selectedContentId: string | null
  sidebarOpen: boolean
  filters: 'all' | 'images' | 'videos'
  searchQuery: string
  panelSizes: { transcript: number; viewer: number; contents: number }
  currentMode: Mode
  uploadProgress: number | null
}
```

## 🔌 API Integration

### Data Contracts

The frontend expects these API endpoints:

```typescript
// Chat management
GET    /chats                    → Chat[]
POST   /chats                    → { chat: Chat }
PATCH  /chats/:id                → { chat: Chat }
DELETE /chats/:id                → { ok: boolean }

// Messages
GET    /chats/:id/messages       → Message[]
POST   /chats/:id/send           → SendResponse

// Content
GET    /chats/:id/contents       → ContentItem[]
GET    /contents/:contentId      → ContentItem
```

### Type Definitions

```typescript
type Message = {
  id: string
  role: 'user' | 'assistant'
  createdAt: string
  parts: Part[]
  producedContentIds?: string[]
}

type Part =
  | { type: 'text'; text: string }
  | { type: 'Button'; label: string; targetContentId: string }

type ContentItem = {
  id: string
  kind: 'image' | 'video'
  title?: string
  url: string
  thumbUrl?: string
  createdAt: string
}
```

### Backend Adapter

If your backend differs from these contracts, create an adapter in `lib/api.ts`:

```typescript
// Example adapter for different API structure
function adaptBackendResponse(data: BackendMessage): Message {
  return {
    id: data.id,
    role: data.role,
    createdAt: data.timestamp,
    parts: data.content.map(adaptPart),
    producedContentIds: data.generatedContent?.map(c => c.id),
  }
}
```

## 🎨 Customization

### Adding New Modes

1. **Update types** in `types/schemas.ts`:

   ```typescript
   export const ModeSchema = z.enum([
     'text-to-image',
     'text-to-video',
     'image-to-video',
     'text-to-audio', // New mode
   ])
   ```

2. **Add to composer** in `components/chat/Composer.tsx`:

   ```typescript
   const MODES = [
     // ... existing modes
     { value: 'text-to-audio', label: 'Text → Audio', icon: <Volume2 /> }
   ]
   ```

3. **Handle in API** in `lib/api.ts`:
   ```typescript
   // Add case in sendMessage function
   } else if (payload.mode === 'text-to-audio') {
     // Handle audio generation
   }
   ```

### Adding New Part Types

1. **Update Part schema**:

   ```typescript
   export const PartSchema = z.discriminatedUnion('type', [
     // ... existing parts
     z.object({
       type: z.literal('Link'),
       url: z.string(),
       label: z.string(),
     }),
   ])
   ```

2. **Add renderer** in `MessageBubble.tsx`:
   ```typescript
   if (part.type === 'Link') {
     return <a href={part.url} className="...">{part.label}</a>
   }
   ```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Code Quality

- **TypeScript**: Strict mode enabled with additional safety checks
- **ESLint**: Extended Next.js config with TypeScript rules
- **Prettier**: Consistent code formatting
- **Zod**: Runtime type validation for API responses

### Testing the App

1. **Start in mock mode**:

   ```bash
   NEXT_PUBLIC_USE_MOCK=1 npm run dev
   ```

2. **Test features**:
   - Create new chats
   - Send messages in different modes
   - Upload images for image-to-video
   - Click buttons to view content
   - Resize panels
   - Filter and search content

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Setup

Set these environment variables in production:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_USE_MOCK=0
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Q: App won't start**

- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies
- Check that port 3000 is available

**Q: Mock data not working**

- Verify `NEXT_PUBLIC_USE_MOCK=1` in `.env.local`
- Check browser console for errors

**Q: Backend connection fails**

- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Ensure backend is running and accessible
- Check CORS settings on backend

**Q: TypeScript errors**

- Run `npm run lint` to see detailed errors
- Ensure all imports are correct
- Check that types match API contracts

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the API contracts in `types/api.ts`
- Test with mock mode first to isolate frontend issues

---

Built with ❤️ using Next.js, TypeScript, and modern React patterns.
