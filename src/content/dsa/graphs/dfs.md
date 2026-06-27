---
title: "Depth-First Search on Graphs"
description: "How to use a Queue to visit nodes level-by-level in a graph, and how to avoid cycles using a Visited set."
date: 2026-06-23
tags: ["graphs", "algorithms"]
---

Depth-First Search (DFS) is a graph traversal algorithm that begins at a root node and explores as far as possible along each branch before backtracking.

Unlike trees, graphs can contain cycles. To prevent infinite loops, we must keep track of visited nodes using a `set`.

```python title="dfs.py" {2} ins={5,8-9} del={6}
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
        
    visited.add(start)
    # print(start) # Old debug statement
    
    for next_node in graph[start] - visited:
        dfs(graph, next_node, visited)
        
    return visited
```

```javascript title="dfs.js"
function dfs(graph, start, visited = new Set()) {
    visited.add(start);
    
    for (const nextNode of graph[start]) {
        if (!visited.has(nextNode)) {
            dfs(graph, nextNode, visited);
        }
    }
    
    return visited;
}
```
