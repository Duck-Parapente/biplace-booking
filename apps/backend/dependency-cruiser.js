module.exports = {
  forbidden: [
    // Domain Layer Isolation Rules
    {
      name: 'domain-not-depend-on-infrastructure',
      comment: 'Domain layer should not import from infrastructure layer',
      severity: 'error',
      from: { path: '^src/modules/.*/domain' },
      to: { path: '^src/modules/.*/infrastructure' },
    },
    {
      name: 'domain-not-depend-on-application',
      comment: 'Domain layer should not import from application layer',
      severity: 'error',
      from: { path: '^src/modules/.*/domain' },
      to: { path: '^src/modules/.*/application' },
    },
    {
      name: 'application-not-depend-on-infrastructure',
      comment:
        'Application layer should not import from infrastructure layer (except through ports)',
      severity: 'error',
      from: { path: '^src/modules/.*/application' },
      to: { path: '^src/modules/.*/infrastructure' },
    },
    {
      name: 'infrastructure-http-not-depend-on-persistence',
      comment: 'HTTP infrastructure should not directly import from persistence layer',
      severity: 'warn',
      from: { path: '^src/modules/.*/infrastructure/http' },
      to: { path: '^src/modules/.*/infrastructure/persistence' },
    },
    {
      name: 'infrastructure-persistence-not-depend-on-http',
      comment: 'Persistence infrastructure should not import from HTTP layer',
      severity: 'error',
      from: { path: '^src/modules/.*/infrastructure/persistence' },
      to: { path: '^src/modules/.*/infrastructure/http' },
    },
    // {
    //   name: 'modules-can-import-other-modules-application',
    //   comment: 'Modules can import application layer from other modules (use cases)',
    //   severity: 'info',
    //   from: { path: '^src/modules/([^/]+)' },
    //   to: { path: '^src/modules/(?!\\1)[^/]+/application' },
    // },
    {
      name: 'libs-ddd-no-module-deps',
      comment: 'DDD building blocks should not depend on specific modules',
      severity: 'error',
      from: { path: '^src/libs/ddd' },
      to: { path: '^src/modules' },
    },
    {
      name: 'only-infrastructure-persistence-import-prisma',
      comment: 'Only infrastructure/persistence and src/libs should import from @prisma*',
      severity: 'error',
      from: { pathNot: '^(src/modules/.*/infrastructure/persistence|src/libs)' },
      to: { path: '@prisma' },
    },
    {
      name: 'domain-no-nestjs-decorators',
      comment: 'Domain layer should not use NestJS framework decorators',
      severity: 'warn',
      from: { path: '^src/modules/.*/domain' },
      to: { path: '@nestjs/(common|core)' },
    },
  ],
  options: {
    exclude: {
      path: 'node_modules',
    },
    doNotFollow: {
      path: 'node_modules',
    },
  },
};
