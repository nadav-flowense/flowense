# Enhanced Sub-Agent Architecture Reviewer Command

Advanced system architecture analysis with stack-specific intelligence, automated best practice discovery, and comprehensive improvement roadmaps for modern TypeScript monorepos.

## Command Syntax

```bash
sub-agent-architecture-reviewer [target] [options]

# Aliases
@architecture-review [target] [options]
@arch-review [target] [options]
@saar [target] [options]
```

## Parameters

- `target` - Directory to analyze (defaults to current directory)
- `--visualize` - Generate architecture diagrams (default: true)
- `--detect-violations` - Check for architecture anti-patterns (default: true)
- `--suggest-improvements` - Provide refactoring suggestions (default: true)
- `--find-examples` - Search for real-world implementation examples (default: true)
- `--stack-analysis` - Deep dive into stack-specific patterns (default: true)
- `--style` - Architecture style (layered, hexagonal, microservices, mvc, clean)
- `--output` - Output format (text, markdown, mermaid, plantuml, all)
- `--depth` - Analysis depth (shallow, standard, deep, nuclear)
- `--rules` - Custom architecture rules file
- `--compare-examples` - Find and compare similar projects (default: true)
- `--performance-analysis` - Analyze performance implications (default: true)
- `--security-review` - Check security patterns (default: true)

## Stack Configuration

### Detected Stack (Auto-detected from package.json)
```yaml
runtime: bun
backend:
  framework: hono
  validation: zod
  openapi: @hono/zod-openapi
  auth: better-auth
  orm: drizzle
  database: postgres
frontend:
  framework: react
  styling: tailwind-4
  components: storybook
monorepo:
  tool: nx
quality:
  linter: biome
```

## Agent Orchestration

### Stage 0: Intelligence Gathering (Parallel)

#### Agent 0.1: Best Practice Discovery
```
Discover and catalog best practices for our stack: [STACK_CONFIG]

**WHY**: Before analyzing, we need to know what "good" looks like in our specific tech stack. This ensures our recommendations are based on current, proven patterns rather than generic advice.

**HOW**:

1. **Context7 Library Research**:
   ```
   For each technology in stack:
   - Call Context7:resolve-library-id with library name
   - Call Context7:get-library-docs with resolved ID and topic="architecture"
   - Call Context7:get-library-docs with topic="best-practices"
   - Call Context7:get-library-docs with topic="patterns"
   - Extract official recommendations
   ```
   
   Priority libraries:
   - hono (routing, middleware, architecture)
   - better-auth (session management, security)
   - drizzle (schema design, relations, migrations)
   - @hono/zod-openapi (API design, type safety)
   - nx (monorepo structure, boundaries)

2. **Better Auth Knowledge Base Search**:
   ```
   Call Better Auth:search with queries:
   - "architecture patterns"
   - "session management best practices"
   - "database schema design"
   - "middleware integration hono"
   - "security hardening"
   
   For each result:
   - Extract patterns
   - Note implementation details
   - Catalog code examples
   ```

3. **Real-World Example Discovery**:
   ```
   Search for production implementations:
   - GitHub search: "hono + drizzle + better-auth"
   - Look for: starter templates, production apps
   - Analyze their architecture decisions
   - Extract proven patterns
   ```

4. **Stack-Specific Anti-Patterns**:
   ```
   Research common mistakes:
   - Bun-specific gotchas
   - Hono performance pitfalls
   - Drizzle N+1 queries
   - Better-auth session leaks
   - NX boundary violations
   - React render optimization
   ```

**OUTPUT**:
{
  bestPractices: {
    hono: [...patterns with examples],
    betterAuth: [...patterns with examples],
    drizzle: [...patterns with examples],
    nx: [...patterns with examples],
    react: [...patterns with examples]
  },
  antiPatterns: [...stack-specific issues],
  realWorldExamples: [...GitHub repos],
  officialGuidance: [...from docs]
}
```

#### Agent 0.2: Stack Health Scanner
```
Scan project for stack-specific health indicators: [TARGET]

**WHY**: Generic architecture analysis misses technology-specific issues. We need to check if the project is using each technology correctly according to its own best practices.

**HOW**:

1. **Bun Runtime Analysis**:
   ```
   Check:
   - Are we using bun:test instead of jest?
   - Using bun's built-in SQLite for dev?
   - Leveraging bun's fast module resolution?
   - Using bunfig.toml for config?
   - Exploiting bun's native APIs?
   
   Search files for:
   - import.meta (bun-specific)
   - Bun.file(), Bun.write()
   - bun:sqlite usage
   ```

2. **Hono Framework Compliance**:
   ```
   Validate:
   - Proper middleware ordering
   - Context usage patterns
   - Route organization
   - Error handling middleware
   - CORS configuration
   - Zod validation integration
   
   Check for issues:
   - Middleware after routes (wrong order)
   - Missing error boundaries
   - Unvalidated inputs
   - Memory leaks in context
   ```

3. **Better-Auth Integration**:
   ```
   Call Better Auth:search "integration checklist"
   
   Verify:
   - Session strategy (JWT vs database)
   - CSRF protection enabled
   - Secure cookie settings
   - Password hashing config
   - OAuth providers setup
   - Rate limiting on auth routes
   
   Check codebase for:
   - auth.handler usage
   - Session validation middleware
   - Protected route patterns
   - Token refresh logic
   ```

4. **Drizzle ORM Patterns**:
   ```
   Call Context7:get-library-docs "/drizzle-team/drizzle-orm" topic="schema-design"
   
   Analyze:
   - Schema organization (one file vs many)
   - Relation definitions
   - Index usage
   - Migration strategy
   - Type safety usage
   - Connection pooling
   
   Detect issues:
   - N+1 query patterns
   - Missing indexes
   - Inefficient relations
   - Untyped queries
   ```

5. **NX Monorepo Structure**:
   ```
   Call Context7:get-library-docs "/nrwl/nx" topic="module-boundaries"
   
   Validate:
   - Project boundaries (tags)
   - Dependency constraints
   - Shared library usage
   - Build cache configuration
   - Task dependencies
   
   Check nx.json for:
   - Proper tags
   - Implicit dependencies
   - Affected detection
   ```

6. **React Patterns**:
   ```
   Scan for:
   - Proper hook usage
   - Component composition
   - State management patterns
   - Unnecessary re-renders
   - Missing React.memo
   - Prop drilling depth
   ```

7. **API Design (Zod OpenAPI)**:
   ```
   Call Context7:get-library-docs "hono.dev/docs"
   
   Check:
   - Route documentation
   - Schema reuse
   - Response validation
   - Error schemas
   - OpenAPI spec generation
   ```

**OUTPUT**:
{
  healthScore: 0-100,
  stackCompliance: {
    bun: {score, issues[], recommendations[]},
    hono: {score, issues[], recommendations[]},
    betterAuth: {score, issues[], recommendations[]},
    drizzle: {score, issues[], recommendations[]},
    nx: {score, issues[], recommendations[]},
    react: {score, issues[], recommendations[]},
    zod: {score, issues[], recommendations[]}
  }
}
```

### Stage 1: Deep Analysis Agents (Parallel)

