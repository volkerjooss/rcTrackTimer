# rcTrackTimer


rcTrackTimer is uses to organize trainig session on RC race tracks.
RC Models are very different in speed and lap times, so each class needs own timeslots on the race track.
This web application will create and show a schedule to reserve track time for each class.

On the setup view, the schedule can be create and updated, each entry of the schedule contains the class name and the time duration nin.
A list of max 10 entries can be created, each entry is shown in a different color.
In addition the start time can be configured as well

On the main view, the current schdules class is displayed and a count down of the remaining time for the class is shown.
The current class is shown very prominent and with the class color, in addition a list of the next three upcoming classes is also shown.

The schedule is stored individually based on the connected browser session.

## Tech stack

- **React 18 + TypeScript** – component-based UI with a typed schedule data model
- **Vite** – dev server and optimized static build
- **React Router (HashRouter)** – `Timer` and `Setup` views, works on GitHub Pages without server config
- **localStorage** – schedule persisted per browser session (no backend required)
- Plain CSS for styling

## Development

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173/rcTrackTimer/)
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build locally
```

## Deploy to GitHub Pages

The app is configured for a project Page served at
`https://<your-user>.github.io/rcTrackTimer/` (see `base` in `vite.config.ts`).

1. Push this repository to GitHub with the name **rcTrackTimer**.
   If you use a different repo name, update `base` in `vite.config.ts` to `'/<repo-name>/'`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml`
   builds the site and publishes it automatically.

A manual alternative is also available via `npm run deploy` (uses the `gh-pages` package).