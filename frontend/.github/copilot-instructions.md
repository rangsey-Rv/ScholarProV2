# ScholarPro Frontend - AI Coding Agent Instructions

## Quick Start
**Package Manager**: pnpm only (enforced via `preinstall`). Never use npm/yarn.
```powershell
pnpm install
pnpm dev              # Uses Turbopack (Next.js 16 canary)
pnpm build            # Production build
pnpm lint             # ESLint check (enforced by Husky pre-commit)
```

## Project Architecture
Next.js 16 (canary) with App Router, React 19, TypeScript 5, Tailwind v4. Backend at `https://projectesting.site/api/v1` proxied via `/api/*` in `next.config.ts`.

**Core Structure**:
- Routes: `app/(auth)/*` and `app/(dashboard)/*` - route groups with shared layouts
- Components: `components/` - reusable UI, organized by feature
- Services: `api/` - axios client (`api.ts`), endpoints (`endpoint.ts`), service layers (`service/*.ts`)
- Validation: `lib/schema/` - Zod schemas with `.transform(sanitize)` pattern
- Security: `lib/utils/sanitize.ts` - Basic regex sanitization (Dec 2025)
- Types: `types/` - TypeScript definitions (`.d.ts` files)
- Constants: `constants/` - enums, mock data, email variables
- Context: `lib/context/` - `AuthContext` for user auth state, `HeaderContext` for dynamic page titles

**Student Workflow**: New Applicant → Shortlisted → Exam Scheduled → Interview Scheduled → Awarded/Rejected

**Monitoring**: Sentry integration enabled for error tracking and performance monitoring
- Client-side: `instrumentation-client.ts` - session replays, breadcrumbs
- Server-side: `instrumentation.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`
- Tunnel route: `/monitoring` (bypasses ad-blockers)

## Critical Conventions

### 1. Imports & Client Components
- **Always use `@/` aliases** (configured in tsconfig.json) - never relative imports
- **Add `'use client'`** when using: hooks (useState, useEffect), context (useAuth, useHeader), router hooks (useRouter, usePathname), TipTap editor, TanStack Query hooks, or event handlers
- Dynamic page titles: Use `useHeader()` context in dashboard pages:
  ```tsx
  const { setTitle } = useHeader()
  useEffect(() => { setTitle('Page Title') }, [setTitle])
  ```
- **Auth context**: Access user state via `useAuth()` hook from `@/lib/context/auth-context`
  ```tsx
  const { user, isLoading, login, logout } = useAuth()
  ```

### 2. API Integration
- **Never call backend directly** - always use `/api/*` paths (Next.js rewrites in `next.config.ts`)
- **Add endpoints to `api/endpoint.ts`** first, then use via `apiClient` from `api/api.ts`
- Auth flow: `apiClient` auto-injects Bearer token from cookies, handles 401 refresh via interceptor (see `api/api.ts`)
  - Tokens stored in cookies: `accessToken` (15min expiry), `refreshToken` (httpOnly)
  - Automatic refresh queue prevents duplicate refresh requests
  - 429 rate limiting handling included
- Service pattern: Create `api/service/<feature>.service.ts` for business logic
- **TanStack Query**: Migrating from localStorage - use `@tanstack/react-query` with query keys from `constants/query-key-enum.ts`
  - Provider setup: `app/providers.tsx` wraps app with `QueryClientProvider`
  - Query keys enum: `QUERY_KEY_ENUM.ADMINS`, `QUERY_KEY_ENUM.COMMITTEES`, `QUERY_KEY_ENUM.BATCHES`
  - DevTools available: Bottom-left icon in dev mode
- Example endpoint structure:
  ```typescript
  // api/endpoint.ts
  SCHEDULE: {
    CREATE_EXAM: (batchId: string) => `/exam-sessions/${batchId}`,
    UPDATE_EXAM: (id: string) => `/exam-sessions/${id}`,
  },
  EMAIL: {
    CREATE_TEMPLATE: "/email",
    LIST_TEMPLATES: "/email/template-name",
    UPDATE_TEMPLATE: (name: string) => `/email/${name}`,
  }
  ```

### 3. Styling & UI
- **Tailwind v4**: CSS-based config, no `tailwind.config.js`
- **Use `cn()` utility** from `@/lib/utils` for conditional classes
- **Import from `@/components/ui/*`**, not `@radix-ui/*` directly
- **Status badges**: Use custom colors for accessibility (not default variants):
  ```tsx
  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
  ```

