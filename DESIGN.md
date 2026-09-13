# Todo Application — Stitch Design Specification

## 1. Product Direction

Design and generate a polished, premium Todo application frontend.

The application must remain a **Todo/task-management product**. The uploaded Origin reference is used only for its visual direction:

- Premium editorial composition
- Dark, cinematic visual language
- Strong typography
- Large atmospheric imagery or subtle texture
- Spacious layouts
- Carefully composed sections
- Refined motion and micro-interactions
- High contrast and intentional visual hierarchy

Do **not** copy Origin's branding, text, layout, imagery, financial-advisor concepts, or page structure. Create an original Todo application that borrows only the overall visual quality and mood.

The result should feel like a thoughtfully designed productivity product, not a generic admin dashboard or AI-generated SaaS template.

---

## 2. Existing Backend Contract

The frontend must work with the existing FastAPI backend.

### Base URL

```text
http://127.0.0.1:8000
```

### Available endpoints

```text
GET    /health
GET    /api/tasks?completed=false&q=design
POST   /api/tasks
GET    /api/tasks/{task_id}
PATCH  /api/tasks/{task_id}
DELETE /api/tasks/{task_id}
```

### Task shape

The frontend should support these fields:

```json
{
  "id": 1,
  "title": "Build the task list",
  "description": "Practice loading and rendering data.",
  "priority": "high",
  "completed": false
}
```

### Create task payload

```json
{
  "title": "Build the task list",
  "description": "Practice loading and rendering data.",
  "priority": "high"
}
```

### Update task payload

Use partial updates:

```json
{
  "title": "Updated task title",
  "completed": true,
  "priority": "medium"
}
```

Do not invent unsupported backend fields such as due dates, tags, reminders, users, projects, attachments, or authentication unless they are implemented only as visual placeholders and clearly excluded from API requests.

---

## 3. Core User Experience

The main experience should be a focused Todo workspace.

Primary actions:

1. View all tasks
2. Search tasks
3. Filter by completion state
4. Create a task
5. Open task details
6. Edit a task
7. Mark a task complete/incomplete
8. Delete a task
9. Understand loading, empty, error, and success states

The UI should make completing a task feel satisfying without becoming overly gamified.

---

## 4. Recommended Information Architecture

### Main route: `/`

A single-page Todo workspace with:

- Minimal top navigation
- Brand/product name
- Small status indicator for API connection
- Main headline
- Task statistics
- Search and filter controls
- Task list
- Create-task action
- Optional task detail drawer or modal

### Optional routes

Only create these if they improve the experience without adding unsupported complexity:

- `/tasks`
- `/completed`

Avoid creating unnecessary pages. This is a Todo application, not a large enterprise dashboard.

---

## 5. Visual Direction

### Overall mood

Use a premium dark editorial style inspired by the uploaded reference:

- Deep charcoal or near-black background
- Warm off-white typography
- Muted gray secondary text
- One restrained accent color
- Soft atmospheric gradients or grain used sparingly
- Subtle borders
- Large negative space
- Elegant typography hierarchy

Do not use:

- Neon cyberpunk colors
- Excessive gradients
- Glassmorphism everywhere
- Huge rounded cards for every element
- Generic purple-blue SaaS styling
- Dense dashboard grids
- Excessive icons
- Fake charts or meaningless metrics
- Decorative UI that distracts from task completion

### Suggested palette

```text
Background:       #0B0B0A
Elevated surface:  #141412
Subtle surface:    #1B1B18
Primary text:      #F5F2EA
Secondary text:    #A6A39A
Muted text:        #77756E
Border:            rgba(245, 242, 234, 0.12)
Accent:            #D7FF64 or another restrained lime/olive accent
Danger:            #FF756D
Success:           #B9E986
```

The accent should be used for:

- Primary action
- Active filter
- Checkbox completion state
- Focus states
- Small status highlights

Do not make the entire interface bright green.

---

## 6. Typography

Use a sophisticated editorial type pairing.

Recommended direction:

- Display/headline font: elegant serif or high-contrast editorial serif
- UI/body font: clean modern sans-serif

Possible combinations:

- Instrument Serif + Inter
- Cormorant Garamond + Geist
- Playfair Display + Inter
- DM Serif Display + Manrope

Typography should create contrast between:

- Large editorial headline
- Compact interface labels
- Task titles
- Supporting descriptions
- Small metadata

Use sentence case. Avoid excessive uppercase text.

---

## 7. Main Page Layout

### Header

Create a restrained header:

- Small wordmark, e.g. `daily/`
- Navigation or view switcher: `All tasks`, `Completed`
- API status indicator: `Connected` / `Offline`
- Primary `New task` button

The header should not resemble a complex SaaS navigation bar.

### Hero area

Use an editorial hero section with:

- Eyebrow: `YOUR DAY, IN ORDER`
- Main heading such as:

```text
Make space for
what matters.
```

- Supporting text explaining that the app keeps tasks clear and manageable
- A compact task summary, for example:

```text
12 tasks
4 completed
8 remaining
```

Do not fabricate statistics. If real data is available, calculate them from the API. If not, use loading placeholders.

### Task workspace

The task workspace should be the visual center of the application.

Include:

- Search input
- Completion filter
- Optional priority filter only if supported by the current task data
- Sort control only if implemented locally and clearly useful
- New task button
- Task list

Suggested section heading:

```text
Your tasks
```

Supporting label:

```text
A clear list for a clearer day.
```

---

## 8. Task Item Design

Each task should feel like a refined editorial list row, not a large dashboard card.