#### Agent 1: Dependency Intelligence
```
Map and analyze all dependencies with stack-specific insights: [TARGET]

**WHY**: Dependencies are the nervous system of your architecture. Circular dependencies, tight coupling, and improper layer violations create maintenance nightmares, make testing harder, and slow down development. In a monorepo, this is even more critical.

**HOW**:

1. **File-Level Dependency Graph**:
   ```
   For each TypeScript/TSX file:
   - Parse imports using TypeScript AST
   - Build directed graph of dependencies
   - Detect cycles using Tarjan's algorithm
   - Calculate coupling metrics (afferent/efferent)
   
   Special attention to:
   - Barrel exports (index.ts) - can hide circular deps
   - Dynamic imports - async boundaries
   - Lazy loading - code splitting points
   ```

2. **NX Project Boundary Analysis**:
   ```
   Call Context7:get-library-docs "/nrwl/nx" topic="enforce-module-boundaries"
   
   For each NX project:
   - Extract project tags from project.json
   - Check @nrwl/enforce-module-boundaries config
   - Validate tag rules compliance
   - Detect unauthorized cross-project imports
   
   Example violations to catch:
   - Frontend importing backend code directly
   - Feature modules accessing other features
   - Libraries depending on apps
   - Shared code with business logic
   ```

3. **Layer Dependency Validation**:
   ```
   Define layers (based on stack):
   - Presentation: React components, Storybook stories
   - API: Hono routes, OpenAPI specs
   - Application: Business logic, services
   - Domain: Models, entities, value objects
   - Infrastructure: Drizzle, Better-auth, external APIs
   
   Validate rules:
   - Presentation → API only
   - API → Application only
   - Application → Domain only
   - Infrastructure → Domain only
   - Domain → Nothing (pure business logic)
   
   **WHY**: Proper layering ensures business logic isn't polluted
   with framework code, making it testable and portable.
   ```

4. **Service Dependency Mapping**:
   ```
   Identify services:
   - Hono app instances
   - Better-auth configuration
   - Drizzle database connections
   - External API clients
   - Message queues/event buses
   
   Map their dependencies:
   - Database connection pools
   - Redis/cache dependencies
   - File storage services
   - Email services
   - Payment gateways
   
   Calculate:
   - Service coupling score
   - Shared dependency count
   - Circular service dependencies
   ```

5. **Package Dependency Analysis**:
   ```
   Parse package.json files (all workspace packages):
   - Direct dependencies
   - Dev dependencies
   - Peer dependencies
   - Workspace dependencies
   
   Check for:
   - Version mismatches across workspace
   - Unused dependencies
   - Duplicate packages (multiple versions)
   - Missing peerDependencies
   - Outdated critical packages
   
   Special checks:
   - Ensure single version of React
   - Zod version consistency
   - Bun compatibility of all packages
   ```

6. **Circular Dependency Deep Dive**:
   ```
   For each circular dependency found:
   - Trace the complete cycle
   - Identify the coupling reason
   - Suggest breaking strategies:
     a) Dependency Inversion (interfaces)
     b) Event-based decoupling
     c) Shared abstractions
     d) Code extraction to shared lib
   
   Prioritize by:
   - Cycle length (shorter = easier to fix)
   - Impact (number of files affected)
   - Layer violations involved
   ```

**OUTPUT**:
{
  dependencyGraph: {nodes[], edges[]},
  circularDependencies: [{
    cycle: string[],
    severity: 'critical' | 'high' | 'medium',
    breakingStrategy: {
      approach: string,
      steps: string[],
      estimatedEffort: string,
      codeExample: string
    }
  }],
  layerViolations: [{
    from: string,
    to: string,
    violationType: string,
    fix: {how: string, why: string, example: string}
  }],
  nxBoundaryViolations: [...],
  couplingMetrics: {...},
  recommendations: [...]
}
```

#### Agent 2: Pattern & Architecture Analyzer
```
Deep pattern analysis with stack-specific best practices: [TARGET]

**WHY**: Consistent patterns make code predictable and maintainable. Random pattern usage creates cognitive overhead and makes onboarding difficult.

**HOW**:

1. **Hono Architecture Patterns**:
   ```
   Call Context7:get-library-docs "/honojs/hono" topic="application-structure"
   Call Better Auth:search "hono integration patterns"
   
   Analyze:
   a) Route Organization:
      - Are routes grouped by feature or by HTTP method?
      - Proper use of hono/factory for route grouping?
      - Middleware composition patterns
      
      Example good pattern:
      ```typescript
      // Feature-based grouping
      const users = new Hono()
        .get('/', listUsers)
        .post('/', createUser)
        .get('/:id', getUser)
      
      app.route('/users', users)
      ```
   
   b) Middleware Patterns:
      - Authentication middleware placement
      - Error handling patterns
      - Logging/monitoring integration
      - Request validation flow
      
      Check for anti-patterns:
      - Middleware after route definitions
      - Missing error boundaries
      - Blocking synchronous operations
   
   c) Context Usage:
      - Proper type-safe context extension
      - Variable injection patterns
      - Avoiding context pollution
      
      Example:
      ```typescript
      type Variables = {
        user: User
        session: Session
      }
      const app = new Hono<{ Variables: Variables }>()
      ```
   
   d) OpenAPI Integration:
      - Using createRoute from @hono/zod-openapi
      - Schema reuse patterns
      - Response documentation
      - Error response schemas
   ```

2. **Better-Auth Implementation Patterns**:
   ```
   Call Better Auth:search "authentication patterns"
   Call Better Auth:search "session management"
   
   Validate:
   a) Session Strategy:
      - JWT vs database sessions - which is used?
      - Token refresh patterns
      - Session invalidation
      
      **WHY JWT**: Stateless, scales horizontally
      **WHY Database**: Instant revocation, more secure
      
      Check implementation:
      ```typescript
      // Look for session config
      auth.config.session.strategy
      
      // Validate refresh token rotation
      // Check session cleanup jobs
      ```
   
   b) Authentication Flow:
      - Password authentication setup
      - OAuth integration (if any)
      - Multi-factor authentication
      - Rate limiting on auth endpoints
      
   c) Authorization Patterns:
      - Role-based access control (RBAC)
      - Permission checking middleware
      - Resource-based permissions
      
   d) Security Hardening:
      - CSRF protection enabled?
      - Secure cookie flags
      - Password hashing config (bcrypt rounds)
      - Brute force protection
   ```

3. **Drizzle ORM Patterns**:
   ```
   Call Context7:get-library-docs "/drizzle-team/drizzle-orm" topic="best-practices"
   
   Analyze:
   a) Schema Organization:
      ```
      Good: Feature-based schemas
      apps/api/src/db/schema/
        ├── users.ts
        ├── posts.ts
        └── comments.ts
      
      Each with: table definition, relations, types export
      ```
   
   b) Query Patterns:
      - Using query builder vs SQL
      - Proper join usage
      - Select optimization (specific columns)
      - Where clause patterns
      
      Anti-patterns to detect:
      ```typescript
      // Bad: N+1 queries
      const users = await db.select().from(users)
      for (const user of users) {
        const posts = await db.select().from(posts)
          .where(eq(posts.userId, user.id))
      }
      
      // Good: Single query with join
      const users = await db.select()
        .from(users)
        .leftJoin(posts, eq(posts.userId, users.id))
      ```
   
   c) Migration Strategy:
      - Are migrations version controlled?
      - Rollback strategy?
      - Data migration patterns?
      
   d) Type Safety:
      - Using InferModel for types?
      - Zod schema integration?
      - Type-safe query results?
   ```

4. **React Component Patterns**:
   ```
   Call Context7:get-library-docs "react.dev" topic="best-practices"
   
   Analyze:
   a) Component Organization:
      - Container/Presentational split?
      - Feature-based folders?
      - Shared components library?
      
   b) State Management:
      - Local state (useState)
      - Server state (React Query/SWR?)
      - Global state (Context/Zustand?)
      
   c) Performance Patterns:
      - React.memo usage
      - useMemo/useCallback optimization
      - Code splitting (React.lazy)
      - Virtualization for lists
      
   d) Hook Patterns:
      - Custom hooks for logic reuse
      - Hook dependency arrays
      - Effect cleanup patterns
   ```

5. **Validation Patterns (Zod)**:
   ```
   Check for:
   a) Schema Reuse:
      - Shared schemas in libs/
      - Schema composition
      - Branded types
      
   b) API Validation:
      - Input validation on all routes
      - Output validation
      - Error message customization
      
   c) Type Inference:
      - Using z.infer<typeof schema>
      - Zod to TypeScript consistency
   ```

6. **Monorepo Patterns (NX)**:
   ```
   Call Context7:get-library-docs "/nrwl/nx" topic="workspace-structure"
   
   Validate structure:
   ```
   workspace/
   ├── apps/
   │   ├── api/          (backend)
   │   └── web/          (frontend)
   ├── libs/
   │   ├── shared/
   │   │   ├── types/    (shared TypeScript types)
   │   │   ├── utils/    (utilities)
   │   │   └── ui/       (shared components)
   │   └── features/     (feature libraries)
   └── tools/            (build tools)
   ```
   
   Check:
   - Proper app vs lib usage
   - Buildable libraries
   - Shared code extraction
   - Dependency graph health
   ```

7. **Testing Patterns**:
   ```
   Check for:
   - Using bun:test
   - Test organization (co-located vs separate)
   - Integration test patterns
   - E2E test strategy
   - Mocking patterns (Better-auth, Drizzle)
   ```

**OUTPUT**:
{
  patterns: {
    hono: {used[], recommended[], antiPatterns[]},
    betterAuth: {used[], recommended[], antiPatterns[]},
    drizzle: {used[], recommended[], antiPatterns[]},
    react: {used[], recommended[], antiPatterns[]},
    nx: {used[], recommended[], antiPatterns[]},
    zod: {used[], recommended[], antiPatterns[]}
  },
  architectureStyle: {
    detected: string,
    compliance: number,
    deviations: []
  },
  codeOrganization: {
    score: number,
    strengths: [],
    improvements: []
  }
}
```

