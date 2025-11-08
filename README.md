# Star Wars Character Dashboard

A React + Redux Toolkit project to browse Star Wars characters with search, filtering, pagination, and dynamic images.

---

## How to Run

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser at [http://localhost:5173](http://localhost:5173).

---

## Features Implemented

- **Search by Name:** Partial match search for characters.
- **Filters:** Filter characters by species, homeworld, and films.
- **Pagination:** Navigate between pages of characters.
- **Character Modal:** Click on a character to view details.
- **Dynamic Images:** Character images fetched dynamically from Unsplash.
- **Optimized Dropdowns:** Filter options derived from loaded characters, no unnecessary API calls.
- **Combined Search + Filter:** Works together seamlessly.

---

## Bonus / Extras

- Debounced search input for better performance.
- Cached API requests for species, planets, and films to reduce network calls.
- Clean, responsive UI with dark mode support.

---

## Design Choices / Trade-offs

- **Unsplash for images:** No official Star Wars character images API available; using Unsplash ensures dynamic images but may not always match the exact character.
- **Filtering logic:** Filters are applied via additional API calls when possible, otherwise locally on fetched characters.
- **Pagination:** Simple page-based pagination, relies on SWAPI’s page parameter.
- **Local state caching:** Resource names (films, species, homeworld) cached to avoid repeated fetches.

---

## Notes

- SWAPI API is sometimes rate-limited; caching and local filtering help reduce requests.
- All features are implemented in a single-page React app using Redux Toolkit for state management.

