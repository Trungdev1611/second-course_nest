// src/scripts/update-blogs-content.ts
import { AppDataSource } from '../config/db.config';
import { BlogEntity } from '../blogs/blog.entity';

// Dữ liệu mẫu về programming/tech để test search (100+ templates)
const blogTemplates = [
  {
    title: 'Hướng dẫn NestJS cho người mới bắt đầu',
    excerpt: 'Tìm hiểu cách xây dựng ứng dụng backend với NestJS, framework Node.js mạnh mẽ',
    content: `NestJS là một framework Node.js được xây dựng trên TypeScript, cung cấp kiến trúc modular và các tính năng mạnh mẽ cho việc phát triển ứng dụng backend. Trong bài viết này, chúng ta sẽ tìm hiểu cách cài đặt và sử dụng NestJS để tạo các API RESTful.

NestJS sử dụng decorators và dependency injection pattern, giúp code trở nên dễ đọc và dễ bảo trì. Framework này hỗ trợ nhiều tính năng như validation, authentication, database integration và nhiều hơn nữa.`
  },
  {
    title: 'TypeScript Best Practices và Tips',
    excerpt: 'Các best practices và tips hữu ích khi làm việc với TypeScript',
    content: `TypeScript là một superset của JavaScript, thêm static typing và các tính năng mạnh mẽ khác. Trong bài viết này, chúng ta sẽ khám phá các best practices để viết code TypeScript hiệu quả.

Một số tips quan trọng bao gồm: sử dụng strict mode, tận dụng type inference, sử dụng interfaces và types một cách hợp lý, và hiểu rõ về generics. TypeScript giúp phát hiện lỗi sớm trong quá trình phát triển và cải thiện trải nghiệm developer.`
  },
  {
    title: 'Elasticsearch Full-Text Search Implementation',
    excerpt: 'Cách triển khai full-text search với Elasticsearch trong ứng dụng NestJS',
    content: `Elasticsearch là một công cụ tìm kiếm phân tán mạnh mẽ, cho phép thực hiện full-text search với hiệu suất cao. Trong bài viết này, chúng ta sẽ học cách tích hợp Elasticsearch vào ứng dụng NestJS.

Chúng ta sẽ tìm hiểu về indexing documents, thực hiện các query phức tạp, sử dụng highlight để làm nổi bật kết quả tìm kiếm, và tối ưu hóa performance. Elasticsearch cung cấp nhiều tính năng như fuzzy search, phrase matching, và aggregations.`
  },
  {
    title: 'Next.js 14 App Router và Server Components',
    excerpt: 'Khám phá các tính năng mới trong Next.js 14 với App Router',
    content: `Next.js 14 mang đến nhiều cải tiến quan trọng với App Router và Server Components. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng các tính năng này để xây dựng ứng dụng web hiện đại.

Server Components cho phép render components trên server, giảm bundle size và cải thiện performance. App Router cung cấp routing dựa trên file system, giúp tổ chức code dễ dàng hơn. Chúng ta cũng sẽ tìm hiểu về data fetching, caching, và optimization strategies.`
  },
  {
    title: 'PostgreSQL Advanced Queries và Performance',
    excerpt: 'Các kỹ thuật query nâng cao và tối ưu performance trong PostgreSQL',
    content: `PostgreSQL là một relational database management system mạnh mẽ với nhiều tính năng nâng cao. Trong bài viết này, chúng ta sẽ khám phá các kỹ thuật query phức tạp và cách tối ưu hóa performance.

Chúng ta sẽ tìm hiểu về window functions, CTEs (Common Table Expressions), indexing strategies, query optimization, và cách sử dụng EXPLAIN ANALYZE để phân tích query performance. PostgreSQL cũng hỗ trợ full-text search, JSON operations, và nhiều tính năng khác.`
  },
  {
    title: 'Redis Caching Strategies cho Web Applications',
    excerpt: 'Các chiến lược caching với Redis để cải thiện performance',
    content: `Redis là một in-memory data structure store, thường được sử dụng như một cache layer để cải thiện performance của ứng dụng. Trong bài viết này, chúng ta sẽ tìm hiểu các caching strategies phổ biến.

Chúng ta sẽ khám phá cache-aside pattern, write-through caching, cache invalidation strategies, và cách sử dụng Redis để implement rate limiting, session storage, và pub/sub messaging. Redis cung cấp nhiều data structures như strings, hashes, lists, sets, và sorted sets.`
  },
  {
    title: 'Docker và Containerization cho Developers',
    excerpt: 'Hướng dẫn sử dụng Docker để containerize applications',
    content: `Docker là một platform cho phép đóng gói ứng dụng và dependencies vào containers. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng Docker để phát triển và deploy applications.

Chúng ta sẽ học về Dockerfile, docker-compose, volumes, networks, và các best practices. Docker giúp đảm bảo ứng dụng chạy nhất quán trên các môi trường khác nhau, từ development đến production. Chúng ta cũng sẽ tìm hiểu về multi-stage builds và optimization techniques.`
  },
  {
    title: 'RESTful API Design Principles',
    excerpt: 'Các nguyên tắc thiết kế RESTful API tốt và best practices',
    content: `REST (Representational State Transfer) là một architectural style cho việc thiết kế web services. Trong bài viết này, chúng ta sẽ tìm hiểu các nguyên tắc thiết kế RESTful API và best practices.

Chúng ta sẽ khám phá về HTTP methods (GET, POST, PUT, DELETE, PATCH), status codes, resource naming conventions, versioning strategies, pagination, filtering, và error handling. Một RESTful API tốt phải dễ hiểu, consistent, và tuân theo các standards.`
  },
  {
    title: 'GraphQL vs REST API: So sánh và lựa chọn',
    excerpt: 'So sánh GraphQL và REST API để chọn giải pháp phù hợp',
    content: `GraphQL và REST là hai approaches phổ biến cho việc xây dựng APIs. Trong bài viết này, chúng ta sẽ so sánh hai approaches này và tìm hiểu khi nào nên sử dụng cái nào.

GraphQL cho phép clients request chính xác dữ liệu họ cần, giảm over-fetching và under-fetching. REST API đơn giản hơn và phù hợp với nhiều use cases. Chúng ta sẽ tìm hiểu về ưu và nhược điểm của mỗi approach, và các use cases phù hợp.`
  },
  {
    title: 'Microservices Architecture với NestJS',
    excerpt: 'Cách xây dựng microservices architecture sử dụng NestJS',
    content: `Microservices architecture là một cách tiếp cận để xây dựng ứng dụng như một tập hợp các services nhỏ, độc lập. Trong bài viết này, chúng ta sẽ tìm hiểu cách implement microservices với NestJS.

Chúng ta sẽ khám phá về service communication (HTTP, gRPC, message queues), service discovery, API gateway pattern, distributed tracing, và các challenges như data consistency và error handling. NestJS cung cấp các tools và patterns để xây dựng microservices hiệu quả.`
  },
  {
    title: 'Authentication và Authorization trong NestJS',
    excerpt: 'Implement authentication và authorization với JWT trong NestJS',
    content: `Authentication và authorization là các aspects quan trọng của bất kỳ ứng dụng nào. Trong bài viết này, chúng ta sẽ tìm hiểu cách implement authentication và authorization trong NestJS sử dụng JWT.

Chúng ta sẽ khám phá về JWT tokens, password hashing với bcrypt, refresh tokens, role-based access control (RBAC), guards, và strategies. NestJS cung cấp Passport integration để dễ dàng implement các authentication strategies khác nhau.`
  },
  {
    title: 'Testing trong NestJS: Unit Tests và E2E Tests',
    excerpt: 'Hướng dẫn viết tests cho ứng dụng NestJS',
    content: `Testing là một phần quan trọng của software development. Trong bài viết này, chúng ta sẽ tìm hiểu cách viết unit tests và end-to-end tests cho ứng dụng NestJS.

Chúng ta sẽ khám phá về Jest testing framework, mocking dependencies, testing controllers, services, và repositories. Chúng ta cũng sẽ tìm hiểu về test coverage, integration testing, và các best practices cho testing trong NestJS.`
  },
  {
    title: 'React Hooks: useState, useEffect và Custom Hooks',
    excerpt: 'Tìm hiểu về React Hooks và cách sử dụng chúng hiệu quả',
    content: `React Hooks là một tính năng mạnh mẽ được giới thiệu trong React 16.8, cho phép sử dụng state và lifecycle methods trong functional components. Trong bài viết này, chúng ta sẽ tìm hiểu về các hooks phổ biến.

Chúng ta sẽ khám phá useState, useEffect, useContext, useMemo, useCallback, và cách tạo custom hooks. Hooks giúp code trở nên dễ đọc, dễ test, và tái sử dụng logic giữa các components.`
  },
  {
    title: 'Node.js Event Loop và Asynchronous Programming',
    excerpt: 'Hiểu rõ về Event Loop và cách xử lý asynchronous trong Node.js',
    content: `Node.js sử dụng event-driven, non-blocking I/O model, làm cho nó nhẹ và hiệu quả. Trong bài viết này, chúng ta sẽ tìm hiểu về Event Loop và cách Node.js xử lý asynchronous operations.

Chúng ta sẽ khám phá về callbacks, promises, async/await, event loop phases, và cách tối ưu hóa performance. Hiểu rõ về Event Loop giúp viết code Node.js hiệu quả hơn và tránh các vấn đề về performance.`
  },
  {
    title: 'MongoDB Aggregation Pipeline và Advanced Queries',
    excerpt: 'Cách sử dụng MongoDB aggregation pipeline để query dữ liệu phức tạp',
    content: `MongoDB aggregation pipeline là một framework mạnh mẽ để xử lý và transform documents. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng aggregation pipeline để thực hiện các queries phức tạp.

Chúng ta sẽ khám phá về các stages như $match, $group, $project, $sort, $lookup, và nhiều hơn nữa. Aggregation pipeline cho phép thực hiện các operations phức tạp như grouping, filtering, joining, và transforming data.`
  },
  {
    title: 'WebSocket và Real-time Communication',
    excerpt: 'Implement real-time communication với WebSocket trong NestJS',
    content: `WebSocket là một protocol cho phép communication hai chiều giữa client và server. Trong bài viết này, chúng ta sẽ tìm hiểu cách implement WebSocket trong NestJS để tạo real-time applications.

Chúng ta sẽ khám phá về Socket.IO, WebSocket gateways, rooms, namespaces, và cách handle events. WebSocket rất hữu ích cho các ứng dụng như chat, notifications, live updates, và collaborative features.`
  },
  {
    title: 'CI/CD Pipeline với GitHub Actions',
    excerpt: 'Thiết lập CI/CD pipeline sử dụng GitHub Actions',
    content: `CI/CD (Continuous Integration/Continuous Deployment) là một practice quan trọng trong modern software development. Trong bài viết này, chúng ta sẽ tìm hiểu cách thiết lập CI/CD pipeline với GitHub Actions.

Chúng ta sẽ khám phá về workflows, jobs, steps, actions, và cách tự động hóa testing, building, và deployment. GitHub Actions cung cấp một platform mạnh mẽ để tự động hóa các tasks trong development workflow.`
  },
  {
    title: 'AWS S3 và Cloud Storage Integration',
    excerpt: 'Cách tích hợp AWS S3 để lưu trữ files và images',
    content: `AWS S3 (Simple Storage Service) là một object storage service phổ biến. Trong bài viết này, chúng ta sẽ tìm hiểu cách tích hợp AWS S3 vào ứng dụng NestJS để lưu trữ files và images.

Chúng ta sẽ khám phá về S3 buckets, upload files, download files, presigned URLs, và best practices cho security và performance. S3 cung cấp khả năng lưu trữ scalable và reliable cho các ứng dụng web.`
  },
  {
    title: 'Kubernetes và Container Orchestration',
    excerpt: 'Hướng dẫn deploy applications với Kubernetes',
    content: `Kubernetes là một container orchestration platform mạnh mẽ. Trong bài viết này, chúng ta sẽ tìm hiểu cách deploy applications với Kubernetes.

Chúng ta sẽ khám phá về pods, services, deployments, configmaps, secrets, và cách scale applications. Kubernetes giúp quản lý containers ở scale lớn, tự động hóa deployment, scaling, và management của containerized applications.`
  },
  {
    title: 'Clean Architecture trong NestJS',
    excerpt: 'Áp dụng Clean Architecture principles vào NestJS projects',
    content: `Clean Architecture là một architectural pattern giúp tạo ra code dễ maintain, test, và scale. Trong bài viết này, chúng ta sẽ tìm hiểu cách áp dụng Clean Architecture vào NestJS projects.

Chúng ta sẽ khám phá về layers (presentation, application, domain, infrastructure), dependency rules, và cách tổ chức code. Clean Architecture giúp tách biệt business logic khỏi frameworks và external dependencies.`
  },
  {
    title: 'Database Migrations với TypeORM',
    excerpt: 'Quản lý database schema changes với TypeORM migrations',
    content: `Database migrations là một cách để quản lý schema changes một cách có hệ thống. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng TypeORM migrations.

Chúng ta sẽ khám phá về cách tạo migrations, run migrations, revert migrations, và best practices. Migrations giúp version control database schema và đảm bảo consistency giữa các environments.`
  },
  {
    title: 'Error Handling và Logging trong NestJS',
    excerpt: 'Best practices cho error handling và logging',
    content: `Error handling và logging là các aspects quan trọng của bất kỳ application nào. Trong bài viết này, chúng ta sẽ tìm hiểu cách implement error handling và logging trong NestJS.

Chúng ta sẽ khám phá về exception filters, global exception handlers, logging strategies, và cách sử dụng Winston hoặc Pino cho logging. Proper error handling và logging giúp debug và maintain applications dễ dàng hơn.`
  },
  {
    title: 'API Rate Limiting và Throttling',
    excerpt: 'Implement rate limiting để bảo vệ API khỏi abuse',
    content: `Rate limiting là một kỹ thuật để giới hạn số lượng requests mà một client có thể thực hiện trong một khoảng thời gian. Trong bài viết này, chúng ta sẽ tìm hiểu cách implement rate limiting trong NestJS.

Chúng ta sẽ khám phá về các strategies như fixed window, sliding window, token bucket, và cách sử dụng Redis để implement distributed rate limiting. Rate limiting giúp bảo vệ API khỏi abuse và đảm bảo fair usage.`
  },
  {
    title: 'Message Queue với Bull và Redis',
    excerpt: 'Xử lý background jobs với Bull queue',
    content: `Message queues là một cách để xử lý background jobs và asynchronous tasks. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng Bull queue với Redis trong NestJS.

Chúng ta sẽ khám phá về job queues, job processing, job priorities, delayed jobs, và recurring jobs. Bull cung cấp một solution mạnh mẽ để quản lý background jobs với Redis backend.`
  },
  {
    title: 'OAuth 2.0 và Social Authentication',
    excerpt: 'Implement OAuth 2.0 và social login (Google, Facebook, GitHub)',
    content: `OAuth 2.0 là một authorization framework cho phép third-party applications access user resources. Trong bài viết này, chúng ta sẽ tìm hiểu cách implement OAuth 2.0 và social authentication trong NestJS.

Chúng ta sẽ khám phá về OAuth 2.0 flow, implement Google, Facebook, và GitHub login, và cách handle tokens. Social authentication giúp cải thiện user experience bằng cách cho phép users login với existing accounts.`
  },
  {
    title: 'GraphQL với NestJS và Apollo Server',
    excerpt: 'Xây dựng GraphQL API với NestJS',
    content: `GraphQL là một query language và runtime cho APIs. Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng GraphQL API với NestJS và Apollo Server.

Chúng ta sẽ khám phá về schemas, resolvers, queries, mutations, subscriptions, và cách integrate với TypeORM. GraphQL cho phép clients request chính xác dữ liệu họ cần, giảm over-fetching.`
  },
  {
    title: 'Serverless Functions với AWS Lambda',
    excerpt: 'Deploy NestJS applications như serverless functions',
    content: `Serverless computing cho phép chạy code mà không cần quản lý servers. Trong bài viết này, chúng ta sẽ tìm hiểu cách deploy NestJS applications như serverless functions với AWS Lambda.

Chúng ta sẽ khám phá về serverless architecture, AWS Lambda, API Gateway, và cách optimize cho serverless environment. Serverless giúp giảm operational overhead và scale automatically.`
  },
  {
    title: 'Monitoring và Observability với Prometheus',
    excerpt: 'Thiết lập monitoring cho NestJS applications',
    content: `Monitoring và observability là các aspects quan trọng để maintain production applications. Trong bài viết này, chúng ta sẽ tìm hiểu cách thiết lập monitoring với Prometheus và Grafana.

Chúng ta sẽ khám phá về metrics, health checks, alerting, và cách collect và visualize metrics. Proper monitoring giúp detect issues sớm và maintain system health.`
  },
  {
    title: 'Security Best Practices cho NestJS Applications',
    excerpt: 'Các best practices để bảo mật ứng dụng NestJS',
    content: `Security là một concern quan trọng trong web development. Trong bài viết này, chúng ta sẽ tìm hiểu các security best practices cho NestJS applications.

Chúng ta sẽ khám phá về input validation, SQL injection prevention, XSS protection, CSRF protection, security headers, và cách sử dụng Helmet. Proper security practices giúp bảo vệ applications khỏi các attacks.`
  },
  {
    title: 'Performance Optimization cho NestJS',
    excerpt: 'Các kỹ thuật để optimize performance của NestJS applications',
    content: `Performance là một yếu tố quan trọng của user experience. Trong bài viết này, chúng ta sẽ tìm hiểu các kỹ thuật để optimize performance của NestJS applications.

Chúng ta sẽ khám phá về caching strategies, database query optimization, compression, lazy loading, và profiling. Performance optimization giúp cải thiện response times và user experience.`
  },
  {
    title: 'Vue.js 3 Composition API và Reactivity',
    excerpt: 'Tìm hiểu về Composition API trong Vue.js 3',
    content: `Vue.js 3 giới thiệu Composition API, một cách mới để organize và reuse logic. Trong bài viết này, chúng ta sẽ tìm hiểu về Composition API và reactivity system.

Chúng ta sẽ khám phá về ref, reactive, computed, watch, và cách tạo composables. Composition API giúp code trở nên dễ đọc và tái sử dụng, đặc biệt cho các components phức tạp.`
  },
  {
    title: 'Angular Dependency Injection và Services',
    excerpt: 'Hiểu rõ về Dependency Injection trong Angular',
    content: `Angular sử dụng dependency injection pattern để quản lý dependencies. Trong bài viết này, chúng ta sẽ tìm hiểu về dependency injection và cách sử dụng services trong Angular.

Chúng ta sẽ khám phá về providers, injectors, services, và cách tạo và sử dụng custom services. Dependency injection giúp code trở nên modular, testable, và maintainable.`
  },
  {
    title: 'Python FastAPI: Modern Web Framework',
    excerpt: 'Xây dựng APIs với FastAPI, framework Python hiện đại',
    content: `FastAPI là một modern web framework cho Python, được thiết kế để xây dựng APIs nhanh và dễ sử dụng. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng FastAPI.

Chúng ta sẽ khám phá về routing, request validation, dependency injection, async support, và automatic API documentation. FastAPI cung cấp performance cao và developer experience tốt.`
  },
  {
    title: 'Machine Learning với TensorFlow.js',
    excerpt: 'Implement machine learning models trong browser với TensorFlow.js',
    content: `TensorFlow.js cho phép chạy machine learning models trong browser và Node.js. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng TensorFlow.js để implement ML models.

Chúng ta sẽ khám phá về loading models, training models, và sử dụng pre-trained models. TensorFlow.js mở ra khả năng implement ML features trong web applications.`
  },
  {
    title: 'Blockchain và Smart Contracts với Solidity',
    excerpt: 'Tìm hiểu về blockchain development và smart contracts',
    content: `Blockchain là một công nghệ phân tán cho phép lưu trữ dữ liệu một cách an toàn và minh bạch. Trong bài viết này, chúng ta sẽ tìm hiểu về blockchain development và smart contracts với Solidity.

Chúng ta sẽ khám phá về Ethereum, smart contracts, Solidity programming, và cách deploy contracts. Blockchain technology đang mở ra nhiều possibilities mới trong software development.`
  },
  {
    title: 'Progressive Web Apps (PWA) với Next.js',
    excerpt: 'Xây dựng Progressive Web Apps với Next.js',
    content: `Progressive Web Apps (PWA) là các web applications có thể hoạt động như native apps. Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng PWA với Next.js.

Chúng ta sẽ khám phá về service workers, offline support, push notifications, và app manifest. PWAs cung cấp user experience tốt hơn và có thể được install trên devices.`
  },
  {
    title: 'WebAssembly và High-Performance Web Apps',
    excerpt: 'Sử dụng WebAssembly để tăng performance của web applications',
    content: `WebAssembly (WASM) là một binary instruction format cho phép chạy code với performance gần như native. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng WebAssembly trong web applications.

Chúng ta sẽ khám phá về compiling code to WASM, integrating với JavaScript, và use cases. WebAssembly mở ra khả năng chạy performance-critical code trong browser.`
  },
  {
    title: 'CSS-in-JS và Styled Components',
    excerpt: 'Styling React components với CSS-in-JS solutions',
    content: `CSS-in-JS là một approach để styling components bằng cách viết CSS trong JavaScript. Trong bài viết này, chúng ta sẽ tìm hiểu về CSS-in-JS và Styled Components.

Chúng ta sẽ khám phá về styled components, theming, dynamic styling, và best practices. CSS-in-JS giúp scope styles, enable dynamic styling, và improve developer experience.`
  },
  {
    title: 'State Management với Redux Toolkit',
    excerpt: 'Quản lý state trong React applications với Redux Toolkit',
    content: `Redux Toolkit là cách được recommend để sử dụng Redux. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng Redux Toolkit để quản lý state trong React applications.

Chúng ta sẽ khám phá về slices, actions, reducers, và cách integrate với React. Redux Toolkit giúp simplify Redux code và reduce boilerplate.`
  },
  {
    title: 'Tailwind CSS: Utility-First CSS Framework',
    excerpt: 'Styling applications với Tailwind CSS',
    content: `Tailwind CSS là một utility-first CSS framework cho phép build custom designs nhanh chóng. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng Tailwind CSS.

Chúng ta sẽ khám phá về utility classes, responsive design, dark mode, và customization. Tailwind CSS giúp build UIs nhanh chóng mà không cần viết custom CSS.`
  },
  {
    title: 'Git Workflow và Best Practices',
    excerpt: 'Các Git workflows và best practices cho team development',
    content: `Git là một version control system phổ biến. Trong bài viết này, chúng ta sẽ tìm hiểu về Git workflows và best practices cho team development.

Chúng ta sẽ khám phá về branching strategies, commit messages, pull requests, và collaboration workflows. Proper Git workflow giúp team collaborate hiệu quả và maintain code quality.`
  },
  {
    title: 'Design Patterns trong JavaScript',
    excerpt: 'Các design patterns phổ biến trong JavaScript',
    content: `Design patterns là các solutions cho các problems thường gặp trong software design. Trong bài viết này, chúng ta sẽ tìm hiểu về các design patterns phổ biến trong JavaScript.

Chúng ta sẽ khám phá về Singleton, Factory, Observer, Module, và các patterns khác. Design patterns giúp code trở nên maintainable, scalable, và dễ hiểu.`
  },
  {
    title: 'Functional Programming trong JavaScript',
    excerpt: 'Áp dụng functional programming principles vào JavaScript',
    content: `Functional programming là một programming paradigm tập trung vào functions và immutability. Trong bài viết này, chúng ta sẽ tìm hiểu cách áp dụng functional programming vào JavaScript.

Chúng ta sẽ khám phá về pure functions, immutability, higher-order functions, và functional composition. Functional programming giúp code trở nên predictable, testable, và dễ maintain.`
  },
  {
    title: 'Algorithm và Data Structures',
    excerpt: 'Các algorithms và data structures quan trọng cho developers',
    content: `Algorithms và data structures là nền tảng của computer science. Trong bài viết này, chúng ta sẽ tìm hiểu về các algorithms và data structures quan trọng.

Chúng ta sẽ khám phá về arrays, linked lists, trees, graphs, sorting algorithms, và searching algorithms. Hiểu rõ về algorithms và data structures giúp solve problems hiệu quả hơn.`
  },
  {
    title: 'System Design và Architecture',
    excerpt: 'Các principles và patterns cho system design',
    content: `System design là một skill quan trọng cho software engineers. Trong bài viết này, chúng ta sẽ tìm hiểu về các principles và patterns cho system design.

Chúng ta sẽ khám phá về scalability, reliability, availability, load balancing, caching, và database design. System design skills giúp build systems có thể handle scale và maintain high availability.`
  },
  {
    title: 'DevOps và Infrastructure as Code',
    excerpt: 'Tự động hóa infrastructure với Terraform và Ansible',
    content: `Infrastructure as Code (IaC) là một practice để quản lý infrastructure bằng code. Trong bài viết này, chúng ta sẽ tìm hiểu về IaC với Terraform và Ansible.

Chúng ta sẽ khám phá về provisioning infrastructure, configuration management, và automation. IaC giúp manage infrastructure một cách consistent và reproducible.`
  },
  {
    title: 'Mobile Development với React Native',
    excerpt: 'Xây dựng mobile apps với React Native',
    content: `React Native cho phép build mobile applications sử dụng React. Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng mobile apps với React Native.

Chúng ta sẽ khám phá về components, navigation, state management, và native modules. React Native cho phép share code giữa iOS và Android, giảm development time.`
  },
  {
    title: 'Flutter và Cross-Platform Development',
    excerpt: 'Xây dựng cross-platform apps với Flutter',
    content: `Flutter là một UI toolkit để build natively compiled applications. Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng cross-platform apps với Flutter.

Chúng ta sẽ khám phá về widgets, state management, navigation, và platform channels. Flutter cung cấp high performance và beautiful UIs cho cả iOS và Android.`
  },
  {
    title: 'Game Development với Unity và C#',
    excerpt: 'Tìm hiểu về game development với Unity',
    content: `Unity là một game engine phổ biến cho việc phát triển games. Trong bài viết này, chúng ta sẽ tìm hiểu về game development với Unity và C#.

Chúng ta sẽ khám phá về game objects, components, physics, animation, và game mechanics. Unity cung cấp một platform mạnh mẽ để build games cho nhiều platforms.`
  },
  {
    title: 'AR/VR Development với WebXR',
    excerpt: 'Xây dựng AR/VR experiences với WebXR',
    content: `WebXR là một API cho phép build AR/VR experiences trong browser. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng WebXR.

Chúng ta sẽ khám phá về VR headsets, AR devices, 3D graphics, và interaction models. WebXR mở ra khả năng build immersive experiences trong web.`
  },
  {
    title: 'Quantum Computing và Qiskit',
    excerpt: 'Tìm hiểu về quantum computing và programming',
    content: `Quantum computing là một paradigm mới sử dụng quantum mechanics để process information. Trong bài viết này, chúng ta sẽ tìm hiểu về quantum computing và Qiskit.

Chúng ta sẽ khám phá về qubits, quantum gates, quantum algorithms, và cách sử dụng Qiskit. Quantum computing có potential để solve problems mà classical computers không thể.`
  },
  {
    title: 'IoT Development và Embedded Systems',
    excerpt: 'Xây dựng IoT applications và embedded systems',
    content: `IoT (Internet of Things) là một network của connected devices. Trong bài viết này, chúng ta sẽ tìm hiểu về IoT development và embedded systems.

Chúng ta sẽ khám phá về sensors, actuators, communication protocols, và cloud integration. IoT mở ra nhiều possibilities cho smart homes, industrial automation, và nhiều hơn nữa.`
  },
  {
    title: 'Cybersecurity và Ethical Hacking',
    excerpt: 'Tìm hiểu về cybersecurity và ethical hacking',
    content: `Cybersecurity là một field quan trọng để protect systems và data. Trong bài viết này, chúng ta sẽ tìm hiểu về cybersecurity và ethical hacking.

Chúng ta sẽ khám phá về vulnerabilities, penetration testing, security best practices, và defense strategies. Understanding cybersecurity giúp build more secure applications.`
  },
  {
    title: 'Data Science với Python và Pandas',
    excerpt: 'Phân tích dữ liệu với Python và Pandas',
    content: `Data science là một field sử dụng scientific methods để extract insights từ data. Trong bài viết này, chúng ta sẽ tìm hiểu về data science với Python và Pandas.

Chúng ta sẽ khám phá về data manipulation, analysis, visualization, và machine learning. Data science skills giúp make data-driven decisions.`
  },
  {
    title: 'Big Data và Apache Spark',
    excerpt: 'Xử lý big data với Apache Spark',
    content: `Apache Spark là một framework để process big data. Trong bài viết này, chúng ta sẽ tìm hiểu cách sử dụng Apache Spark để xử lý big data.

Chúng ta sẽ khám phá về RDDs, DataFrames, Spark SQL, và distributed processing. Spark cung cấp high performance cho big data processing.`
  },
  {
    title: 'Cloud Computing với AWS',
    excerpt: 'Tìm hiểu về AWS services và cloud architecture',
    content: `AWS (Amazon Web Services) là một cloud platform cung cấp nhiều services. Trong bài viết này, chúng ta sẽ tìm hiểu về AWS services và cloud architecture.

Chúng ta sẽ khám phá về EC2, S3, RDS, Lambda, và các services khác. Cloud computing giúp scale applications và reduce infrastructure costs.`
  },
  {
    title: 'Google Cloud Platform (GCP) Services',
    excerpt: 'Sử dụng GCP services để build cloud applications',
    content: `Google Cloud Platform cung cấp nhiều cloud services. Trong bài viết này, chúng ta sẽ tìm hiểu về GCP services và cách sử dụng chúng.

Chúng ta sẽ khám phá về Compute Engine, Cloud Storage, Cloud SQL, và các services khác. GCP cung cấp powerful tools để build và scale applications.`
  },
  {
    title: 'Microsoft Azure và Cloud Solutions',
    excerpt: 'Xây dựng solutions với Microsoft Azure',
    content: `Microsoft Azure là một cloud platform với nhiều services. Trong bài viết này, chúng ta sẽ tìm hiểu về Azure services và cách sử dụng chúng.

Chúng ta sẽ khám phá về Virtual Machines, Azure Functions, Cosmos DB, và các services khác. Azure cung cấp integration tốt với Microsoft ecosystem.`
  },
  {
    title: 'Linux System Administration',
    excerpt: 'Quản lý Linux systems và servers',
    content: `Linux system administration là một skill quan trọng cho DevOps engineers. Trong bài viết này, chúng ta sẽ tìm hiểu về Linux system administration.

Chúng ta sẽ khám phá về file systems, process management, networking, và security. Linux skills giúp manage servers và infrastructure hiệu quả.`
  },
  {
    title: 'Network Programming và Socket Programming',
    excerpt: 'Xây dựng network applications',
    content: `Network programming là một skill quan trọng để build distributed systems. Trong bài viết này, chúng ta sẽ tìm hiểu về network programming và socket programming.

Chúng ta sẽ khám phá về TCP/IP, UDP, sockets, và network protocols. Network programming skills giúp build applications có thể communicate qua network.`
  },
  {
    title: 'Compiler Design và Language Implementation',
    excerpt: 'Tìm hiểu về compiler design và cách implement programming languages',
    content: `Compiler design là một field nghiên cứu cách translate source code thành machine code. Trong bài viết này, chúng ta sẽ tìm hiểu về compiler design.

Chúng ta sẽ khám phá về lexing, parsing, semantic analysis, code generation, và optimization. Understanding compilers giúp understand how programming languages work.`
  },
  {
    title: 'Operating Systems Concepts',
    excerpt: 'Tìm hiểu về operating systems và system programming',
    content: `Operating systems là nền tảng của computer systems. Trong bài viết này, chúng ta sẽ tìm hiểu về operating systems concepts.

Chúng ta sẽ khám phá về processes, threads, memory management, file systems, và scheduling. Understanding operating systems giúp write more efficient code.`
  },
  {
    title: 'Computer Graphics và 3D Rendering',
    excerpt: 'Tìm hiểu về computer graphics và 3D rendering',
    content: `Computer graphics là một field nghiên cứu cách generate và manipulate images. Trong bài viết này, chúng ta sẽ tìm hiểu về computer graphics và 3D rendering.

Chúng ta sẽ khám phá về rendering pipelines, shaders, lighting, và animation. Computer graphics skills giúp build visual applications và games.`
  },
  {
    title: 'Natural Language Processing (NLP)',
    excerpt: 'Xử lý ngôn ngữ tự nhiên với machine learning',
    content: `NLP là một field của AI nghiên cứu cách machines understand human language. Trong bài viết này, chúng ta sẽ tìm hiểu về NLP.

Chúng ta sẽ khám phá về tokenization, sentiment analysis, named entity recognition, và language models. NLP skills giúp build applications có thể understand và process text.`
  },
  {
    title: 'Computer Vision và Image Processing',
    excerpt: 'Xử lý images và computer vision với deep learning',
    content: `Computer vision là một field nghiên cứu cách machines understand visual information. Trong bài viết này, chúng ta sẽ tìm hiểu về computer vision.

Chúng ta sẽ khám phá về image processing, object detection, image classification, và convolutional neural networks. Computer vision skills giúp build applications có thể understand images.`
  },
  {
    title: 'Deep Learning và Neural Networks',
    excerpt: 'Tìm hiểu về deep learning và neural networks',
    content: `Deep learning là một subset của machine learning sử dụng neural networks. Trong bài viết này, chúng ta sẽ tìm hiểu về deep learning.

Chúng ta sẽ khám phá về neural networks, backpropagation, convolutional networks, và recurrent networks. Deep learning đã revolutionize nhiều fields như image recognition và natural language processing.`
  },
  {
    title: 'Reinforcement Learning',
    excerpt: 'Tìm hiểu về reinforcement learning và AI agents',
    content: `Reinforcement learning là một type của machine learning nơi agents learn từ interactions. Trong bài viết này, chúng ta sẽ tìm hiểu về reinforcement learning.

Chúng ta sẽ khám phá về agents, environments, rewards, policies, và Q-learning. Reinforcement learning đã achieve remarkable results trong game playing và robotics.`
  },
  {
    title: 'Distributed Systems và Consensus Algorithms',
    excerpt: 'Xây dựng distributed systems và consensus',
    content: `Distributed systems là systems với components trên multiple machines. Trong bài viết này, chúng ta sẽ tìm hiểu về distributed systems và consensus algorithms.

Chúng ta sẽ khám phá về consistency, availability, partition tolerance, và algorithms như Raft và Paxos. Distributed systems skills giúp build scalable và reliable systems.`
  },
  {
    title: 'Event Sourcing và CQRS',
    excerpt: 'Implement event sourcing và CQRS patterns',
    content: `Event sourcing và CQRS là các patterns cho building scalable systems. Trong bài viết này, chúng ta sẽ tìm hiểu về event sourcing và CQRS.

Chúng ta sẽ khám phá về event stores, command handlers, query models, và cách implement các patterns này. Event sourcing và CQRS giúp build systems với audit trails và scalability.`
  },
  {
    title: 'Domain-Driven Design (DDD)',
    excerpt: 'Áp dụng Domain-Driven Design vào software development',
    content: `Domain-Driven Design là một approach để design software dựa trên domain model. Trong bài viết này, chúng ta sẽ tìm hiểu về Domain-Driven Design.

Chúng ta sẽ khám phá về entities, value objects, aggregates, domain events, và bounded contexts. DDD giúp build software phù hợp với business requirements.`
  },
  {
    title: 'Test-Driven Development (TDD)',
    excerpt: 'Phát triển software với Test-Driven Development',
    content: `Test-Driven Development là một practice viết tests trước khi viết code. Trong bài viết này, chúng ta sẽ tìm hiểu về TDD.

Chúng ta sẽ khám phá về red-green-refactor cycle, unit tests, integration tests, và benefits của TDD. TDD giúp write better code và improve design.`
  },
  {
    title: 'Behavior-Driven Development (BDD)',
    excerpt: 'Phát triển software với Behavior-Driven Development',
    content: `Behavior-Driven Development là một approach tập trung vào behavior của software. Trong bài viết này, chúng ta sẽ tìm hiểu về BDD.

Chúng ta sẽ khám phá về Gherkin syntax, feature files, step definitions, và cách sử dụng Cucumber. BDD giúp improve communication giữa developers và stakeholders.`
  },
  {
    title: 'Agile và Scrum Methodology',
    excerpt: 'Tìm hiểu về Agile và Scrum development methodology',
    content: `Agile là một methodology tập trung vào iterative development và collaboration. Trong bài viết này, chúng ta sẽ tìm hiểu về Agile và Scrum.

Chúng ta sẽ khám phá về sprints, user stories, standups, retrospectives, và Scrum roles. Agile giúp teams adapt to changes và deliver value nhanh chóng.`
  },
  {
    title: 'Code Review và Best Practices',
    excerpt: 'Các best practices cho code reviews',
    content: `Code review là một practice quan trọng để maintain code quality. Trong bài viết này, chúng ta sẽ tìm hiểu về code review best practices.

Chúng ta sẽ khám phá về review process, feedback guidelines, và tools. Code reviews giúp catch bugs, improve code quality, và share knowledge.`
  },
  {
    title: 'Documentation và Technical Writing',
    excerpt: 'Viết documentation hiệu quả cho software projects',
    content: `Documentation là một aspect quan trọng của software development. Trong bài viết này, chúng ta sẽ tìm hiểu về technical writing và documentation.

Chúng ta sẽ khám phá về API documentation, code comments, README files, và best practices. Good documentation giúp developers understand và use software effectively.`
  },
  {
    title: 'Open Source Contribution',
    excerpt: 'Cách contribute vào open source projects',
    content: `Contributing vào open source projects là một cách tốt để learn và give back to community. Trong bài viết này, chúng ta sẽ tìm hiểu cách contribute vào open source.

Chúng ta sẽ khám phá về finding projects, making contributions, pull requests, và best practices. Open source contribution giúp improve skills và build portfolio.`
  },
  {
    title: 'Career Development cho Software Engineers',
    excerpt: 'Phát triển career trong software engineering',
    content: `Career development là một journey liên tục trong software engineering. Trong bài viết này, chúng ta sẽ tìm hiểu về career development strategies.

Chúng ta sẽ khám phá về skill development, networking, interview preparation, và career paths. Career development giúp achieve professional goals và grow as engineers.`
  }
];

