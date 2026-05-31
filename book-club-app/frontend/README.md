# Book Club Exchange Frontend

Day 1 React frontend foundation for the Book Club Member Connection / Book Exchange App.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Available Routes

- `/` redirects to `/books`
- `/login`
- `/register`
- `/books`
- `/books/add`
- `/my-books`
- `/transactions`
- `/points/history`

## Environment

Create a local `.env` file if you need to override the API URL.

```bash
VITE_API_URL=http://localhost:5000/api
```

## Day 1 Notes

- The frontend uses mock data only.
- The backend is not connected yet.
- Form submissions log data to the browser console.
- Axios is prepared in `src/services/apiClient.js` for future API integration.