#### Agent 3: Complexity & Maintainability Analyzer
```
Comprehensive complexity analysis with actionable insights: [TARGET]

**WHY**: High complexity is the #1 predictor of bugs and slow development. By identifying complexity hotspots early, we can refactor before they become problems.

**HOW**:

1. **Structural Complexity Analysis**:
   ```
   For each module/file:
   
   a) Coupling Metrics:
      - Afferent Coupling (Ca): How many modules depend on this
      - Efferent Coupling (Ce): How many modules this depends on
      - Instability (I = Ce / (Ce + Ca)): 0 = stable, 1 = unstable
      
      **WHY**: High instability + high dependents = fragile architecture
      
      Calculate:
      - Modules with I > 0.7 and Ca > 5 (unstable + heavily depended upon)
      - These are your "fragile" modules - prioritize refactoring
   
   b) Cohesion Analysis:
      - LCOM (Lack of Cohesion of Methods)
      - Related functions grouped together?
      - Single Responsibility Principle adherence
      
      **HOW**: Count shared field usage between methods
      Low cohesion = module doing too many things
   
   c) Cyclomatic Complexity:
      - Count decision points (if, while, for, switch, &&, ||)
      - Per function and aggregate
      
      Thresholds:
      - 1-10: Simple, easy to test
      - 11-20: Moderate complexity
      - 21-50: High complexity, needs refactoring
      - 50+: Untestable, immediate action
      
      **WHY**: High cyclomatic complexity = hard to test, hard to understand
   
   d) Abstraction Levels:
      - Mixing low-level and high-level operations?
      - Proper use of helper functions?
      - Command-query separation?
   ```

2. **Data Flow Complexity**:
   ```
   Analyze:
   a) State Management Complexity:
      - Number of state variables
      - State update patterns
      - State synchronization points
      
      For React:
      - Props drilling depth
      - Context usage (how many contexts?)
      - Global state management
      
      Red flags:
      - Props passed through >3 levels
      - >5 useState in single component
      - Bi-directional data flow
   
   b) Data Transformation Layers:
      - DTO → Entity transformations
      - API response mapping
      - Database query result mapping
      
      Check for:
      - Consistent transformation patterns
      - Type safety in transformations
      - Unnecessary transformations
   
   c) Event/Message Flow:
      - Event emitters usage
      - Event handler complexity
      - Event propagation depth
   ```

3. **Integration Complexity**:
   ```
   a) API Surface Analysis:
      - Number of public endpoints
      - Endpoint complexity (params, body, query)
      - Response variety
      
      Calculate API complexity score:
      ```typescript
      score = 
        (endpoints * avgParamsPerEndpoint) +
        (uniqueResponseShapes * 2) +
        (authVariations * 3)
      ```
   
   b) Database Complexity:
      - Table count
      - Relation complexity (many-to-many, polymorphic)
      - Query complexity (joins, subqueries)
      - Index coverage
      
      Call Context7:get-library-docs "/drizzle-team/drizzle-orm" topic="schema-design"
      
      Analyze:
      - Over-normalized vs under-normalized
      - Proper use of indexes
      - Query optimization opportunities
   
   c) External Dependencies:
      - Third-party APIs
      - Authentication providers
      - Payment gateways
      - Analytics services
      
      Risk assessment:
      - How many external points of failure?
      - Timeout handling?
      - Retry logic?
      - Fallback strategies?
   
   d) Service Interaction Complexity:
      - Synchronous vs asynchronous calls
      - Error propagation
      - Transaction boundaries
      - Distributed data consistency
   ```

4. **Cognitive Complexity Analysis**:
   ```
   **WHY**: Cognitive complexity measures "mental effort to understand code"
   Unlike cyclomatic complexity, it penalizes nested structures more heavily.
   
   Calculate using Sonar's cognitive complexity:
   - Linear code flow: +0
   - if, else if, else, ternary: +1 (+1 for nesting)
   - switch: +1
   - for, while, do-while: +1 (+1 for nesting)
   - break, continue: +1
   - catch: +1 (+1 for nesting)
   - Nested functions: +1 per level
   
   Identify:
   - Functions with CC > 15
   - Deeply nested code (>3 levels)
   - Long parameter lists (>5 params)
   - Long functions (>50 lines)
   
   For each hotspot:
   - Show the offending code
   - Explain why it's complex
   - Provide refactoring strategy
   - Show before/after example
   ```

5. **Documentation & Onboarding Complexity**:
   ```
   Assess:
   - README quality (each package)
   - Inline documentation
   - Architecture diagrams existence
   - Setup complexity (steps to run)
   - Learning curve (new tech stack items)
   
   Calculate "Onboarding Score":
   - Time to first successful build
   - Number of setup steps
   - Documentation completeness
   - Example code availability
   ```

6. **Technical Debt Quantification**:
   ```
   Calculate Technical Debt Index:
   
   TDI = 
     (TODO comments × 1) +
     (FIXME comments × 2) +
     (Hack comments × 3) +
     (Deprecated usage × 5) +
     (Outdated dependencies × 10) +
     (Missing tests in critical paths × 20) +
     (Known security vulnerabilities × 50)
   
   Group by:
   - Quick wins (< 2 hours)
   - Medium effort (< 1 day)
   - Large refactors (> 1 day)
   
   Prioritize by:
   - Impact (how many users/features affected)
   - Risk (probability of failure)
   - Effort (time to fix)
   ```

**OUTPUT**:
{
  complexityHotspots: [{
    file: string,
    function: string,
    cyclomaticComplexity: number,
    cognitiveComplexity: number,
    lineCount: number,
    issueExplanation: string,
    refactoringStrategy: {
      approach: string,
      steps: string[],
      estimatedEffort: string,
      beforeCode: string,
      afterCode: string,
      benefits: string[]
    }
  }],
  maintainabilityIndex: {
    overall: number,
    byModule: {},
    trends: string
  },
  technicalDebt: {
    totalIndex: number,
    items: [{
      type: string,
      severity: string,
      location: string,
      effort: string,
      priority: string,
      howToFix: string
    }],
    quickWins: [],
    weekendProjects: [],
    epicRefactors: []
  }
}
```

