# rcTrackTimer

### ▶️ [Open rcTrackTimer](https://volkerjooss.github.io/rcTrackTimer/)

Runs straight in the browser at
**[volkerjooss.github.io/rcTrackTimer](https://volkerjooss.github.io/rcTrackTimer/)** —
no installation, no sign-up. Open it on the phone or tablet you take to the
track and add it to your home screen.

rcTrackTimer is used to organize training sessions on RC race tracks.
RC models differ greatly in speed and lap times, so each class needs its own
timeslots on the race track. This web application creates and displays a
schedule that reserves track time for each class.

### Setup view

- Create and update the schedule of classes.
- Each entry has a **class name**, a **duration in minutes**, and a **color**.
- Up to **10 entries** can be created, each shown in its own color.
- Configure the session **start time** and **end time**.
- Reorder entries or remove them at any time.
- On narrow / mobile screens the class name and duration stack into separate
  rows for easy editing.

### Timer view

- The class list runs from the start time and **repeats** until the configured
  end time is reached (sessions crossing midnight are supported).
- The **current class** is shown prominently in its own color together with a
  live **countdown** of the remaining time.
- A list of the **next four upcoming** classes is shown alongside it.
- The layout adapts automatically to **portrait and landscape** orientation and
  scales to fill the full screen.

The schedule is stored individually based on the connected browser session
(via `localStorage`); there is no backend or account.

## Tech stack

- **React 18 + TypeScript** – component-based UI with a typed schedule data model
- **Vite** – dev server and optimized static build
- **React Router (HashRouter)** – `Timer` and `Setup` views, works on GitHub Pages without server config
- **localStorage** – schedule persisted per browser session (no backend required)
- Plain CSS for styling (responsive, orientation-aware layout)

## Development

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173/rcTrackTimer/)
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build locally
```

## Deploy to GitHub Pages

The app is configured for a project Page served at the URL linked at the top of
this file (see `base` in `vite.config.ts`).

1. Push this repository to GitHub with the name **rcTrackTimer**.
   If you use a different repo name, update `base` in `vite.config.ts` to `'/<repo-name>/'`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml`
   builds the site and publishes it automatically.

A manual alternative is also available via `npm run deploy` (uses the `gh-pages` package).

## License

Released under the [MIT License](LICENSE).