// Function để lấy random template
function getRandomTemplate() {
  return blogTemplates[Math.floor(Math.random() * blogTemplates.length)];
}

// Main function để update blogs
async function updateBlogsContent() {
  try {
    console.log('🔄 Đang kết nối database...');
    await AppDataSource.initialize();
    console.log('✅ Đã kết nối database thành công!');

    const blogRepository = AppDataSource.getRepository(BlogEntity);
    
    // Lấy tất cả blogs hiện có
    console.log('📖 Đang lấy danh sách blogs...');
    const blogs = await blogRepository.find();
    console.log(`📊 Tìm thấy ${blogs.length} blogs`);

    if (blogs.length === 0) {
      console.log('⚠️  Không có blogs nào để update!');
      await AppDataSource.destroy();
      return;
    }

    // Update từng blog
    console.log('🔄 Đang update blogs...');
    let updatedCount = 0;

    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const template = getRandomTemplate();
      
      // Chỉ update 3 cột: title, content, excerpt
      await blogRepository.update(
        { id: blog.id },
        {
          title: template.title,
          content: template.content,
          excerpt: template.excerpt,
        }
      );
      
      updatedCount++;
      if ((i + 1) % 10 === 0) {
        console.log(`✅ Đã update ${i + 1}/${blogs.length} blogs...`);
      }
    }

    console.log(`\n🎉 Hoàn thành! Đã update ${updatedCount} blogs`);
    console.log('📝 Các cột đã được update: title, content, excerpt');
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

// Chạy script
updateBlogsContent();