#### Agent 4: Performance & Security Analyzer
```
Analyze performance and security with stack-specific checks: [TARGET]

**WHY**: Performance and security issues are often architectural. Catching them early prevents costly rewrites and security incidents.

**HOW**:

1. **Bun Runtime Performance**:
   ```
   Check:
   a) Leveraging Bun's Performance:
      - Using Bun.file() for file operations?
      - Leveraging bun:sqlite for dev DB?
      - Using native bun APIs vs npm packages?
      
      Example optimizations:
      ```typescript
      // Slow (Node.js fs)
      import fs from 'fs'
      const data = fs.readFileSync('file.txt', 'utf8')
      
      // Fast (Bun native)
      const file = Bun.file('file.txt')
      const data = await file.text()
      ```
   
   b) Module Resolution:
      - Proper use of bun's module cache
      - Avoiding dynamic requires
      - Tree-shaking opportunities
   ```

2. **Hono Performance Patterns**:
   ```
   Call Context7:get-library-docs "/llmstxt/hono_dev_llms_txt" topic="performance"
   
   Analyze:
   a) Middleware Performance:
      - Heavy middleware early in chain?
      - Async middleware blocking?
      - Proper caching headers?
      
   b) Response Optimization:
      - Streaming responses for large data?
      - Compression middleware?
      - Response caching?
      
   c) Route Performance:
      - Hot paths identified?
      - Database query efficiency?
      - N+1 query prevention?
   ```

3. **Database Performance (Drizzle + Postgres)**:
   ```
   Call Context7:get-library-docs "/drizzle-team/drizzle-orm" topic="performance"
   
   Analyze:
   a) Query Performance:
      - Missing indexes scan
      - Full table scans
      - Inefficient joins
      - Subquery optimization
      
      **HOW**: Parse query patterns and suggest indexes:
      ```typescript
      // Detect pattern
      where(eq(users.email, email))
      
      // Suggest index
      index('email_idx').on(users.email)
      ```
   
   b) Connection Pooling:
      - Pool size configuration
      - Connection leaks
      - Timeout settings
      
   c) ORM Usage:
      - Selecting unnecessary columns?
      - Eager loading vs lazy loading?
      - Batch operations usage?
   ```

4. **React Performance**:
   ```
   Scan for:
   a) Render Performance:
      - Missing React.memo on expensive components
      - Inline object creation in props
      - Inline function creation
      - Unnecessary context updates
      
      Example issues:
      ```typescript
      // Bad: Re-renders on every parent render
      <ExpensiveList items={data.filter(x => x.active)} />
      
      // Good: Memoized
      const activeItems = useMemo(() => 
        data.filter(x => x.active), [data]
      )
      <ExpensiveList items={activeItems} />
      ```
   
   b) Bundle Size:
      - Large components not code-split
      - Unused dependencies
      - Duplicate dependencies
      
   c) Data Fetching:
      - Waterfall requests
      - Overfetching data
      - No caching strategy
   ```

5. **Security Analysis**:
   ```
   a) Authentication Security (Better-Auth):
      Call Better Auth:search "security best practices"
      
      Check:
      - Session hijacking prevention
      - CSRF tokens
      - Secure cookie configuration
      - Password policy enforcement
      - Rate limiting
      - Brute force protection
      
      Verify implementation:
      ```typescript
      // Look for
      auth.config.session.cookie.secure = true
      auth.config.session.cookie.httpOnly = true
      auth.config.session.cookie.sameSite = 'strict'
      ```
   
   b) API Security:
      - Input validation (Zod on all inputs?)
      - SQL injection prevention (using parameterized queries?)
      - XSS prevention
      - CORS configuration
      - Rate limiting
      
   c) Data Security:
      - Sensitive data in logs?
      - PII handling
      - Encryption at rest
      - Secure data transmission (HTTPS)
      
   d) Dependency Security:
      - Run bun audit
      - Check for known vulnerabilities
      - Outdated packages
   ```

6. **Scalability Analysis**:
   ```
   Identify bottlenecks:
   a) Database:
      - Will current schema scale to 10M rows?
      - Index strategy for growth?
      - Partition strategy?
      
   b) Application:
      - Stateless design?
      - Horizontal scaling ready?
      - Caching strategy?
      - Background job processing?
      
   c) Frontend:
      - Pagination vs infinite scroll?
      - Virtual scrolling for lists?
      - Progressive loading?
   ```

**OUTPUT**:
{
  performanceIssues: [{
    type: string,
    severity: 'critical' | 'high' | 'medium' | 'low',
    location: string,
    impact: string,
    fix: {
      description: string,
      codeExample: string,
      estimatedGain: string
    }
  }],
  securityIssues: [{
    type: string,
    severity: 'critical' | 'high' | 'medium' | 'low',
    location: string,
    vulnerability: string,
    fix: {
      description: string,
      codeExample: string,
      references: string[]
    }
  }],
  scalabilityAssessment: {
    currentCapacity: string,
    bottlenecks: [],
    recommendations: []
  }
}
```

### Stage 2: Synthesis & Strategy Agent

