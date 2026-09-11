import PerlinNoise from './PerlinNoise.astro';
import LSystem from './LSystem.astro';
import Boids from './Boids.astro';
import Bfs from './Bfs.astro';
import Dfs from './Dfs.astro';
import Dijkstra from './Dijkstra.astro';
import GalaxySampler from './GalaxySampler.astro';
import Kruskal from './Kruskal.astro';

export const islands: Record<string, any> = {
  'perlin-noise': PerlinNoise,
  'l-system': LSystem,
  boids: Boids,
  bfs: Bfs,
  dfs: Dfs,
  dijkstra: Dijkstra,
  'galaxy-sampler': GalaxySampler,
  kruskal: Kruskal,
};
