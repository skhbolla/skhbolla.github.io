---
title: "Binary Tree Traversals"
description: "DFS vs BFS. Practical guide to Preorder, Inorder, and Postorder recursive and iterative implementations."
date: 2026-06-22
tags: ["trees", "algorithms"]
---

Traversing a binary tree means visiting all nodes in a specific order. There are two primary categories of traversals: Depth-First Search (DFS) and Breadth-First Search (BFS).

## Depth-First Search (DFS)

There are three common ordering invariants in DFS:
1. **Preorder (Root, Left, Right):** Good for copying trees.
2. **Inorder (Left, Root, Right):** Visits nodes in sorted order for Binary Search Trees (BST).
3. **Postorder (Left, Right, Root):** Good for deleting trees or calculating tree size/height recursively.
