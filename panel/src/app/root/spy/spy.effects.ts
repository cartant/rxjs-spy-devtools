import { LogPluginEffects } from './plugin/log-plugin.effects';
import { PausePluginEffects } from './plugin/pause-plugin.effects';
import { ServiceEffects } from './service/service.effects';

export const EFFECTS = [LogPluginEffects, PausePluginEffects, ServiceEffects];
