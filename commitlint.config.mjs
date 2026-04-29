export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // nova feature
        'fix', // correção de bug
        'docs', // documentação
        'style', // formatação (sem mudança de código)
        'refactor', // refactor (sem mudança de comportamento)
        'test', // adição/ajuste de testes
        'chore', // manutenção, dependências, configs
        'perf', // melhoria de performance
        'ci', // mudanças de CI
        'build', // mudanças de build
        'revert', // reverter commit anterior
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
