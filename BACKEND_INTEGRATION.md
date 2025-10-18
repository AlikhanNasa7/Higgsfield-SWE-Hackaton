# Backend Integration Guide

## 🎯 Quick Switch: Mock → Real Backend

**Time to switch: < 2 minutes** ⚡

This guide explains how our AI Content Chat Frontend seamlessly switches between mock data and a real backend API. The architecture is designed for maximum hackathon speed while maintaining production-quality code standards.

### The 2-Minute Backend Integration

When your backend is ready, integration is as simple as changing one environment variable. No code changes, no refactoring, no complex migration scripts - just flip a switch and you're live.

### Step 1: Update Environment Variable

Locate your `.env.local` file in the project root (create it if it doesn't exist):

```bash
# Change in .env.local
NEXT_PUBLIC_USE_MOCK=0  # Was: 1 (switch to real backend)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

**Important Notes:**

- The `NEXT_PUBLIC_` prefix is required for Next.js environment variables to work in the browser
- Make sure your backend URL includes the protocol (`https://` or `http://`)
- Don't include a trailing slash in the URL
- For local backend testing, use `http://localhost:YOUR_PORT`

**Example Configurations:**

```bash
# Production Backend
NEXT_PUBLIC_USE_MOCK=0
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com

# Staging Backend
NEXT_PUBLIC_USE_MOCK=0
NEXT_PUBLIC_API_BASE_URL=https://staging-api.yourapp.com

# Local Backend Development
NEXT_PUBLIC_USE_MOCK=0
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Mock Mode (default for development)
NEXT_PUBLIC_USE_MOCK=1
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Step 2: Restart Dev Server

After changing environment variables, you must restart the Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

The server will pick up the new environment variables and the data service layer will automatically route all requests to your real backend API instead of using mock data.

### Step 3: Verify the Switch

Open your browser console and look for the data mode indicator:

```
🔧 Data Mode: REAL API
```

You can also verify by checking network requests in the browser DevTools - you should see actual HTTP requests being made to your backend URL.

**That's it!** 🎉 The app now uses your real backend.

### Instant Rollback

If your backend encounters issues during a demo or presentation, you can instantly switch back to mock mode:

```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK=1

# Restart server
npm run dev
```

Your demo continues without interruption, using reliable mock data.

---

## 🏗 Architecture Overview

### Facade Pattern Implementation

Our architecture implements the **Facade Design Pattern** combined with **Dependency Injection** principles. This creates a clean abstraction layer between your UI components and data sources, making the entire system flexible and maintainable.

#### The Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Components                            │
│  (SidebarChats, ChatTranscript, ContentViewer, ContentList)     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Uses
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Custom React Hooks                          │
│     (useChats, useMessages, useContents, useSendMessage)        │
│              Powered by TanStack Query                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Calls
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Service Layer                            │
│        (chatsService, messagesService, contentsService)         │
│                    ⚡ THE MAGIC LAYER ⚡                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Routes based on USE_MOCK
                          ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
┌──────────────────┐            ┌─────────────────────┐
│   Mock Data      │            │    Real API         │
│  (Development)   │            │   (Production)      │
│                  │            │                     │
│ - mockChats      │            │ - GET /chats        │
│ - mockMessages   │            │ - POST /chats       │
│ - mockContents   │            │ - GET /messages     │
│                  │            │ - POST /send        │
└──────────────────┘            └─────────────────────┘
```

#### Why This Architecture?

**Problem:** Traditional approaches require rewriting components when switching from mock to real data.

**Our Solution:** Components never know where data comes from. They only know "I need chats" - the service layer handles the rest.

**Benefits:**

- **Zero coupling** between UI and data source
- **Instant switching** via environment variable
- **Easy testing** - swap implementations without touching components
- **Parallel development** - frontend and backend teams work independently
- **Production-ready** - no "prototype code" to refactor later

### Key Files and Their Roles

#### 1. **`src/lib/dataService.ts`** - The Facade (Core of the System)

This is where all the magic happens. It's a facade that presents a simple interface to the rest of the app while hiding the complexity of switching between mock and real data.

**Key Features:**

- Checks `NEXT_PUBLIC_USE_MOCK` environment variable
- Routes requests to either mock data or real API
- Maintains consistent interface regardless of data source
- Handles data transformations if needed
- Simulates network delays in mock mode for realistic UX

**Example Service:**

```typescript
export const chatsService = {
  async getAll(): Promise<Chat[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300)) // Realistic delay
      return [...mockChats] // Return copy to prevent mutations
    }
    return api.getChats() // Call real API
  },
}
```

#### 2. **`src/lib/hooks/useChats.ts`** - React Hooks Layer

Custom hooks that provide a clean React interface to the data service layer. Built on TanStack Query for:

- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states
- Request deduplication

**Example Hook:**

```typescript
export function useChats() {
  return useQuery({
    queryKey: ['chats'], // Cache key
    queryFn: () => chatsService.getAll(), // Fetcher function
  })
}
```

**Why Hooks?**

- Components get loading/error states automatically
- Data is cached and shared across components
- Mutations trigger automatic refetches
- Standard React patterns - easy to understand

#### 3. **`src/lib/api.ts`** - Real API Client

Handles actual HTTP requests to your backend. Features:

- Centralized fetch wrapper
- Error handling
- Response validation with Zod schemas
- TypeScript type safety
- Easy to add authentication, headers, etc.

**Example:**

```typescript
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
```

#### 4. **`src/_mockData/`** - Mock Data Storage

Organized mock data that mimics your backend structure:

- **`chats.ts`** - 8 realistic chat examples
- **`messages.ts`** - Conversation histories with multiple turns
- **`contents.ts`** - Generated images and videos
- **`index.ts`** - Central export point

**Easy to Delete:** When you no longer need mock mode, simply delete this folder and remove the import from `dataService.ts`.

### Component Example: SidebarChats

Let's see how components use this architecture:

```typescript
export function SidebarChats() {
  // Use hooks - no knowledge of data source
  const { data: chats, isLoading, error } = useChats()
  const createMutation = useCreateChat()
  const deleteMutation = useDeleteChat()

  // Handle create
  const handleNewChat = () => {
    createMutation.mutate(title, {
      onSuccess: (data) => {
        // Navigate to new chat
        router.push(`/chat/${data.chat.id}`)
      },
    })
  }

  // Render - same code for mock or real data
  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorState />

  return <div>{chats.map(chat => <ChatItem />)}</div>
}
```

**Notice:**

- No imports of mock data
- No API calls
- No conditional logic for mock vs real
- Just clean, simple component code

The component doesn't care if data comes from mock files or a REST API - it just works!

---

## 📂 File Structure

Understanding where everything lives helps you navigate the codebase and make changes confidently.

### Complete Project Structure

```
higgsfield-swe/
├── src/
│   ├── app/                                 # Next.js App Router
│   │   ├── layout.tsx                       # Root layout
│   │   ├── page.tsx                         # Home page (redirects to /chat)
│   │   ├── providers.tsx                    # QueryClient provider
│   │   └── chat/
│   │       ├── layout.tsx                   # Chat layout with sidebar
│   │       ├── page.tsx                     # Chat list page
│   │       └── [id]/
│   │           └── page.tsx                 # Individual chat page
│   │
│   ├── components/                          # React components
│   │   ├── chat/
│   │   │   ├── ChatTranscript.tsx           # Message list component
│   │   │   ├── ChatTranscriptMock.tsx       # Mock version (optional)
│   │   │   ├── MessageBubble.tsx            # Individual message display
│   │   │   ├── Composer.tsx                 # Message input form
│   │   │   └── ComposerMock.tsx             # Mock version (optional)
│   │   ├── content/
│   │   │   ├── ContentViewer.tsx            # Image/video display
│   │   │   ├── ContentViewerMock.tsx        # Mock version (optional)
│   │   │   ├── ContentList.tsx              # Content thumbnails grid
│   │   │   └── ContentListMock.tsx          # Mock version (optional)
│   │   ├── layout/
│   │   │   ├── LayoutShell.tsx              # Main layout wrapper
│   │   │   ├── SidebarChats.tsx             # Chat list sidebar ⚡
│   │   │   ├── ThreePanelLayout.tsx         # 3-column resizable layout
│   │   │   └── ThreePanelLayoutMock.tsx     # Mock version (optional)
│   │   └── ui/
│   │       ├── EmptyState.tsx               # Empty state component
│   │       ├── ErrorState.tsx               # Error display component
│   │       ├── LoadingSkeleton.tsx          # Loading states
│   │       └── TopBar.tsx                   # Top navigation bar
│   │
│   ├── lib/                                 # 🎯 CORE LOGIC
│   │   ├── dataService.ts                   # ⚡ MAIN FACADE (THE SWITCH)
│   │   ├── api.ts                           # Real API HTTP client
│   │   ├── store.ts                         # Zustand state management
│   │   └── hooks/
│   │       └── useChats.ts                  # Custom React hooks
│   │
│   ├── types/                               # TypeScript definitions
│   │   ├── api.ts                           # API type definitions
│   │   └── schemas.ts                       # Zod validation schemas
│   │
│   └── _mockData/                           # 🗑️ DELETE AFTER INTEGRATION
│       ├── chats.ts                         # Mock chat data
│       ├── messages.ts                      # Mock message data
│       ├── contents.ts                      # Mock content data
│       ├── index.ts                         # Export aggregator
│       └── README.md                        # Mock data documentation
│
├── .env.local                               # ⚙️ ENVIRONMENT CONFIG (gitignored)
├── env.example                              # Environment template
├── BACKEND_INTEGRATION.md                   # This file
├── README.md                                # Project documentation
└── package.json                             # Dependencies
```

### Critical Files for Backend Integration

When integrating your backend, you'll primarily interact with these files:

#### 1. `.env.local` (Main Configuration)

```bash
NEXT_PUBLIC_USE_MOCK=0  # ← Change this to switch
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

#### 2. `src/lib/dataService.ts` (The Switch)

- Contains all the `if (USE_MOCK)` logic
- Routes to either mock data or real API
- **Only file that knows about both data sources**

#### 3. `src/lib/api.ts` (Real API Client)

- Modify if your backend has different endpoints
- Add authentication headers here
- Handle backend-specific response formats

#### 4. `src/types/api.ts` & `schemas.ts` (Contracts)

- Type definitions your backend must match
- Share with backend team
- Update if backend uses different structure

### Files You Can Ignore

These files work automatically and rarely need changes:

- All component files (they use hooks, don't care about data source)
- Hook files (generic wrappers around dataService)
- UI components (pure presentation)

### Mock-Related Files (Optional to Keep)

The `*Mock.tsx` component files are **optional**:

- They directly use mock data
- Created as an alternative approach
- Can be deleted once you're confident in the dataService approach
- Useful for comparing patterns

**Recommendation:** Use the dataService pattern (it's cleaner) and delete the `*Mock.tsx` files after confirming everything works.

---

## 🔄 How It Works

### Example: SidebarChats Component

```typescript
// Component uses hooks (no awareness of mock vs real)
export function SidebarChats() {
  const { data: chats, isLoading, error } = useChats()
  const createMutation = useCreateChat()

  // Component just works with data - doesn't care about source
}
```

### Hook Layer

```typescript
// Hook uses TanStack Query + Data Service
export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsService.getAll(), // ← Service facade
  })
}
```

### Service Layer (The Magic)

```typescript
// Service checks environment and routes accordingly
export const chatsService = {
  async getAll(): Promise<Chat[]> {
    if (USE_MOCK) {
      return [...mockChats] // ← Mock data
    }
    return api.getChats() // ← Real API
  },
}
```

---

## 🎯 Benefits of This Approach

### ✅ For Hackathon Speed

- **Instant switching** with one env variable
- **No code changes** in components
- **Works immediately** with mock data
- **Easy to demo** before backend is ready

### ✅ For Production Quality

- **Clean separation** of concerns
- **Easy to test** (mock for tests, real for E2E)
- **Type-safe** throughout the stack
- **Maintainable** - changes isolated to service layer

### ✅ For Team Collaboration

- **Frontend can work independently** of backend
- **Backend team has clear API contracts** (see `types/api.ts`)
- **Both teams can work in parallel**
- **Integration is just flipping a switch**

---

## 📋 Backend API Contract

Your backend should implement these endpoints:

### Chats

```
GET    /chats                  → Chat[]
POST   /chats                  → { chat: Chat }
PATCH  /chats/:id             → { chat: Chat }
DELETE /chats/:id             → { ok: boolean }
```

### Messages

```
GET    /chats/:id/messages    → Message[]
POST   /chats/:id/send        → SendResponse
```

### Contents

```
GET    /chats/:id/contents    → ContentItem[]
GET    /contents/:contentId   → ContentItem
```

See `src/types/api.ts` for full type definitions.

---

## 🚀 Integration Steps (Detailed)

### Phase 1: Preparation (Before Backend Ready)

- ✅ Develop with `NEXT_PUBLIC_USE_MOCK=1`
- ✅ Test all features with mock data
- ✅ Share API contracts with backend team

### Phase 2: Initial Integration

1. Set `NEXT_PUBLIC_USE_MOCK=0`
2. Set `NEXT_PUBLIC_API_BASE_URL=https://your-backend.com`
3. Test each endpoint
4. Fix any contract mismatches in `lib/api.ts`

