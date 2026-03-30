module.exports = {
  types: [
    { value: 'feat: ✨', name: '✨ feat:\tAdding a new feature' },
    { value: 'fix: 🐛', name: '🐛 fix:\tFixing a bug' },

    { value: 'docs: 📝', name: '📝 docs:\tAdd or update documentation' },

    {
      value: 'style:💄',
      name: '💄 style:\tAdd or update styles, ui or ux'
    },

    {
      value: 'refactor: ♻️',
      name: '♻️ refactor:\tCode change that neither fixes a bug nor adds a feature'
    },
    {
      value: 'perf: ⚡️',
      name: '⚡️ perf:\tCode change that improves performance'
    },
    {
      value: 'test: ✅',
      name: '✅ test:\tAdding tests cases'
    },
    {
      value: 'chore: 🚚',
      name: '🚚 chore:\tChanges to the build process or auxiliary tools\n\t\tand libraries such as documentation generation'
    },
    { value: 'revert: ⏪️', name: '⏪️ revert:\tRevert to a commit' },
    { value: 'wip: 🚧', name: '🚧 wip:\tWork in progress' },
    {
      value: 'build: 👷',
      name: '👷 build:\tAdd or update regards to build process'
    },
    {
      value: 'ci: 💚',
      name: '💚 ci:\tAdd or update regards to build process'
    }
  ],
  scopes: [{ name: 'static' }, { name: 'server' }, { name: '*' }],
  messages: {
    type: "Select the type of change that you'committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },

  subjectSeparator: ' ',
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['body'],
  subjectLimit: 100
};
