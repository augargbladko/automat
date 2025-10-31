1. Initialize Supabase
   First, initialize the db:
   `supabase init`
   Then link the DB (requires DB master password)
   `supabase link`

2. Create Migrations
   To create a migration, use
   `supabase migration new [file_name]`C3NB3S9qmsAPLz0F

3. Create Functions
   To create a function, use:
   `supabase functions new [function_name]`

4. Apply locally
   To apply the migration to your local database, use the following command:
   `supabase db reset`

5. Notes
   Deploying database changes in a Supabase project involves several steps to ensure that your local schema changes are accurately reflected in your live project. Here's a step-by-step guide to help you through the process:

# Link Your Project:

Start by linking your local project to your Supabase project using the `supabase link` command. This establishes a connection between your local development environment and the remote Supabase project.

# Pull Remote Changes:

Before pushing local changes, pull any remote changes that may have occurred using `supabase db pull`. This step ensures that your local database is up-to-date with the remote schema.

# Push Local Changes:

Once your local changes are ready and tested, use `supabase db push` to deploy them to your live project. This command pushes your local migrations to the remote database.

# CI/CD Pipeline:

For production environments, it's recommended to use a CI/CD pipeline for deploying migrations. Set up GitHub Actions to automate the deployment process, ensuring a smooth and error-free migration.

# Troubleshooting:

After pushing changes, verify that the migration versions are consistent across local and remote databases. Use supabase migration list to check the migration status.

# Local Environment Setup:

Utilize the Supabase CLI to initialize (`supabase init`) and start (`supabase start`) your local development environment. This includes setting up Docker containers and accessing Supabase Studio locally.

# Production Considerations:

Once live, avoid making database changes through the Dashboard. Instead, rely on migrations and adhere to a safe workflow that includes multiple environments (local, staging, prod).

# Vault:

To ensurefunctions work properly, add the following items to the Vault:

`service_role_token` - the bearer token for your service role
`project_id` - NOT in the local db, just in the public db

# Rotating keys

When you rotate keys, you have to manually:

1. Update the `service_role_token` in the
2. Update the `SUPABASE_JWT_SECRET` environment variable in Vercel (it doesn't update automatically)
3. `deploy to vercel` - without a manual deployment, it won't catch the updated keys
4. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` AND `.env.local`
5. Run `supabase stop` then `supabase start`