### 4. Email System (TipTap + Variables)
- **Variable format**: Double curly braces `{{variableName}}` (Mustache syntax)
- **21 variables** in `constants/email-variables.ts`: `{{applicantName}}`, `{{email}}`, `{{major}}`, `{{scholarshipPercentage}}`, `{{tuitionFee}}`, `{{mathExamDate}}`, `{{mathStartTime}}`, `{{englishExamDate}}`, `{{englishStartTime}}`, `{{interviewExamDate}}`, `{{interviewStartTime}}`, etc.
- **TipTap editor** at `components/ui/tiptap-editor.tsx` (693 lines) - custom Variable node extension renders variables as atomic pills
- **Insertion pattern** (via `@` mention or toolbar):
  ```ts
  editor.chain().focus()
    .insertContent({
      type: 'variable',
      attrs: { id: 'applicantName', label: 'Applicant Name' }
    })
    .insertContent(' ')
    .run()
  ```
- **Variable rendering**: `<span data-type="variable">{{applicantName}}</span>` in HTML
- **Security**: Use `sanitizeEmailTemplate()` from `lib/utils/sanitize.ts` to preserve variables during XSS protection

**⚠️ CRITICAL - Property Name Inconsistency**:
- **API Service** (`api/service/email.service.ts`): Uses `html` property for template content
- **Frontend Types** (`types/email.d.ts`): Uses `content` property
- **When integrating APIs**: Map `content` → `html` when sending, `html` → `content` when receiving
- Example:
  ```tsx
  // Sending to API
  await emailService.createTemplate({ name, subject, html: content })
  
  // Receiving from API  
  const template = await emailService.getTemplate(name)
  setContent(template.html) // API returns 'html', store as 'content'
  ```

### 5. Dual Tuition Structure (Critical for Filtering)
- **Business Intelligence/Risk Management**: $3,500/year ($14,000 for 4-year)
- **Engineering/Architecture**: $4,000/year ($16,000 for 4-year)
- **Always check BOTH amounts when filtering**:
  ```tsx
  // ❌ WRONG
  students.filter(s => s.awardAmount === 16000)
  
  // ✅ CORRECT
  students.filter(s => s.awardAmount === 16000 || s.awardAmount === 14000)
  ```
- Use `utils/department-mapper.ts` → `getDepartmentByMajor()` for tuition calculations

## Security & Validation (Added Dec 2025)

### Input Sanitization Pattern
- **Zod schemas with transforms**: All forms use Zod validation with `.transform(sanitize)` chaining
- **Location**: `lib/schema/*.ts` - follow pattern from `create-batch-schema.ts` and `email-template-schema.ts`
- **Utilities**: `lib/utils/sanitize.ts` provides 5 functions:
  - `sanitizeText()` - Plain text (names, descriptions) - converts `<>` to entities
  - `sanitizeHtml()` - Basic HTML sanitization via regex - removes scripts and event handlers
  - `sanitizeEmailTemplate()` - HTML + preserves `{{variables}}` - protect→sanitize→restore pattern
  - `stripHtml()` - Convert HTML to plain text
  - `sanitizeUrl()` - Block javascript:, data:, vbscript:, file: protocols

### Validation Schema Example
```typescript
import { z } from "zod"
import { sanitizeText, sanitizeEmailTemplate } from "@/lib/utils/sanitize"

export const emailTemplateSchema = z.object({
  name: z.string().min(1).max(100).trim().toLowerCase().transform(sanitizeText),
  subject: z.string().min(1).max(200).trim().transform(sanitizeText),
  html: z.string().min(1).max(50000).trim().transform(sanitizeEmailTemplate),
})
```

### React Hook Form Integration
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(emailTemplateSchema)
})
```

### XSS Protection
- **Always sanitize before display**: Wrap `dangerouslySetInnerHTML` with `sanitizeEmailTemplate()`
- **Multi-layer defense**: Validate on input, sanitize on save, sanitize on display
- **Regex-based approach**: Removes script tags, event handlers, and dangerous protocols
- **Backend responsibility**: Frontend provides basic sanitization; backend should do comprehensive validation



## Data Management (Temporary - Pre-Backend)

### localStorage Patterns
Used extensively until backend APIs ready:
```tsx
// Save/load with type safety
const saveStudents = (students: Student[]) => 
  localStorage.setItem('applicants', JSON.stringify(students))

const loadStudents = (): Student[] => {
  const stored = localStorage.getItem('applicants')
  return stored ? JSON.parse(stored) : []
}

