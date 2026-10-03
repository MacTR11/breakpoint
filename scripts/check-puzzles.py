# Independently recomputes puzzle answers, so a wrong "correct answer" is caught
# before students meet it. Run with: python3 scripts/check-puzzles.py
#
# Two kinds of check:
#   1. A puzzle whose meta has "check": "run" has the first Python block in its
#      question executed, and what it prints (or the error it raises) must match
#      the marked answer.
#   2. Puzzles traced by hand are recomputed below from first principles.
import contextlib, io, itertools, json, math, os, re

d = os.path.join(os.path.dirname(__file__), '..', 'content', 'problems')
computed = {}

# --- data structures ---
q = []
for op in ['A', 'B', None, 'C', 'D', None, 'E']:
    q.pop(0) if op is None else q.append(op)
computed['queue-trace'] = ', '.join(q)

table = [None] * 7
for k in [15, 9, 22, 30]:
    p = k % 7
    while table[p] is not None: p = (p + 1) % 7
    table[p] = k
computed['hash-probing'] = 'Position ' + str(table.index(30))

tree = {'M': ('F', 'T'), 'F': ('C', 'H'), 'T': ('P', 'W')}
def post(n): return (post(tree[n][0]) + post(tree[n][1]) if n in tree else []) + [n]
computed['post-order-trace'] = ' '.join(post('M'))

stack, popped = [], []
for op in [1, 2, 3, None, 4, None, None]:
    popped.append(stack.pop()) if op is None else stack.append(op)
computed['stack-result'] = ', '.join(map(str, popped))

def bst_insert(node, v):
    if node is None: return [v, None, None]
    side = 1 if v < node[0] else 2
    node[side] = bst_insert(node[side], v)
    return node
root = None
for v in [50, 30, 70, 20, 40, 60, 80, 65]: root = bst_insert(root, v)
path, node = [], root
while node:
    path.append(node[0]); node = node[1] if 45 < node[0] else node[2]
computed['bst-search-path'] = ', '.join(map(str, path))

# --- searching and sorting ---
computed['binary-search-worst'] = str(math.floor(math.log2(1000)) + 1)
def midpoints(items, target):
    low, high, seen = 0, len(items) - 1, []
    while low <= high:
        mid = (low + high) // 2; seen.append(items[mid])
        if items[mid] == target: break
        if items[mid] < target: low = mid + 1
        else: high = mid - 1
    return ', '.join(map(str, seen))
computed['binary-midpoints'] = midpoints([3, 8, 12, 17, 21, 26, 30, 35, 41], 26)
computed['binary-midpoints-2'] = midpoints([2, 5, 9, 14, 20, 27, 33, 40, 48, 55, 61], 14)

def bubble_pass(a):
    a = list(a); swapped = False
    for i in range(len(a) - 1):
        if a[i] > a[i + 1]: a[i], a[i + 1] = a[i + 1], a[i]; swapped = True
    return a, swapped
computed['one-pass'] = ' '.join(map(str, bubble_pass([5, 2, 8, 1, 4])[0]))
computed['bubble-first-pass'] = ' '.join(map(str, bubble_pass([5, 1, 4, 2, 8])[0]))
a, passes, swapped = [2, 1, 3, 4, 5], 0, True
while swapped: a, swapped = bubble_pass(a); passes += 1
computed['bubble-early-stop'] = str(passes)

a = [7, 3, 9, 2, 5]
for i in range(1, 4):
    c = a[i]; j = i - 1
    while j >= 0 and a[j] > c: a[j + 1] = a[j]; j -= 1
    a[j + 1] = c
computed['insertion-trace'] = ' '.join(map(str, a))
a, comparisons = [1, 2, 3, 4, 5, 6], 0
for i in range(1, len(a)):
    j = i - 1
    while j >= 0:
        comparisons += 1
        if a[j] <= a[j + 1]: break
        a[j], a[j + 1] = a[j + 1], a[j]; j -= 1
computed['insertion-best'] = str(comparisons)

l, r, comps = [2, 9], [4, 5], 0
while l and r:
    comps += 1; (l if l[0] <= r[0] else r).pop(0)
computed['merge-comparisons'] = str(comps)
computed['merge-levels'] = str(int(math.log2(16)))
items = [6, 3, 9, 1, 8, 2]; pivot = items[0]
computed['quick-partition-trace'] = ' '.join(map(str, [i for i in items[1:] if i < pivot] + [pivot] + [i for i in items[1:] if i >= pivot]))

