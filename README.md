# Post Office Backend

Project: Express + MySQL backend for Post Offices system.

Steps:
1. Copy files into project.
2. npm install
3. Create .env from .env.example
4. Run migrations: mysql -u user -p < migrations/init.sql
5. npm run dev

API endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts (admin/editor)
- PUT /api/posts/:id (admin/editor)
- DELETE /api/posts/:id (owner/admin)
- GET /api/settings
- PUT /api/settings (owner)
- PUT /api/settings/logo (owner) [form-data file]



-- new

/api/auth/register           (owner)
/api/auth/login

/api/users                   (owner)
/api/users/:id               (owner)

/api/posts
/api/posts/:id
/api/posts  (POST)           (admin/editor/owner)
/api/posts/:id (PUT)         (admin/editor/owner)
/api/posts/:id (DELETE)      (admin/owner)

/api/settings                (public)
/api/settings (PUT)          (owner)
/api/settings/logo (PUT)     (owner)
/api/settings/logo-dark (PUT)(owner)

/api/about                   (public)
/api/about/:key_name (PUT)   (owner)

/api/social                  (public)
/api/social (POST)           (owner)
/api/social/:id (PUT)        (owner)
/api/social/:id (DELETE)     (owner)

> vite



  VITE v7.2.4  ready in 736 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help






