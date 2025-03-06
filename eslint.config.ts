// import eslint from '@eslint/js';
// import tseslint from 'typescript-eslint';
//
// export default tseslint.config(
//   eslint.configs.recommended,
//   tseslint.configs.strict,
//   tseslint.configs.stylistic,
//   {
//     rules: {
//       quotes: ['error', 'single'],
//       'prefer-rest-params': 'off',
//     },
//   }
// );
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
// import { Linter } from 'eslint'

export default [
  stylistic.configs.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: [
      '**/*.{js,ts}',
    ],
  },
  {
    ignores: ['dist/'],
  },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // rules: {
    //   '@typescript-eslint/no-unused-vars': 'off',
    // },
  },
] // satisfies Linter.Config[]
