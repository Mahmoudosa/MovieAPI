# MyMovieApp Frontend

Normal-user React screens for the MyMovieApp movie collection.

## Run locally

```sh
npm install
npm run dev
```

The app uses a shared demo movie collection. Watchlist items, reviews, and demo
profile preferences are stored in the browser's local storage.

Login and registration call the existing API routes:

- `POST /api/auth/login`
- `POST /api/auth/register`

The API base URL defaults to `http://localhost:5227`. To use another local API,
set `VITE_API_BASE_URL` in a `.env.local` file, for example:

```dotenv
VITE_API_BASE_URL=http://localhost:5227
```

The login screen does not persist the returned JWT or mark the user as
authenticated. Protected API integration and server-backed movie, review, and
watchlist data remain future work.

## Admin and author previews

The Admin and Author workspaces are mock-only previews, not protected roles.
During development, use the **Development Role Switcher** in the header to
preview User, Author, and Admin routes. It is hidden in production and does not
grant permissions or send management requests to the API.

Admin catalog/users/review data and Author articles/profile are stored in
separate browser local-storage keys. Admin movie and category edits are shared
with the user movie screens. Article management is a proposed frontend feature;
the backend has no confirmed article model or endpoint.

## Checks

```sh
npm run lint
npm run build
```