### Phase 3: Cleanup (Optional)

1. Delete `src/_mockData/` folder
2. Remove mock imports from `lib/dataService.ts`
3. Remove `USE_MOCK` checks from `lib/dataService.ts`

---

## 🔧 Troubleshooting

### Backend returns different structure?

**Option A: Adapt in API layer**

```typescript
// lib/api.ts
export async function getChats(): Promise<Chat[]> {
  const data = await fetchJson<BackendResponse>('/chats')
  // Transform backend format to our format
  return data.items.map(item => ({
    id: item._id,
    title: item.name,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }))
}
```

**Option B: Update types**

```typescript
// If backend format is better, update our types to match
// Then remove transformation layer
```

### Need to add authentication?

```typescript
// lib/api.ts
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken() // Your auth logic

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // ← Add auth
      ...init?.headers,
    },
    ...init,
  })
  // ...
}
```

### Need to handle errors differently?

```typescript
// lib/dataService.ts - Add error handling in service layer
export const chatsService = {
  async getAll(): Promise<Chat[]> {
    try {
      if (USE_MOCK) {
        return [...mockChats]
      }
      return await api.getChats()
    } catch (error) {
      console.error('Failed to fetch chats:', error)
      throw new Error('Unable to load chats') // Friendly message
    }
  },
}
```

