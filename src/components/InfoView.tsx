export default function InfoView() {
  return (
    <section className="info">
      <h2 className="info-title">About RC Track Timer</h2>

      <p className="info-lead">
        RC Track Timer helps organize training sessions on RC race tracks. RC
        models differ greatly in speed and lap times, so each class needs its own
        timeslots on the track. This app builds a schedule and shows, at a glance,
        which class is on track right now and which classes are coming up.
      </p>

      <h3 className="info-heading">How to use it</h3>
      <ul className="info-list">
        <li>
          Open <strong>Setup</strong> to define your session: set the start and
          end time and add up to 10 classes, each with a name, a duration in
          minutes, and a color.
        </li>
        <li>
          Switch to the <strong>Timer</strong> view during the session. The class
          list runs from the start time and repeats until the end time is reached.
        </li>
        <li>
          The current class is shown prominently in its color with a live
          countdown, together with the next four upcoming classes.
        </li>
      </ul>

      <h3 className="info-heading">Good to know</h3>
      <ul className="info-list">
        <li>
          The schedule is stored only in your browser (via local storage). There
          is no account and no server — your data never leaves your device.
        </li>
        <li>
          Because it is stored per browser, the schedule is private to the device
          and browser you set it up on.
        </li>
        <li>The layout adapts to portrait and landscape and fills the screen.</li>
      </ul>

      <h3 className="info-heading">Project</h3>
      <p className="info-text">
        Built with React, TypeScript and Vite. Released under the MIT License.
      </p>
      <p className="info-text">
        Source code:{' '}
        <a
          className="info-link"
          href="https://github.com/volkerjooss/rcTrackTimer"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/volkerjooss/rcTrackTimer
        </a>
      </p>
    </section>
  )
}