```
Synthesize all analysis into comprehensive architecture report: [ALL_AGENT_RESULTS]

**WHY**: Individual analyses are valuable, but the real power comes from seeing patterns across all dimensions and creating a cohesive improvement strategy.

**HOW**:

1. **Cross-Reference Issues**:
   ```
   Find relationships:
   - Performance issue caused by architectural coupling?
   - Security gap due to complexity?
   - Pattern violation leading to bugs?
   
   Example synthesis:
   "The circular dependency between UserService and AuthService (Agent 1) 
   is causing the authentication middleware to reload on every request 
   (Agent 4 performance issue), which is implemented as an anti-pattern 
   (Agent 2). Fixing this will improve security, performance, and maintainability."
   ```

2. **Prioritize Improvements**:
   ```
   Create priority matrix:
   
   Impact vs Effort:
   - Quick Wins (High Impact, Low Effort)
   - Strategic (High Impact, High Effort)
   - Fill-ins (Low Impact, Low Effort)
   - Avoid (Low Impact, High Effort)
   
   For each improvement:
   - Estimated effort (hours/days)
   - Expected impact (%)
   - Dependencies (what must be done first)
   - Risk level
   ```

3. **Create Implementation Roadmap**:
   ```
   Phase 1 - Foundation (Week 1-2):
   - Fix critical security issues
   - Resolve blocking circular dependencies
   - Add missing indexes
   
   Phase 2 - Architecture (Week 3-4):
   - Implement proper layering
   - Extract shared libraries
   - Establish NX boundaries
   
   Phase 3 - Optimization (Week 5-6):
   - Performance improvements
   - Complex refactors
   - Testing coverage
   
   Phase 4 - Polish (Week 7-8):
   - Documentation
   - Developer experience
   - Monitoring & observability
   ```

4. **Generate Migration Guides**:
   ```
   For major refactors, create step-by-step guides:
   
   Example: "Breaking UserService ↔ AuthService circular dependency"
   
   Step 1: Create interface (2 hours)
   ```typescript
   // libs/shared/interfaces/src/auth.interface.ts
   export interface IAuthProvider {
     validateSession(token: string): Promise<User | null>
     refreshToken(refreshToken: string): Promise<string>
   }
   ```
   
   Step 2: Implement in AuthService (1 hour)
   ```typescript
   export class AuthService implements IAuthProvider {
     // ... implementation
   }
   ```
   
   Step 3: Update UserService to depend on interface (2 hours)
   ```typescript
   export class UserService {
     constructor(private auth: IAuthProvider) {}
   }
   ```
   
   Step 4: Update DI container (1 hour)
   Step 5: Test (2 hours)
   ```

5. **Create Architecture Decision Records (ADRs)**:
   ```
   For each major recommendation:
   
   # ADR-001: Implement Hexagonal Architecture
   
   ## Status
   Proposed
   
   ## Context
   - Current layering violations (15 instances)
   - Business logic tied to Hono framework
   - Difficult to test without HTTP layer
   
   ## Decision
   Implement hexagonal architecture with:
   - Domain core (pure business logic)
   - Ports (interfaces)
   - Adapters (Hono, Drizzle, Better-auth)
   
   ## Consequences
   Positive:
   - Testable business logic
   - Framework independence
   - Clear boundaries
   
   Negative:
   - More abstraction
   - Learning curve
   - Initial refactoring effort (3-4 days)
   ```

**OUTPUT**:
{
  executiveSummary: string,
  healthScore: number,
  criticalIssues: [],
  improvementRoadmap: {
    quickWins: [],
    strategicInitiatives: [],
    longTermGoals: []
  },
  architectureDecisions: [],
  migrationGuides: [],
  estimatedEffort: string,
  expectedBenefits: []
}
```

### Stage 3: Visualization & Documentation Agent

```
Generate comprehensive visual documentation: [SYNTHESIS_RESULTS] [ARCHITECTURE_DATA]

**WHY**: Diagrams are worth a thousand words. Visual documentation helps teams understand architecture faster and makes design discussions more productive.

**HOW**:

1. **Current State Diagram**:
   ```
   Generate Mermaid diagram showing:
   - All major components
   - Dependencies (color-coded by health)
   - Layer violations (red dashed lines)
   - Circular dependencies (highlighted)
   - NX project boundaries
   
   Example:
   ```mermaid
   graph TB
     subgraph "Apps"
       API[API - Hono App]
       WEB[Web - React App]
     end
     
     subgraph "Shared Libs"
       TYPES[Types Library]
       UI[UI Components]
       UTILS[Utils]
     end
     
     subgraph "Feature Libs"
       AUTH[Auth Feature]
       USERS[Users Feature]
       POSTS[Posts Feature]
     end
     
     subgraph "Infrastructure"
       DB[(Postgres + Drizzle)]
       CACHE[(Redis)]
       S3[File Storage]
     end
     
     WEB --> API
     WEB --> UI
     WEB --> TYPES
     
     API --> AUTH
     API --> USERS
     API --> POSTS
     API --> TYPES
     
     AUTH --> DB
     USERS --> DB
     POSTS --> DB
     
     AUTH -.->|VIOLATION| USERS
     USERS -.->|CIRCULAR| AUTH
     
     style AUTH fill:#f96
     style USERS fill:#f96
   ```mermaid
   ```

2. **Target State Diagram**:
   ```
   Show the improved architecture:
   - Proper layering
   - No circular dependencies
   - Clean NX boundaries
   - Optimized data flow
   ```

3. **Sequence Diagrams for Critical Flows**:
   ```
   For important user journeys:
   - Authentication flow
   - CRUD operations
   - Complex business processes
   
   Example:
   ```mermaid
   sequenceDiagram
     participant U as User
     participant W as Web App
     participant A as API
     participant Auth as Better-Auth
     participant DB as Database
     
     U->>W: Login (email, password)
     W->>A: POST /api/auth/login
     A->>Auth: validateCredentials()
     Auth->>DB: findUserByEmail()
     DB-->>Auth: User data
     Auth->>Auth: verifyPassword()
     Auth->>DB: createSession()
     Auth-->>A: Session token
     A-->>W: {token, user}
     W->>W: Store token
     W-->>U: Redirect to dashboard
   ```mermaid
   ```

4. **Component Dependency Graph**:
   ```
   Generate D3.js-style force-directed graph:
   - Nodes = components
   - Edges = dependencies
   - Size = LOC
   - Color = coupling score
   - Clustering by domain
   ```

5. **Performance Flamegraph**:
   ```
   If performance profiling data available:
   - Request processing time breakdown
   - Database query time
   - External API calls
   ```

6. **Security Architecture Diagram**:
   ```
   Show:
   - Trust boundaries
   - Authentication points
   - Data encryption points
   - Attack surfaces
   ```

**OUTPUT**: Multiple diagram files in /mnt/user-data/outputs/diagrams/
```

### Stage 4: Example Collection Agent

```
Find and analyze real-world examples: [SYNTHESIS_RESULTS]

**WHY**: Learning from production implementations is faster than inventing solutions. Real examples show edge cases and patterns that work at scale.

**HOW**:

1. **Search for Similar Projects**:
   ```
   Web search for:
   - "hono + drizzle + better-auth production"
   - "nx monorepo typescript best practices"
   - "bun runtime architecture examples"
   
   GitHub search:
   - repos with all our stack components
   - high star count (>100)
   - recent activity (updated <6 months)
   ```

2. **Analyze Found Examples**:
   ```
   For each example project:
   
   a) Fetch key files:
      - package.json
      - nx.json
      - Route structure
      - Schema organization
      
   b) Extract patterns:
      - How they structure Hono routes
      - Drizzle schema organization
      - Better-auth configuration
      - NX workspace setup
      
   c) Document insights:
      ```
      Example: github.com/user/project
      
      Key insights:
      - Uses feature-based route grouping
      - Separates schemas by domain
      - Custom auth middleware pattern:
        [code snippet]
      - Interesting pagination helper:
        [code snippet]
      ```
   ```

3. **Create Pattern Library**:
   ```
   Catalog reusable patterns:
   
   Pattern: "Hono Auth Middleware with Better-Auth"
   Source: [GitHub URL]
   Use case: Protect routes with type-safe auth
   
   Implementation:
   ```typescript
   // [actual code from example]
   ```
   
   Why it's good:
   - Type-safe user context
   - Reusable across routes
   - Handles errors gracefully
   ```

4. **Benchmark Against Examples**:
   ```
   Compare our project to examples:
   - Similar complexity?
   - Better or worse organization?
   - What can we learn?
   ```

**OUTPUT**:
{
  examples: [{
    url: string,
    description: string,
    relevantPatterns: [],
    codeSnippets: [],
    applicability: string
  }],
  patternLibrary: [],
  benchmarkComparison: {}
}
```

## Enhanced Output Format

