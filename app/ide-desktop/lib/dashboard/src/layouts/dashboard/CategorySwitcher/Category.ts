/** @file The categories available in the category switcher. */

// ================
// === Category ===
// ================

/** The categories available in the category switcher. */
enum Category {
  recent = 'recent',
  drafts = 'drafts',
  home = 'home',
  root = 'root',
  trash = 'trash',
}

// This is REQUIRED, as `export default enum` is invalid syntax.
// eslint-disable-next-line no-restricted-syntax
export default Category
