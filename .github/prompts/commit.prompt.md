---
mode: agent
---
Create a workflow that will:

1. Run Biome checks and automatically fix any issues in the codebase (using `npm run check` and `npm run check:fix`).
2. Stage all current changes in the repository.
3. Generate a short, relevant commit message (max 8 words) describing the main change, based on the files modified (e.g., "Edit BookController", "Add books.sql seed", "Fix member routes").
4. Commit the changes using the generated message.
5. Push the commit to the current branch.
6. create a pull request if there are new commits on the branch.

Requirements:
- Commit message must be concise and specific to the change.
- Avoid generic terms like "update" or "changes" unless necessary.
- The process should be fully automated and require no manual input.

Success criteria:
- All changes are committed and pushed with a relevant, short message.