### 1. Executive Summary
```markdown
# Architecture Analysis Report
Generated: [DATE]
Target: [PROJECT_PATH]
Overall Health: 73/100 🟡

## Quick Stats
- 🎯 Stack Compliance: 78%
- 🔗 Circular Dependencies: 3 (High Priority)
- ⚡ Performance Issues: 12 (2 Critical)
- 🔒 Security Issues: 5 (1 Critical)
- 📊 Technical Debt Index: 127 (Medium)

## Critical Actions Needed (Next 48 Hours)
1. Fix SQL injection vulnerability in POST /api/users (2 hours)
2. Add missing index on users.email (15 minutes)
3. Enable CSRF protection in Better-auth (30 minutes)

## This Week's Focus
- Break UserService ↔ AuthService circular dependency
- Implement proper error boundaries in Hono
- Extract shared types to libs/shared/types

## Next Month's Strategic Work
- Migrate to hexagonal architecture
- Implement proper NX boundaries
- Performance optimization sprint
```

### 2. Detailed Stack Health Report
```markdown
# Stack-Specific Health Analysis

## Bun Runtime ✅ 92/100
**Strengths:**
- ✅ Using Bun.file() for all file operations
- ✅ Leveraging native APIs
- ✅ Proper bunfig.toml configuration

**Improvements:**
- ⚠️ Still using some Node.js fs operations (3 files)
  - **Where**: `src/utils/file-handler.ts:45`
  - **Why fix**: 3-5x slower than Bun.file()
  - **How to fix**:
    ```typescript
    // Current (slow)
    import fs from 'fs'
    const data = fs.readFileSync('data.json', 'utf8')
    
    // Improved (fast)
    const file = Bun.file('data.json')
    const data = await file.text()
    ```
  - **Effort**: 30 minutes
  - **Gain**: 3x faster file operations

## Hono Framework ⚠️ 68/100
**Strengths:**
- ✅ Proper route organization
- ✅ Type-safe context usage

**Critical Issues:**
1. **Middleware Ordering Violation** (Critical)
   - **Location**: `src/app.ts:34-45`
   - **Issue**: Error handler registered AFTER routes
   - **Impact**: Unhandled errors crash the app
   - **Example of problem**:
     ```typescript
     // Current (WRONG)
     app.get('/users', getUsers)  // If this errors...
     app.onError((err, c) => {...}) // ...this won't catch it
     ```
   - **Fix**:
     ```typescript
     // Correct order
     app.onError((err, c) => {
       console.error(err)
       return c.json({error: err.message}, 500)
     })
     app.get('/users', getUsers) // Now errors are caught
     ```
   - **Why this matters**: In production, unhandled errors = downtime
   - **Effort**: 5 minutes
   - **References**: [Hono error handling docs](link)

2. **Missing Input Validation** (High)
   - **Routes affected**: 8 POST/PUT endpoints
   - **Example**: `POST /api/users` has no validation
   - **Attack vector**: Malformed input can crash server
   - **Fix using Zod + Hono**:
     ```typescript
     import { zValidator } from '@hono/zod-validator'
     
     const userSchema = z.object({
       email: z.string().email(),
       name: z.string().min(2).max(50)
     })
     
     app.post('/users', 
       zValidator('json', userSchema),
       async (c) => {
         const user = c.req.valid('json') // Type-safe!
         // ... handle user creation
       }
     )
     ```
   - **Effort per route**: 15 minutes
   - **Total effort**: 2 hours
   - **Reference**: [Context7 Hono docs - validation](use Context7 MCP)

## Better-Auth 🔴 54/100
**Critical Security Issues:**

1. **CSRF Protection Disabled** (Critical)
   - **Location**: `src/auth/config.ts`
   - **Current config**:
     ```typescript
     export const auth = betterAuth({
       csrf: false // ⚠️ DANGER
     })
     ```
   - **Attack scenario**: 
     ```
     User visits malicious.com
     → Malicious site makes request to your API
     → User's session cookie sent automatically
     → Unauthorized action performed
     ```
   - **Fix**:
     ```typescript
     export const auth = betterAuth({
       csrf: {
         enabled: true,
         token: {
           name: 'csrf-token',
           check: true
         }
       }
     })
     ```
   - **Client-side handling**:
     ```typescript
     // Get CSRF token from cookie
     const csrfToken = document.cookie
       .split('; ')
       .find(row => row.startsWith('csrf-token='))
       ?.split('=')[1]
     
     // Include in requests
     fetch('/api/auth/login', {
       headers: {
         'x-csrf-token': csrfToken
       }
     })
     ```
   - **Effort**: 1 hour
   - **References**: [Better-Auth security guide](use Better-Auth MCP)

2. **Weak Session Configuration** (High)
   - **Issues**:
     - Session expiry: 30 days (too long)
     - No session refresh strategy
     - Cookies not marked secure
   - **Recommended config**:
     ```typescript
     export const auth = betterAuth({
       session: {
         expiresIn: 60 * 60 * 24 * 7, // 7 days
         updateAge: 60 * 60 * 24, // Refresh daily
         cookie: {
           secure: true, // HTTPS only
           httpOnly: true, // No JS access
           sameSite: 'strict', // CSRF protection
           domain: process.env.COOKIE_DOMAIN
         }
       }
     })
     ```
   - **Why shorter sessions**: Limits damage from session theft
   - **Why session refresh**: Keeps active users logged in
   - **Effort**: 30 minutes

## Drizzle ORM ⚠️ 71/100
**Strengths:**
- ✅ Good schema organization
- ✅ Type-safe queries

**Performance Issues:**

1. **Missing Indexes** (High Impact)
   - **Analysis**: Scanned all queries, found unindexed columns
   - **Missing indexes**:
     ```typescript
     // users table
     where(eq(users.email, email)) // ← Used in 15 places, NO INDEX!
     
     // posts table
     where(eq(posts.userId, userId)) // ← Used in 8 places, NO INDEX!
     where(eq(posts.status, 'published')) // ← Used in 12 places, NO INDEX!
     ```
   - **Impact**: Full table scan on every query
     - Current: ~200ms for user lookup
     - With index: ~5ms (40x faster!)
   - **Fix**:
     ```typescript
     // In schema/users.ts
     export const users = pgTable('users', {
       id: serial('id').primaryKey(),
       email: text('email').notNull().unique(),
       // ...
     }, (table) => ({
       emailIdx: index('email_idx').on(table.email), // ← ADD THIS
     }))
     
     // In schema/posts.ts
     export const posts = pgTable('posts', {
       // ...
     }, (table) => ({
       userIdIdx: index('user_id_idx').on(table.userId),
       statusIdx: index('status_idx').on(table.status),
       // Composite for common query
       userStatusIdx: index('user_status_idx')
         .on(table.userId, table.status),
     }))
     ```
   - **Migration**:
     ```bash
     bun drizzle-kit generate
     bun drizzle-kit migrate
     ```
   - **Effort**: 15 minutes
   - **Verification**: Run `EXPLAIN ANALYZE` on queries
   - **Reference**: [Drizzle indexing guide](use Context7)

2. **N+1 Query Pattern** (Medium Impact)
   - **Location**: `src/services/posts.service.ts:getUserPosts()`
   - **Current (bad)**:
     ```typescript
     async getUserPosts(userId: string) {
       const posts = await db.select()
         .from(posts)
         .where(eq(posts.userId, userId))
       
       // N+1: One query per post!
       for (const post of posts) {
         post.comments = await db.select()
           .from(comments)
           .where(eq(comments.postId, post.id))
       }
       
       return posts
     }
     ```
   - **Problem**: For 100 posts = 101 queries!
   - **Fixed (good)**:
     ```typescript
     async getUserPosts(userId: string) {
       // Single query with join
       const result = await db.select({
         post: posts,
         comment: comments
       })
       .from(posts)
       .leftJoin(comments, eq(comments.postId, posts.id))
       .where(eq(posts.userId, userId))
       
       // Group by post
       const postsMap = new Map()
       for (const row of result) {
         if (!postsMap.has(row.post.id)) {
           postsMap.set(row.post.id, {
             ...row.post,
             comments: []
           })
         }
         if (row.comment) {
           postsMap.get(row.post.id).comments.push(row.comment)
         }
       }
       
       return Array.from(postsMap.values())
     }
     ```
   - **Performance gain**: 101 queries → 1 query
   - **Effort**: 1 hour
   - **Reference**: [Drizzle joins & relations](use Context7)

[Continue for each technology in stack...]
```

