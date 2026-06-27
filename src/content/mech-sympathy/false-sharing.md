---
title: "False Sharing"
subtitle: "How CPU cache architectures can ruin your multi-threaded performance, and what you can do about it."
author: "Srikanth Bolla"
heroImage: "../../assets/hero.webp"
description: "A deep dive into cache lines, memory access patterns, and the invisible performance killers in concurrent programming."
date: 2024-03-15
tags: ["caching", "concurrency"]
---

Most of the time a cache line behaves exactly like you'd expect: each core
keeps its own copy, reads are free, writes get reconciled by the coherence
protocol without you ever thinking about it.

## The Physical Reality

Until two threads write to *adjacent but unrelated* fields that happen to
live on the same line.

If `x` is updated by thread A and `y` by thread B, the two threads are
logically unrelated — but physically, every write to `x` invalidates the
entire line, including `y`, on every other core. The two threads end up
fighting over cache coherence traffic for fields they don't even share.

### Coherence Traffic Cost

This is false sharing, and the fix is the part that looks wrong at first:

## The Counter-Intuitive Fix

```c
struct Counters {
    atomic_long x;
    char pad1[56];   // push y onto its own cache line
    atomic_long y;
    char pad2[56];
};
```


Deliberately wasting 112 bytes of padding to make the struct *faster* is
the kind of thing that only makes sense once you've internalized that the
cache line, not the byte, is the real unit of cost.

This post is `.mdx` specifically because of the diagram component above —
everything that doesn't need an embedded component stays in plain `.md`,
like the binary search post in the DSA section.
