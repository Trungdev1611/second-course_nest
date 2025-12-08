// data-seeds/tag.seed.ts
import { TagEntity } from 'src/tags/tag.entity';
import { DataSource } from 'typeorm';

export const seedTags = async (dataSource: DataSource, count: number = 750) => {
  const tagRepo = dataSource.getRepository(TagEntity);

  const existingTags = await tagRepo.count();
  const tagsToCreate = Math.max(0, count - existingTags);

  if (tagsToCreate <= 0) {
    console.log(`⚠️  Đã có đủ ${existingTags} tags (yêu cầu: ${count})`);
    return;
  }

  console.log(`🏷️  Tạo ${tagsToCreate} tags...`);

  const tagCategories = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
    'csharp', 'cpp', 'c', 'scala', 'dart', 'r', 'matlab', 'perl', 'lua', 'haskell',
    
    // Frameworks & Libraries
    'nestjs', 'nodejs', 'react', 'vue', 'angular', 'nextjs', 'nuxt', 'svelte', 'express', 'fastify',
    'django', 'flask', 'spring', 'laravel', 'symfony', 'rails', 'gin', 'echo', 'fiber', 'actix',
    
    // Databases
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'neo4j', 'dynamodb',
    'sqlite', 'oracle', 'sqlserver', 'mariadb', 'couchdb', 'influxdb', 'timescaledb',
    
    // DevOps & Tools
    'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github', 'git',
    'aws', 'azure', 'gcp', 'digitalocean', 'vercel', 'netlify', 'heroku', 'cloudflare',
    
    // Frontend
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui', 'ant-design',
    'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'turbo', 'nx',
    
    // Backend
    'api', 'rest', 'graphql', 'grpc', 'microservices', 'serverless', 'lambda', 'functions',
    'authentication', 'authorization', 'jwt', 'oauth', 'oauth2', 'openid', 'saml',
    
    // Testing
    'testing', 'jest', 'mocha', 'cypress', 'playwright', 'selenium', 'vitest', 'pytest',
    'unit-testing', 'integration-testing', 'e2e-testing', 'tdd', 'bdd',
    
    // Architecture & Patterns
    'architecture', 'design-patterns', 'solid', 'clean-code', 'ddd', 'microservices',
    'monolith', 'serverless', 'event-driven', 'cqrs', 'event-sourcing',
    
    // Security
    'security', 'encryption', 'hashing', 'ssl', 'tls', 'https', 'csrf', 'xss', 'sql-injection',
    'owasp', 'penetration-testing', 'vulnerability', 'authentication', 'authorization',
    
    // Performance & Optimization
    'performance', 'optimization', 'caching', 'cdn', 'load-balancing', 'scalability',
    'monitoring', 'logging', 'metrics', 'apm', 'profiling', 'benchmarking',
    
    // Mobile
    'react-native', 'flutter', 'ionic', 'xamarin', 'swiftui', 'kotlin-multiplatform',
    'pwa', 'mobile-development', 'ios', 'android',
    
    // AI & ML
    'machine-learning', 'deep-learning', 'neural-networks', 'tensorflow', 'pytorch',
    'nlp', 'computer-vision', 'reinforcement-learning', 'ai', 'data-science',
    
    // Web3 & Blockchain
    'blockchain', 'ethereum', 'solidity', 'web3', 'defi', 'nft', 'smart-contracts',
    'cryptocurrency', 'bitcoin', 'dapps',
    
    // General Topics
    'tutorial', 'guide', 'tips', 'tricks', 'best-practices', 'news', 'update', 'release',
    'beginner', 'intermediate', 'advanced', 'expert', 'interview', 'career', 'learning',
  ];

  const newTags: TagEntity[] = [];
  const usedNames = new Set<string>();

  // Lấy tags đã tồn tại
  const existingTagNames = (await tagRepo.find({ take: 1000 })).map(t => t.tag_name);
  existingTagNames.forEach(name => usedNames.add(name.toLowerCase()));

  for (let i = 0; i < tagsToCreate; i++) {
    let tagName: string;
    let attempts = 0;
    
    // Tìm tag name chưa dùng
    do {
      if (i < tagCategories.length) {
        tagName = tagCategories[i];
      } else {
        tagName = `tag_${Date.now()}_${i}`;
      }
      attempts++;
    } while (usedNames.has(tagName.toLowerCase()) && attempts < 100);

    if (!usedNames.has(tagName.toLowerCase())) {
      const tag = tagRepo.create({
        tag_name: tagName,
      });
      newTags.push(tag);
      usedNames.add(tagName.toLowerCase());
    }
  }

  // Batch insert
  const batchSize = 100;
  for (let i = 0; i < newTags.length; i += batchSize) {
    const batch = newTags.slice(i, i + batchSize);
    await tagRepo.save(batch);
    console.log(`  ✅ Created ${Math.min(i + batchSize, newTags.length)}/${newTags.length} tags`);
  }

  const totalTags = await tagRepo.count();
  console.log(`✅ Total tags: ${totalTags}`);
};