// Auto-refresh on window focus (handles cross-tab updates)
useEffect(() => {
  const handleFocus = () => setStudents(loadStudents())
  window.addEventListener('focus', handleFocus)
  return () => window.removeEventListener('focus', handleFocus)
}, [])
```

**Active Keys**: `applicants`, `evaluation_${studentId}`, `emailTemplates`, `email-logs`, `auth_token`, `refresh_token`, `user`

### Email History & Logging
- **Storage**: `lib/email/email-log-mock.ts` - mock data generator with CRUD operations
- **Types**: `types/email.d.ts` - `EmailLog`, `EmailRecipientLog`, `EmailLogStats`
- **UI**: `components/settings/EmailHistory.tsx` (500+ lines) - statistics dashboard + detailed tracking
- **Soft delete**: Sets `isDeleted=true, deletedAt=timestamp` (preserves data)

## Key Workflows

### Adding a Dashboard Page
1. Create `app/(dashboard)/<name>/page.tsx` with `'use client'`
2. Set title: `const { setTitle } = useHeader(); useEffect(() => setTitle('Title'), [])`
3. Add to sidebar: `components/app-sidebar.tsx` → `navMain` array
4. Add API endpoint: `api/endpoint.ts` → `API_ENDPOINTS` object
5. Create service if needed: `api/service/<name>.service.ts`

### Email Sending (3-Column Layout)
**Location**: `app/(dashboard)/communications/page.tsx`
- **Left**: `RecipientSelector` - 8 groups (shortlisted, rejected, awarded-25/50/75/75-assistantship/100, committee)
- **Center**: TipTap composer with template dropdown
- **Right**: `EmailPreviewList` - per-recipient preview with variable substitution

**Recipient filtering** (see `RecipientSelector.tsx`):
```tsx
case "awarded-100":
  return students.filter(s => 
    s.status === "awarded" && 
    (s.awardAmount === 16000 || s.awardAmount === 14000) // Dual tuition!
  )
