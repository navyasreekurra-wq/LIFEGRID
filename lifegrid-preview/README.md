# LIFEGRID Preview

This is a local Vite + React wrapper around the supplied LIFEGRID TSX file. It is a simulated-data hackathon prototype, not a real emergency service.

## Run locally

1. Install Node.js 20 or newer.
2. Extract this ZIP.
3. Open a terminal in the `lifegrid-preview` folder.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed by Vite (usually `http://localhost:5173`).

To test a production build, run `npm run build`.

## Important limitations

- Data is stored in browser `localStorage`; there is no backend API or server database in this package.
- Role selection is a demo navigation feature, not authentication or server-side authorization.
- Maps, ETA, availability, notifications, and resource coordination are simulated.
- Do not use this prototype for real emergencies or clinical decisions.