### 3. Architecture Improvement Roadmap

```markdown
# Improvement Roadmap

## Phase 1: Critical Fixes (This Week)

### Day 1-2: Security Hardening
**Goal**: Eliminate critical security vulnerabilities

**Tasks:**
1. ✅ Enable CSRF protection (1 hour)
   - Files to modify: `src/auth/config.ts`
   - [Step-by-step guide above]
   - Test: Run security audit script
   - Success criteria: CSRF tests pass

2. ✅ Fix SQL injection vulnerability (2 hours)
   - Location: `src/api/users.ts:createUser`
   - Issue: Raw SQL concatenation
   - [Detailed fix above]
   - Test: Run SQL injection test suite
   - Success criteria: No raw SQL queries found

3. ✅ Secure cookie configuration (30 min)
   - [Configuration shown above]

**Total effort**: 3.5 hours
**Impact**: Prevents security incidents
**Owner**: Backend team

### Day 3-4: Performance Quick Wins
**Goal**: 10x improvement on hot paths

**Tasks:**
1. ✅ Add database indexes (15 min)
   - [Indexes listed above]
   - Expected gain: 40x faster queries

2. ✅ Fix N+1 queries (2 hours)
   - [Refactoring shown above]
   - Expected gain: 100x reduction in DB calls

3. ✅ Implement response caching (1 hour)
   ```typescript
   import { cache } from 'hono/cache'
   
   app.get('/api/posts/popular',
     cache({
       cacheName: 'popular-posts',
       cacheControl: 'max-age=60', // 1 minute
     }),
     getPopularPosts
   )
   ```

**Total effort**: 3.25 hours
**Impact**: Handles 10x more traffic
**Owner**: Backend team

### Day 5: Break Circular Dependencies
**Goal**: Eliminate architectural coupling

**Task**: Break UserService ↔ AuthService cycle
- [Full implementation guide above]
- Effort: 6 hours
- Impact: Cleaner architecture, easier testing

**Total Phase 1**: ~13 hours (~2 days)

## Phase 2: Architectural Improvements (Week 2-3)

### Week 2: Layer Architecture
**Goal**: Proper separation of concerns

**Tasks:**
1. Define clear layers (4 hours)
   ```
   Presentation (React + Hono routes)
     ↓
   Application (Services, Use cases)
     ↓
   Domain (Business logic, Models)
     ↓
   Infrastructure (Drizzle, Better-auth, APIs)
   ```

2. Extract domain logic (16 hours)
   - Move business rules out of routes
   - Create domain services
   - Implement repository pattern

3. Set up dependency injection (8 hours)
   ```typescript
   // Create DI container
   import { Container } from 'inversify'
   
   const container = new Container()
   container.bind<IAuthService>(TYPES.AuthService)
     .to(BetterAuthService)
   container.bind<IUserRepository>(TYPES.UserRepository)
     .to(DrizzleUserRepository)
   ```

**Total**: ~28 hours (~4 days)

### Week 3: NX Boundaries
**Goal**: Enforce module isolation

**Tasks:**
1. Tag all projects (2 hours)
   ```json
   // apps/api/project.json
   {
     "tags": ["type:app", "scope:backend"]
   }
   
   // libs/features/auth/project.json
   {
     "tags": ["type:feature", "scope:backend"]
   }
   ```

2. Set up boundary rules (2 hours)
   ```json
   // .eslintrc.json
   {
     "rules": {
       "@nx/enforce-module-boundaries": [
         "error",
         {
           "depConstraints": [
             {
               "sourceTag": "scope:frontend",
               "onlyDependOnLibsWithTags": [
                 "scope:frontend",
                 "scope:shared"
               ]
             },
             {
               "sourceTag": "type:feature",
               "onlyDependOnLibsWithTags": [
                 "type:data-access",
                 "type:util"
               ]
             }
           ]
         }
       ]
     }
   }
   ```

3. Refactor violations (16 hours)
   - Move shared code to libs
   - Fix cross-boundary imports
   - Extract common utilities

**Total**: ~20 hours (~3 days)

## Phase 3: Optimization Sprint (Week 4-5)

[Detailed breakdown of performance optimizations...]

## Phase 4: Developer Experience (Week 6)

[Detailed breakdown of DX improvements...]

## Success Metrics

**Week 1:**
- ✅ 0 critical security issues
- ✅ Average response time < 100ms
- ✅ 0 circular dependencies

**Week 2:**
- ✅ All business logic in domain layer
- ✅ 0 layer violations
- ✅ 80% test coverage on domain

**Week 3:**
- ✅ 0 NX boundary violations
- ✅ Successful dependency graph visualization
- ✅ Sub-10s cold start time

**End of Month:**
- ✅ Architecture health score > 85
- ✅ Technical debt index < 50
- ✅ All critical/high issues resolved
```

### 4. Example-Based Learning Guide

```markdown
# Real-World Implementation Examples

## Example 1: Production Hono + Better-Auth App
**Source**: github.com/example/production-app
**Stars**: 1.2k | **Last Updated**: 2 weeks ago

### What We Can Learn

#### Auth Middleware Pattern
They use a reusable auth middleware factory:

```typescript
// From: src/middleware/auth.ts
import { betterAuth } from 'better-auth'
import { createMiddleware } from 'hono/factory'

export const requireAuth = () => {
  return createMiddleware(async (c, next) => {
    const session = await betterAuth.api.getSession({
      headers: c.req.raw.headers
    })
    
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Type-safe user in context
    c.set('user', session.user)
    c.set('session', session.session)
    
    await next()
  })
}

// Usage
app.get('/api/protected', 
  requireAuth(), 
  async (c) => {
    const user = c.get('user') // Fully typed!
    return c.json({ user })
  }
)
```

**Why this is good**:
- Reusable across routes
- Type-safe context
- Clear error handling
- Easy to test

**How to apply to our project**:
1. Create `src/middleware/auth.ts`
2. Copy and adapt the pattern
3. Replace ad-hoc auth checks
4. Add types to Hono app

**Effort**: 2 hours
**Impact**: Cleaner, more secure auth

#### Drizzle Schema Organization
They organize schemas by domain:

```
src/db/schema/
├── index.ts          # Re-exports all
├── users.ts          # User + Profile
├── auth.ts           # Sessions, Tokens
├── content.ts        # Posts, Comments
└── relations.ts      # Cross-schema relations
```

Each file:
```typescript
// users.ts
export const users = pgTable('users', {...})
export const profiles = pgTable('profiles', {...})

