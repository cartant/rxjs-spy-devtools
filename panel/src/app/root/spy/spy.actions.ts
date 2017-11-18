import { Notification, Snapshot as SnapshotPayload } from '@devtools/interfaces';
import { action, base, Ctor } from 'ts-action';

function errorBase<T>(actionCtor: Ctor<T>) {
  return base(class { constructor(public error: string, public request: T) {} });
}

function deckBase() {
  return base(class { constructor(public pluginId: string, public deck: string) {} });
}

function matchBase() {
  return base(class { constructor(public match: string) {} });
}

function pluginIdBase() {
  return base(class { constructor(public pluginId: string) {} });
}

export const Connect = action('[Spy] CONNECT');
export const Disconnect = action('[Spy] DISCONNECT');

export const DeckClear = action('[Spy] DECK_CLEAR', deckBase());
export const DeckClearFulfilled = action('[Spy] DECK_CLEAR_FULFILLED', deckBase());
export const DeckClearRejected = action('[Spy] DECK_CLEAR_REJECTED', errorBase(DeckClear));

export const DeckPause = action('[Spy] DECK_PAUSE', deckBase());
export const DeckPauseFulfilled = action('[Spy] DECK_PAUSE_FULFILLED', deckBase());
export const DeckPauseRejected = action('[Spy] DECK_PAUSE_REJECTED', errorBase(DeckPause));

export const DeckResume = action('[Spy] DECK_RESUME', deckBase());
export const DeckResumeFulfilled = action('[Spy] DECK_RESUME_FULFILLED', deckBase());
export const DeckResumeRejected = action('[Spy] DECK_RESUME_REJECTED', errorBase(DeckResume));

export const DeckSkip = action('[Spy] DECK_SKIP', deckBase());
export const DeckSkipFulfilled = action('[Spy] DECK_SKIP_FULFILLED', deckBase());
export const DeckSkipRejected = action('[Spy] DECK_SKIP_REJECTED', errorBase(DeckSkip));

export const DeckStep = action('[Spy] DECK_STEP', deckBase());
export const DeckStepFulfilled = action('[Spy] DECK_STEP_FULFILLED', deckBase());
export const DeckStepRejected = action('[Spy] DECK_STEP_REJECTED', errorBase(DeckStep));

export const Log = action('[Spy] LOG', matchBase());
export const LogFulfilled = action('[Spy] LOG_FULFILLED', pluginIdBase());
export const LogRejected = action('[Spy] LOG_REJECTED', errorBase(Log));

export const LogTeardown = action('[Spy] LOG_TEARDOWN', pluginIdBase());
export const LogTeardownFulfilled = action('[Spy] LOG_TEARDOWN_FULFILLED', pluginIdBase());
export const LogTeardownRejected = action('[Spy] LOG_TEARDOWN_REJECTED', errorBase(LogTeardown));

export const Notify = action('[Spy] NOTIFY', base(class { constructor(public notification: Notification) {} }));

export const Pause = action('[Spy] PAUSE', matchBase());
export const PauseFulfilled = action('[Spy] PAUSE_FULFILLED', pluginIdBase());
export const PauseRejected = action('[Spy] PAUSE_REJECTED', errorBase(Pause));

export const PauseTeardown = action('[Spy] PAUSE_TEARDOWN', pluginIdBase());
export const PauseTeardownFulfilled = action('[Spy] PAUSE_TEARDOWN_FULFILLED', pluginIdBase());
export const PauseTeardownRejected = action('[Spy] PAUSE_TEARDOWN_REJECTED', errorBase(PauseTeardown));

export const Snapshot = action('[Spy] SNAPSHOT');
export const SnapshotFulfilled = action('[Spy] SNAPSHOT_FULFILLED', base(class { constructor(public snapshot: SnapshotPayload) {} }));
export const SnapshotRejected = action('[Spy] SNAPSHOT_REJECTED', errorBase(Snapshot));
