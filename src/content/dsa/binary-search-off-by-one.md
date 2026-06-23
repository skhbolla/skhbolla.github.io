---
title: "Why binary search is so easy to get wrong"
description: "The off-by-one bugs in binary search aren't carelessness — they come from an ambiguous loop invariant."
date: 2026-06-10
tags: ["binary-search", "fundamentals"]
---

Binary search is one of the first non-trivial algorithms most people learn,
and one of the few that programmers reliably get wrong years into their
careers — not from carelessness, but from an ambiguous loop invariant.

## The invariant that matters

Most implementations maintain some version of: "the answer, if it exists,
is somewhere in `[lo, hi]`." The bugs creep in at the boundary — whether
`hi` is inclusive or exclusive, and what that means for the loop condition
and the update step.

```python
def search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```


This is a plain `.md` post — no interactive diagram needed here, just text
and code. Compare this to the mechanical sympathy posts, where the `.mdx`
posts pull in actual diagram components.