Each row can contain:

- Completion checkbox
- Task title
- Optional description preview
- Priority label
- Edit action
- Delete action
- Completion state

### Incomplete task

- Strong title contrast
- Subtle divider
- Accent checkbox on hover/focus
- Priority shown as a small text label or understated pill

### Completed task

- Reduced contrast
- Strikethrough title
- Muted description
- Checkbox visibly completed
- Preserve access to edit/delete

### Interaction

- Entire row may be clickable to open details
- Checkbox must be independently clickable
- Destructive delete must require confirmation or provide undo
- Use optimistic UI only if rollback is implemented correctly

Avoid excessive hover animations.

---

## 9. Create/Edit Task Interface

Use a refined modal, side panel, or focused inline form.

Fields:

- Title — required
- Description — optional
- Priority — `low`, `medium`, `high`
- Completed — available in edit mode

Form behavior:

- Clear labels
- Helpful validation
- Disabled submit state while saving
- Visible API error state
- Success feedback after save
- Cancel action
- Keyboard accessible controls

Example copy:

```text
New task
Give the next important thing a name.
```

Validation:

- Title cannot be empty
- Title should respect the backend's maximum length
- Description should respect the backend's maximum length
- Priority must be one of `low`, `medium`, or `high`

---

## 10. Required States

Design all of the following:

### Loading

- Elegant skeleton rows
- Avoid flashing empty-state content
- Keep layout stable

### Empty state

Example:

```text
Nothing here yet.

Start with one small thing.
```

Include a clear `Create your first task` action.

### No search results

Example:

```text
No tasks match that search.

Try another phrase.
```

### API error

Example:

```text
We couldn't load your tasks.

Check that the backend is running and try again.
```

Include a `Retry` action.

### Offline/disconnected

Show a subtle status indicator. Do not block the entire interface unless the requested operation requires the backend.

### Delete confirmation

Use a calm, clear confirmation dialog. State that the task will be permanently removed.

---

## 11. Responsive Design

### Desktop

- Centered content with generous horizontal margins
- Maximum content width around 1100–1280px
- Hero and task workspace may use a two-column composition
- Task list remains readable and focused

### Tablet

- Reduce hero scale
- Stack controls when necessary
- Preserve generous spacing

### Mobile

- Single-column layout
- Compact header
- Full-width task list
- Bottom sheet or full-screen modal for create/edit
- Search and filters should remain usable without horizontal overflow
- Minimum touch target: approximately 44px
- Avoid tiny text and cramped rows

The mobile experience must feel intentionally designed, not merely shrunk.

---

## 12. Motion and Interaction

Use subtle, purposeful motion:

- Page content fades in gently
- Task rows enter with short staggered motion
- Checkbox completion has a restrained transition
- Modal/drawer uses smooth but fast motion
- Buttons have tactile hover/pressed states
- Respect `prefers-reduced-motion`

Avoid:

- Constant floating animations
- Excessive parallax
- Long loading animations
- Distracting particle effects
- Motion on every element

---

## 13. Accessibility

Ensure:

- Semantic HTML
- Proper form labels
- Keyboard navigation
- Visible focus states
- Accessible dialog behavior
- `aria-label` for icon-only buttons
- Sufficient color contrast
- Checkbox state communicated to screen readers
- Errors associated with relevant inputs
- No interaction depends only on hover
- Reduced-motion support

---

## 14. API Integration Rules

Implement a small API client layer.

Suggested functions:

```text
getTasks(params)
getTask(taskId)
createTask(payload)
updateTask(taskId, payload)
deleteTask(taskId)
getHealth()
```

Rules:

- Use the existing endpoint paths exactly
- Do not silently change `/api/tasks` to another resource
- Handle non-2xx responses
- Show useful error messages
- Keep loading and mutation states separate
- Avoid duplicate requests
- Refresh or update local state after mutations
- Keep API base URL configurable through an environment variable
- Default development URL to `http://127.0.0.1:8000`

Suggested environment variable:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 15. Component Suggestions

Possible component structure:

```text
AppShell
Header
HeroSummary
TaskToolbar
SearchInput
CompletionFilter
TaskList
TaskRow
PriorityLabel
TaskForm
TaskDetailsPanel
DeleteConfirmDialog
EmptyState
ErrorState
LoadingTaskList
ConnectionStatus
Toast
```

Do not create components only for the sake of abstraction. Keep the structure understandable.

---

## 16. Content Guidelines

Use concise, human copy.

Good examples:

- `Make space for what matters.`
- `Your tasks`
- `One thing at a time.`
- `Start with one small thing.`
- `Nothing here yet.`
- `A clear list for a clearer day.`
- `You’re making progress.`

Avoid:

- Generic AI copy such as `Supercharge your productivity`
- Fake business metrics
- Financial terminology from the reference
- Overly enthusiastic gamification
- Unnecessary marketing sections

---

## 17. Stitch Generation Instructions

Generate the frontend as a complete, coherent Todo application.

Priorities, in order:

1. Correct Todo functionality
2. Correct API contract
3. Strong visual hierarchy
4. Premium editorial styling
5. Responsive behavior
6. Accessibility
7. Polished motion and states

The uploaded Origin screenshot is a **visual reference only**. Do not reproduce its exact layout, copy, images, branding, or financial product concepts.

The final result should look like:

> An original, premium, editorial Todo workspace with cinematic dark styling and excellent product design.

It should not look like:

> A financial advisor landing page, a copied Origin website, a generic admin dashboard, or AI-generated SaaS UI.