```

### Schedule System
**Location**: `app/(dashboard)/schedule/page.tsx` - tab-based UI
- **Tabs**: ExamSchedule, InterviewSchedule, ScheduleCalendar
- **Pattern**: Multi-step forms → batch selection → details → committee assignment
- **API**: `POST /exam-sessions/${batchId}`, `PUT /exam-sessions/${id}`
- **Components**: `ScheduleTabs`, `ExamDetails`, `InterviewDetails`, `TimeSlotDetails`

### Student Evaluation
- **5 criteria** (0-20 pts each): Attitude/Leadership, Academic Prep, Program Fit, Motivation, Communication
- **Grades**: A (80-100), B (60-79), C (40-59), D (0-39)
- **Storage**: `localStorage` key `evaluation_${studentId}` (migrate to API later)
- **Components**: `EvaluationForm` (input), `EvaluationSummary` (display with badges)

## Common Pitfalls

1. **API Proxy**: NEVER call backend URL directly - use `/api/*` paths only (see `next.config.ts`)
2. **Imports**: Use `@/` aliases (not relative paths), import from `@/components/ui/*` (not `@radix-ui/*`)
3. **Missing `'use client'`**: Add directive when using hooks, context, router, TipTap, or event handlers
4. **Tailwind Config**: CSS-based only (v4), no `tailwind.config.js`
5. **Variable Format**: `{{variableName}}` (double curly braces), NOT `[variable-name]` or `{variable}`
6. **Dual Tuition Filtering**: Check BOTH amounts (e.g., `awardAmount === 16000 || awardAmount === 14000`)
7. **Status Badges**: Use custom colors (`bg-green-100 text-green-800 border-green-200`), not default variants
8. **ESLint**: No `any` types, remove unused imports - Husky pre-commit hooks enforce this
9. **TipTap Types**: Import `type Editor` from `@tiptap/react`, `type SuggestionProps` from `@tiptap/suggestion`
10. **PowerShell Paths**: Quote paths with parentheses: `git add "app/(dashboard)/*"`
11. **Security**: Always use `sanitizeEmailTemplate()` when displaying HTML with `dangerouslySetInnerHTML`
12. **Email Property Names**: Backend uses `html`, frontend types use `content` - always map between them when calling APIs

## Key Files Reference

| File | Purpose | Edit When |
|------|---------|-----------|
| `next.config.ts` | API proxy config | Backend URL changes |
| `api/endpoint.ts` | API endpoints | Adding endpoints |
| `api/api.ts` | Axios + interceptors | Auth flow changes |
| `components/app-sidebar.tsx` | Nav menu (`navMain`) | Adding sidebar links |
| `components/ui/tiptap-editor.tsx` | Rich text editor (693 lines) | Variable/editor features |
| `components/communications/RecipientSelector.tsx` | 8 recipient groups | Email targeting logic |
| `constants/email-variables.ts` | 21 email variables | Adding variables |
| `utils/department-mapper.ts` | Major→Department map | Tuition calculations |
| `types/email.d.ts` | Email types | Type changes |
| `lib/email/email-log-mock.ts` | Mock email logs | Email logging data |
| `lib/utils/sanitize.ts` | XSS protection utilities | Security functions |
| `lib/schema/email-template-schema.ts` | Email validation (uses `html`) | Email form validation |
| `api/service/email.service.ts` | Email API service (uses `html`) | Email backend integration |

## Dependencies (Key Ones)

- **Next.js 16.0.10** (canary): App Router, Turbopack
- **React 19.2.3**: Client/Server Components
- **TypeScript 5**: Strict mode
- **Tailwind CSS v4**: PostCSS-based (no `tailwind.config.js`)
- **TanStack Query v5.90**: Data fetching (migrating from localStorage) + DevTools
- **TanStack Table v8**: Sortable/filterable tables
- **React Hook Form 7** + **Zod 4.1**: Forms + validation
- **Radix UI**: Accessible primitives (Dialog, Dropdown, Popover, Select)
- **TipTap v3.11**: Rich text editor with extensions (Mention, Image, Link, Color)
- **axios**: HTTP client with interceptors
- **PapaCSV**: CSV parsing
- **Sonner**: Toast notifications
- **Sentry v10.30**: Error tracking, performance monitoring, session replay
- **DOMPurify**: HTML sanitization

## Testing & Debugging

- **No automated tests** - manual testing only
- **Browser console**: Check API errors (interceptors log failures)
- **Sentry**: Error tracking and performance monitoring dashboard at sentry.io
  - Session replays enabled for debugging user interactions
  - Breadcrumbs track user actions before errors
- **TanStack Query DevTools**: Bottom-left icon in dev mode (shows cache, queries, mutations)
- **TipTap inspection**: `editor.getHTML()`, `editor.getJSON()` in console

## Quick Reference

**Commands**:
```bash
pnpm dev              # Dev server (localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint check
```

**Adding a Feature**:
1. Create types in `types/`
2. Add endpoint to `api/endpoint.ts`
3. Create service in `api/service/` (if needed)
4. Build components in `components/`
5. Create page in `app/(dashboard)/[feature]/page.tsx`
6. Add to `components/app-sidebar.tsx` → `navMain`
7. Set title with `useHeader()` hook

**Code Style** (Prettier + ESLint):
- Single quotes, no semicolons
- 2 space indentation
- Arrow functions preferred
- Trailing commas

**Auth Flow**:
```
Login → Store tokens → apiClient injects token → 401 → Refresh → Retry
```

## Email Feature Implementation Notes

**Service Layer** (`api/service/email.service.ts`):
- Uses `html` property (matches backend API contract)
- Methods: `listTemplates()`, `getTemplate(name)`, `createTemplate(data)`, `updateTemplate(name, data)`, `deleteTemplate(name)`, `bulkSend(templateName, applicationIds)`
- All methods return/accept `EmailTemplate` with `{ name, subject, html }` structure

**Validation Layer** (`lib/schema/email-template-schema.ts`):
- Three schemas: `emailTemplateSchema`, `emailTemplateUpdateSchema`, `bulkEmailSchema`
- Uses `html` field with `sanitizeEmailTemplate()` transform
- Template name: lowercase, alphanumeric + underscores/hyphens only

**UI Components**:
- `components/settings/EmailPresets.tsx`: Template management (CRUD operations)
- `components/settings/CreateTemplateDialog.tsx`: Create new templates with React Hook Form + Zod
- `app/(dashboard)/communications/page.tsx`: Bulk email sending interface
- `components/communications/EmailPreviewList.tsx`: Per-recipient email preview with variable substitution

**Temporary State** (Pre-Backend):
- Templates stored in localStorage as `emailTemplates` key
- `types/email.d.ts` uses `content` property (will need mapping when APIs are integrated)
- All components have `// TODO STEP X:` comments marking API integration points

---

*Last updated: December 14, 2025 | Current branch: `dev`*
