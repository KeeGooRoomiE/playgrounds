import PerlinNoise from './PerlinNoise.astro';
import LSystem from './LSystem.astro';
import Boids from './Boids.astro';
import Bfs from './Bfs.astro';
import Dfs from './Dfs.astro';
import Dijkstra from './Dijkstra.astro';
import GalaxySampler from './GalaxySampler.astro';
import Kruskal from './Kruskal.astro';
import Hamiltonian from './Hamiltonian.astro';
import BrownianTree from './BrownianTree.astro';
import Sorting from './Sorting.astro';
import Sandbox from './Sandbox.astro';
import GameOfLife from './GameOfLife.astro';
import AStar from './AStar.astro';
import Easing from './Easing.astro';
import Springs from './Springs.astro';
import Verlet from './Verlet.astro';
import Splines from './Splines.astro';

export const islands: Record<string, any> = {
  'perlin-noise': PerlinNoise,
  'l-system': LSystem,
  boids: Boids,
  bfs: Bfs,
  dfs: Dfs,
  dijkstra: Dijkstra,
  'galaxy-sampler': GalaxySampler,
  kruskal: Kruskal,
  hamiltonian: Hamiltonian,
  'brownian-tree': BrownianTree,
  sorting: Sorting,
  sandbox: Sandbox,
  'game-of-life': GameOfLife,
  'a-star': AStar,
  easing: Easing,
  springs: Springs,
  verlet: Verlet,
  splines: Splines,
};
