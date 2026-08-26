import DefaultBackground from './DefaultBackground.astro';
import PlayStationWaves from './PlayStationWaves.astro';
import PlayStationWavesVaporwave from './PlayStationWavesVaporwave.astro';

// Available, opt-in only — none of these are set on any playground's
// frontmatter yet. Add `background: <key>` to a playground's .md to use one.
export const backgrounds: Record<string, any> = {
  default: DefaultBackground,
  'playstation-waves': PlayStationWaves,
  'playstation-waves-vaporwave': PlayStationWavesVaporwave,
};