export const usersRelations = relations(users, ({one, many}) => ({
  profile: one(profiles),
  posts: many(posts)
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

**Why this is good**:
- Clear separation
- Co-located types
- Easy to find things
- Scalable structure

**Applicable to us**: Yes, we have similar needs

## Example 2: NX Monorepo Best Practices
**Source**: github.com/nrwl/nx-examples
**Official**: Yes | **Last Updated**: Last week

### What We Can Learn

#### Project Structure Pattern
```
workspace/
├── apps/
│   ├── api/                 # Backend app
│   └── web/                 # Frontend app
├── libs/
│   ├── api/
│   │   ├── features/
│   │   │   ├── auth/       # Auth feature
│   │   │   └── users/      # Users feature
│   │   └── data-access/
│   │       └── database/   # Drizzle setup
│   ├── shared/
│   │   ├── types/          # Shared types
│   │   ├── utils/          # Utilities
│   │   └── config/         # Config
│   └── web/
│       ├── features/
│       └── ui/             # Component library
```

**Tag Strategy**:
```json
{
  "api/features/auth": ["type:feature", "scope:api"],
  "api/data-access/database": ["type:data-access", "scope:api"],
  "shared/types": ["type:util", "scope:shared"],
  "web/ui": ["type:ui", "scope:web"]
}
```

**Boundary Rules**:
- Features can depend on data-access and utils
- Apps can depend on features
- Shared libs can't depend on features
- Scopes can't cross (web → api forbidden)

**Applicable to us**: Directly! We should copy this structure

[More examples...]
```

## Custom Architecture Rules

```yaml
# .architecture-rules.yaml (Enhanced for our stack)

stack:
  runtime: bun
  backend: hono
  frontend: react
  database: drizzle
  auth: better-auth
  monorepo: nx

rules:
  # Layer Rules
  layers:
    - name: Presentation
      pattern: "apps/*/src/(routes|pages|components)/**"
      allowedDependencies: [Application, Shared]
      forbidden: [Infrastructure, Database]
      rationale: "UI should not directly access infrastructure"
      
    - name: Application
      pattern: "libs/*/features/**"
      allowedDependencies: [Domain, Shared]
      forbidden: [Presentation, Infrastructure]
      rationale: "Business logic should be framework-agnostic"
      
    - name: Domain
      pattern: "libs/*/domain/**"
      allowedDependencies: []
      forbidden: "*"
      rationale: "Core domain should have zero dependencies"
      
    - name: Infrastructure
      pattern: "libs/*/data-access/**"
      allowedDependencies: [Domain, Shared]
      forbidden: [Application, Presentation]
      rationale: "Infrastructure implements domain interfaces"

  # Stack-Specific Rules
  hono:
    - rule: "middleware-before-routes"
      severity: error
      message: "Error handlers and middleware must be registered before routes"
      
    - rule: "validate-all-inputs"
      severity: error
      message: "All POST/PUT/PATCH routes must use zValidator"
      pattern: "app.(post|put|patch)"
      requires: "zValidator"
      
    - rule: "type-safe-context"
      severity: warning
      message: "Use typed Hono context: new Hono<{Variables: T}>()"
      
  better-auth:
    - rule: "csrf-required"
      severity: error
      message: "CSRF protection must be enabled in production"
      check: "betterAuth({csrf: {enabled: true}})"
      
    - rule: "secure-cookies"
      severity: error
      message: "Session cookies must be secure in production"
      check: "cookie: {secure: true, httpOnly: true, sameSite: 'strict'}"
      
    - rule: "session-expiry"
      severity: warning
      message: "Session expiry should be < 30 days"
      check: "expiresIn <= 60 * 60 * 24 * 30"
      
  drizzle:
    - rule: "no-raw-sql"
      severity: error
      message: "Use Drizzle query builder instead of raw SQL"
      forbidden: "db.execute|sql`"
      rationale: "Prevents SQL injection, ensures type safety"
      
    - rule: "indexed-foreign-keys"
      severity: warning
      message: "Foreign keys should have indexes"
      check: "references(...) requires index()"
      
    - rule: "use-relations"
      severity: info
      message: "Consider using Drizzle relations API"
      when: "multiple leftJoin calls"
      
  nx:
    - rule: "enforce-boundaries"
      severity: error
      message: "Must define and enforce project boundaries"
      check: "@nx/enforce-module-boundaries in .eslintrc"
      
    - rule: "proper-tags"
      severity: warning
      message: "All projects must have type and scope tags"
      required_tags: ["type:*", "scope:*"]
      
  react:
    - rule: "no-inline-functions-props"
      severity: warning
      message: "Extract inline functions in props to useCallback"
      pattern: "<Component on.*={() => }"
      
  # Complexity Rules
  complexity:
    maxFileLines: 300
    maxFunctionLines: 50
    maxCyclomaticComplexity: 10
    maxCognitiveComplexity: 15
    maxDependencies: 7
    maxParameters: 4
    
  # Performance Rules
  performance:
    - rule: "no-select-star"
      message: "Select specific columns instead of *"
      pattern: "db.select()"
      suggest: "db.select({ id: table.id, name: table.name })"
      
    - rule: "index-where-clauses"
      message: "Columns in WHERE clauses should be indexed"
      severity: warning
      
  # Security Rules
  security:
    - rule: "no-secrets-in-code"
      severity: error
      pattern: "password|secret|key|token = ['\"]"
      message: "Use environment variables for secrets"
      
    - rule: "validate-before-db"
      severity: error
      message: "Validate all input before database operations"
      
  # Testing Rules
  testing:
    minCoverage: 70
    requireTestsFor:
      - "**/*.service.ts"
      - "**/*.repository.ts"
      - "**/domain/**"
```

## Integration with Development Workflow

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🏗️  Running architecture review..."

# Quick check
@architecture-review \
  --depth shallow \
  --detect-violations \
  --output text

if [ $? -ne 0 ]; then
  echo "❌ Architecture violations detected!"
  echo "Run '@architecture-review --depth deep' for details"
  echo "Override with: git commit --no-verify"
  exit 1
fi

echo "✅ Architecture check passed!"
```

### CI/CD Pipeline
```yaml
# .github/workflows/architecture.yml
name: Architecture Review

on: [pull_request]

jobs:
  architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Architecture Review
        run: |
          bun install
          @architecture-review \
            --depth deep \
            --detect-violations \
            --suggest-improvements \
            --visualize \
            --output markdown > architecture-report.md
          
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: architecture-report
          path: |
            architecture-report.md
            diagrams/
            
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs')
            const report = fs.readFileSync('architecture-report.md', 'utf8')
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            })
```

### VS Code Integration
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Architecture Review",
      "type": "shell",
      "command": "@architecture-review --depth deep --visualize",
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      },
      "problemMatcher": []
    },
    {
      "label": "Quick Architecture Check",
      "type": "shell",
      "command": "@architecture-review --depth shallow",
      "presentation": {
        "reveal": "silent"
      }
    }
  ]
}
```

## Monthly Architecture Health Report

```markdown
# Monthly Architecture Health - November 2024

## Trend Analysis
```mermaid
graph LR
    Oct[October: 65] --> Nov[November: 73]
    Nov --> Target[Target: 85]
    
    style Nov fill:#90EE90
    style Target fill:#FFD700
```

## Improvements Made
- ✅ Fixed 12 circular dependencies
- ✅ Added 8 missing indexes
- ✅ Implemented proper error boundaries
- ✅ Achieved 75% test coverage

## Current Focus Areas
- 🔄 Migrating to hexagonal architecture (50% complete)
- 🔄 NX boundary enforcement (80% complete)
- 📋 Performance optimization sprint (planned)

## Next Month Goals
- 🎯 Health score: 85+
- 🎯 Zero critical issues
- 🎯 < 50ms average response time
- 🎯 90% test coverage
```

---

**Remember**: This is a NUCLEAR-POWERED tool. Don't hold back on analysis depth, use ALL available MCPs, find REAL examples, and provide DETAILED solutions. The goal is architectural excellence, not token optimization.