# --- tracing pseudocode ---
position = 0
for _ in range(4): position += 3; position -= 1
computed['tram-loop'] = 'Stop ' + str(position)
def digit_sum(n):
    total = 0
    while n > 0: total += n % 10; n //= 10
    return total
computed['mystery-function'] = str(digit_sum(4072))
computed['light-switches'] = str(sum(1 for a, b, c in itertools.product([0, 1], repeat=3) if (a and not b) or c))
x, count = 20, 0
while x > 1: x //= 2; count += 1
computed['while-div'] = str(count)
computed['substring'] = 'Algorithm'[2:6].upper() + str(len('Algorithm'))
computed['by-ref'] = str(1 + (2 + 20))
def mystery(n): return 1 if n <= 1 else n * mystery(n - 2)
computed['recursion-odd'] = str(mystery(7))
def gcd(a, b): return a if b == 0 else gcd(b, a % b)
computed['recursion-gcd'] = str(gcd(48, 18))

# --- algorithms ---
nodes = {'P': (4, 9), 'Q': (6, 5), 'R': (2, 12), 'S': (7, 6)}
computed['a-star-choice'] = 'Route ' + min(nodes, key=lambda k: sum(nodes[k]))
adj = {}
for x, y in ['AB', 'AC', 'BD', 'BE', 'CF', 'EF']: adj.setdefault(x, []).append(y); adj.setdefault(y, []).append(x)
seen = []
def dfs(n):
    seen.append(n)
    for m in sorted(adj[n]):
        if m not in seen: dfs(m)
dfs('A'); computed['depth-first-order'] = ' '.join(seen)
g = [[3, 1, 4], [1, 5, 9], [2, 6, 5]]
best = [[0] * 3 for _ in range(3)]
for r_ in range(3):
    for c_ in range(3):
        best[r_][c_] = g[r_][c_] + max(best[r_ - 1][c_] if r_ else 0, best[r_][c_ - 1] if c_ else 0)
computed['seagull-chips'] = str(best[2][2])
edges = {('Tower', 'Arcade'): 2, ('Tower', 'Station'): 3, ('Tower', 'Pier'): 4, ('Arcade', 'Pier'): 1, ('Pier', 'Zoo'): 5, ('Station', 'Zoo'): 7, ('Arcade', 'Zoo'): 8}
dist = {n: math.inf for e in edges for n in e}; dist['Tower'] = 0
for _ in dist:
    for (u, v), w in edges.items():
        dist[v] = min(dist[v], dist[u] + w); dist[u] = min(dist[u], dist[v] + w)
computed['seafront-walk'] = '%d minutes' % dist['Zoo']

def run_block(description):
    """Run the first Python block in a question; return what it printed, or the error it raised."""
    code = re.search(r'```python\n(.*?)```', description, re.S).group(1)
    out = io.StringIO()
    try:
        with contextlib.redirect_stdout(out):
            exec(code, {'__name__': 'puzzle'})
    except Exception as error:
        return type(error).__name__
    return ' '.join(out.getvalue().split())

bad = checked = unchecked = 0
used = set()
for fn in sorted(os.listdir(d)):
    slug = re.match(r'\d+-(.+)\.md', fn).group(1)
    text = open(os.path.join(d, fn)).read()
    meta = json.loads(text.split('--- description')[0].replace('--- meta', ''))
    if meta['kind'] != 'PUZZLE' or meta.get('style') == 'TRACE': continue
    marked = meta['options'][meta['answer']]
    if meta.get('check') == 'run':
        got = run_block(text.split('--- description')[1].split('\n--- ')[0])
        ok = marked == got or (got.endswith('Error') and got in marked)
    elif slug in computed:
        got = computed[slug]; used.add(slug); ok = marked == got
    else:
        unchecked += 1; continue
    checked += 1; bad += not ok
    if not ok: print('BAD  %-28s marked=%r computed=%r' % (slug, marked, got))
stale = set(computed) - used
if stale: print('No file for:', ', '.join(sorted(stale)))
print('%d puzzle answers recomputed, %d disagree. %d puzzles rest on judgement and were not checked.' % (checked, bad, unchecked))
raise SystemExit(1 if bad else 0)
