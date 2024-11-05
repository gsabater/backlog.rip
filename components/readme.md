## Components folder structure
- Follows Feature-centric organization
- Aimed to structure your components by feature (system) rather than by interface or component type. This approach is broadly used in Nuxt and Vue.js projects

## 1. Directory Naming: Lowercase
### Consistency with File Systems:
Unix-based systems (like Linux and macOS) are case-sensitive, whereas Windows is case-insensitive. Using lowercase for directories helps prevent any unexpected behavior when the project is used across different operating systems.
### URL and Path Friendliness:
Directories often correspond to URL paths in web applications, which are typically in lowercase to avoid case sensitivity issues and to maintain consistency.
### Ease of Use:
Lowercase directories are quicker to type and reduce the risk of errors when navigating through the project structure via the command line or in code.

## 2. Component File Naming: PascalCase
### Vue.js Style Guide Recommendation:
The official Vue.js style guide strongly recommends using PascalCase for naming single-file components. This means capitalizing the first letter of each word without spaces or hyphens (e.g., MyComponent.vue).
### Component Recognition:
PascalCase filenames make it immediately clear that the file is a Vue component. This improves readability and helps developers quickly identify component files among other file types.
### Auto-Importing in Nuxt.js:
Nuxt.js supports auto-importing components and recognizes components named in PascalCase. This convention ensures that components are correctly imported and reduces the need for manual import statements.

## 3. Addressing Plurality Within Components
### Component Naming Flexibility:
Inside your singular feature directories, you can name components in plural form if it makes sense (e.g., ListItems.vue).
### Descriptive Component Names:
Use component names that clearly describe their purpose, regardless of singular or plural form, to enhance readability.

## 4. Component Naming Convention
In our project, components are named to reflect their primary functionality and type, ensuring clarity and consistency throughout the codebase. When creating new components, the naming convention follows a FeatureType pattern, where:

Feature: Describes the primary action or functionality of the component (e.g., SortBy, View, Dialog).
Type: Describes the type or structure of the component (e.g., Menu, Form, Card).

components/
├── blog/
│   ├── Editor.vue
│   ├── Viewer.vue
│   ├── Dialogs/
│   │   ├── ConfirmDeleteDialog.vue
│   │   └── EditTitleDialog.vue
│   ├── CRUD/
│   │   ├── CreatePost.vue
│   │   ├── UpdatePost.vue
│   │   └── DeletePost.vue
│   └── Toasts/
│       ├── SuccessToast.vue
│       └── ErrorToast.vue
├── shop/
│   ├── ProductList.vue
│   ├── Cart.vue
│   └── Checkout.vue
└── common/
    ├── Dialogs/
    │   ├── ConfirmationDialog.vue
    │   └── Alert.vue
    ├── Buttons/
    │   ├── PrimaryButton.vue
    │   └── SecondaryButton.vue
    └── Inputs/
        ├── TextInput.vue
        └── SelectInput.vue
