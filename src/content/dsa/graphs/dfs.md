---
title: "Breadth-First Search on Graphs"
description: "How to use a Queue to visit nodes level-by-level in a graph, and how to avoid cycles using a Visited set."
date: 2026-06-23
tags: ["graphs", "algorithms"]
---

Breadth-First Search (BFS) is a graph traversal algorithm that begins at a root node and explores all neighboring nodes at the current depth before moving to the next level.

Unlike trees, graphs can contain cycles. To prevent infinite loops, we must keep track of visited nodes using a `set`.