---

## 💡 Pro Tips

### Keep Mock Data for Testing

Even after backend integration, you might want to keep mock mode:

- **Local development** when backend is down
- **End-to-end tests** for consistent test data
- **Demos** with predictable data

### Gradual Migration

You can migrate endpoint by endpoint:

```typescript
export const chatsService = {
  async getAll(): Promise<Chat[]> {
    // Always use real API for chats, even in mock mode
    return api.getChats()
  },
}
```

### Monitor the Switch

```typescript
// lib/dataService.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1'

if (typeof window !== 'undefined') {
  console.log(`🔧 Data Mode: ${USE_MOCK ? 'MOCK' : 'REAL API'}`)
}
```

---

## 📊 Comparison: Our Approach vs Alternatives

| Approach                  | Switch Time | Code Changes | Best For          |
| ------------------------- | ----------- | ------------ | ----------------- |
| **Our Facade Pattern**    | < 2 min     | 0 files      | ✅ **Hackathons** |
| Direct Mock in Components | Hours       | All files    | ❌ Never          |
| Feature Flags             | 5 min       | 0 files      | Production apps   |
| Separate Mock Components  | 30 min      | Few files    | Testing           |

---

## ✨ Summary

### What We Built

- **Single source of truth** for data fetching
- **Environment-based switching** (1 variable)
- **Zero component changes** needed
- **Production-ready** architecture

### Time Savings

- **Mock → Real Backend**: < 2 minutes
- **Rollback if needed**: < 1 minute
- **Switch for demos**: < 30 seconds

### For Your Hackathon

This architecture lets you:

1. **Demo immediately** with mock data
2. **Integrate backend** in minutes when ready
3. **Switch back to mock** if backend has issues
4. **Ship production-quality** code

**Perfect for hackathons where speed matters!** 🚀
