import { errorBase } from '@app/shared/utils';
import { action, base, Ctor } from 'ts-action';

function IdBase() {
  return base(class { constructor(public spyId: string) {} });
}

function pluginIdCommandBase() {
  return base(class { constructor(public spyId: string, public pluginId: string, public command: string) {} });
}

function pluginIdBase() {
  return base(class { constructor(public spyId: string, public pluginId: string) {} });
}

export const Log = action('[Spy] LOG', IdBase());
export const LogFulfilled = action('[Spy] LOG_FULFILLED', pluginIdBase());
export const LogRejected = action('[Spy] LOG_REJECTED', errorBase(Log));

export const LogTeardown = action('[Spy] LOG_TEARDOWN', pluginIdBase());
export const LogTeardownFulfilled = action('[Spy] LOG_TEARDOWN_FULFILLED', pluginIdBase());
export const LogTeardownRejected = action('[Spy] LOG_TEARDOWN_REJECTED', errorBase(LogTeardown));

export const Pause = action('[Spy] PAUSE', IdBase());
export const PauseFulfilled = action('[Spy] PAUSE_FULFILLED', pluginIdBase());
export const PauseRejected = action('[Spy] PAUSE_REJECTED', errorBase(Pause));

export const PauseCommand = action('[Spy] PAUSE_COMMAND', pluginIdCommandBase());
export const PauseCommandFulfilled = action('[Spy] PAUSE_COMMAND_FULFILLED', pluginIdCommandBase());
export const PauseCommandRejected = action('[Spy] PAUSE_COMMAND_REJECTED', errorBase(PauseCommand));

export const PauseTeardown = action('[Spy] PAUSE_TEARDOWN', pluginIdBase());
export const PauseTeardownFulfilled = action('[Spy] PAUSE_TEARDOWN_FULFILLED', pluginIdBase());
export const PauseTeardownRejected = action('[Spy] PAUSE_TEARDOWN_REJECTED', errorBase(PauseTeardown));
