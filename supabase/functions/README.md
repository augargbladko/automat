# Supabase Deno functions

To run functions, we need Deno (which you can do on supabase setup, but we didn't)

1. Install the Deno VS Code extension
   `https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno`

2. Install Deno CLI:
   `brew install deno` (this is slow)

3. Enable Deno for the workspace:
   Ensure deno is available in the environment path, or set its path via the deno.path setting in VSCode.
   Select`Deno: Initialize Workspace Configuration` from the vscode command palette

4. Initialize the project
   Select`Deno: Enable` from the vscode command palette

5. When you update an environment variable in .env:
   Run `supabase stop` and then `supabase start` to include the new environment variable
   To push these secrets to prod, use `supabase secrets set --env-file ./supabase/functions/.env`
