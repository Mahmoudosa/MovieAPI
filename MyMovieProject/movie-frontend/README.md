# MyMovieApp Frontend

Normal-user React screens for the MyMovieApp movie collection.

## Run locally

```sh
npm install
npm run dev
```

When signed out, the app uses a shared demo movie collection. Demo watchlist,
reviews, profile preferences, and management data are stored in browser local
storage.

Login and registration call the existing API routes:

- `POST /api/auth/login`
- `POST /api/auth/register`

The API base URL defaults to `http://localhost:5227`. To use another local API,
set `VITE_API_BASE_URL` in a `.env.local` file, for example:

```dotenv
VITE_API_BASE_URL=http://localhost:5227
```

After a successful login, the JWT is held in session storage for the current
browser tab. The navbar changes from **Login** to **Log out** and API requests
include the bearer token.

When signed in, the user-facing movie screens load movies, categories, reviews,
and the current user's watchlist from the API. Review and watchlist changes are
sent to their API endpoints. API failures are shown in the user layout rather
than silently switching to local demo data.

The backend must be running at the configured API URL. Set
`VITE_API_BASE_URL` in `.env.local` when it is not `http://localhost:5227`, then
restart Vite after changing the value.

## Admin and author previews

The Admin and Author workspaces are mock-only previews, not protected roles.
During development, use the **Development Role Switcher** in the header to
preview User, Author, and Admin routes. It is hidden in production and does not
grant permissions or send management requests to the API.

The Admin movie manager and Author **Add Movie** screen use the database movie
and category APIs when signed in. Movie creation, editing, and deletion require
a JWT, but the backend does not yet enforce Admin/Author roles: any signed-in
account can call these movie write endpoints. Do not treat the demo role
switcher as authorization.

Admin category/user/review management and Author articles/profile remain
localStorage-only previews. Article management is a proposed frontend feature;
the backend has no article model or endpoint. Profile editing also remains a
local demo preference because the API does not expose a self-service profile
endpoint.

## Checks

```sh
npm run lint
npm run build
```
