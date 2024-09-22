class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

function dijkstra(graph, source, dest) {
  const dist = Array(26).fill(Infinity);
  const path = Array(26).fill(null);
  dist[source.charCodeAt(0) - 65] = 0;
  path[source.charCodeAt(0) - 65] = source;

  const pq = new PriorityQueue();
  pq.enqueue(source, 0);

  while (!pq.isEmpty()) {
    const { val: u, priority: d } = pq.dequeue();

    for (const [neigh, weight] of graph[u.charCodeAt(0) - 65]) {
      const v = String.fromCharCode(neigh + 65);
      if (dist[neigh] > d + weight) {
        dist[neigh] = d + weight;
        path[neigh] = u;
        pq.enqueue(v, dist[neigh]);
      }
    }
  }

  const pathVector = [];
  let u = dest;
  while (u !== source) {
    pathVector.push(u);
    u = path[u.charCodeAt(0) - 65];
  }
  pathVector.push(source);
  pathVector.reverse(); // Reverse the order to start from the source

  const shortestDistance = dist[dest.charCodeAt(0) - 65];

  // Return the shortest distance and path vector
  return {
    shortestDistance,
    pathVector,
  };

  // Print the distance vector for nodes that are part of the graph
  // console.log("Distance vector is:");
  // for (let i = 0; i < 26; ++i) {
  //   if (dist[i] !== Infinity) {
  //     console.log(`${String.fromCharCode(65 + i)}(${dist[i]}) `);
  //   }
  // }
}

function buildGraphFromInput(input) {
  const graph = Array.from({ length: 26 }, () => []);

  input.forEach((node) => {
    const nodeIndex = node.nodeValue.charCodeAt(0) - 65;
    const edges = node.edgeValue.split(",");

    edges.forEach((edge) => {
      if (edge) {
        const neighbor = edge[0]; // The connected node
        const weight = parseInt(edge.slice(1)); // The weight
        graph[nodeIndex].push([neighbor.charCodeAt(0) - 65, weight]);
      }
    });
  });

  return graph;
}

export function Dijsktra_Navigator(graphInput,source,dest) {

  const graph = buildGraphFromInput(graphInput);

  // Print the graph
  // for (let i = 0; i < 26; ++i) {
  //   if (graph[i].length === 0) continue;

  //   const edges = graph[i].map(
  //     ([v, w]) => `${String.fromCharCode(65 + v)}(${w})`
  //   );
  //   console.log(`${String.fromCharCode(65 + i)}: ${edges.join(" ")}`);
  // }

  const {shortestDistance,pathVector} = dijkstra(graph, source, dest);
  return {
    shortestDistance,
    pathVector,
  }
}
