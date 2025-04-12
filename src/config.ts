import type { ImmutableObject } from 'seamless-immutable'

export interface Config {
  selectedLayerIds: string[];
}

export type IMConfig = ImmutableObject<Config>
voila config.json:
{
  "filterField": ""
}