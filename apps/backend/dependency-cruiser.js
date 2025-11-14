module.exports = {
  forbidden: [
    {
      name: 'domain-not-depend-on-providers',
      comment: 'Domain layer should not import from providers (infrastructure)',
      severity: 'error',
      from: { path: '^src/modules/.*/domain' },
      to: { path: '^src/modules/.*/providers' },
    },
    {
      name: 'domain-not-depend-on-commands',
      comment: 'Domain layer should not import from commands (application layer)',
      severity: 'error',
      from: { path: '^src/modules/.*/domain' },
      to: { path: '^src/modules/.*/commands' },
    },
    {
      name: 'libs-ddd-no-module-deps',
      comment: 'DDD building blocks should not depend on specific modules',
      severity: 'error',
      from: { path: 'libs/ddd' },
      to: { path: '^src/modules' },
    },
  ],
};
