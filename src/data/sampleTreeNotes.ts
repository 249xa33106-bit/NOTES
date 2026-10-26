import { NoteDocument } from '../types';

export const SAMPLE_TREE_NOTES: NoteDocument = {
  id: 'tree-data-structures-btech',
  title: 'Data Structures — Trees (Complete Academic & Technical Reference)',
  subject: 'Computer Science & Engineering',
  topic: 'Data Structures — Trees',
  educationLevel: 'B.Tech / Undergraduate',
  depth: 'detailed',
  examFormat: 'Semester Exam Format (2, 5, 10 marks)',
  preferredLanguage: 'Python',
  createdAt: '2026-10-26T10:00:00.000Z',
  updatedAt: '2026-10-26T10:00:00.000Z',
  tags: ['Data Structures', 'Algorithms', 'Trees', 'BST', 'AVL', 'Heaps', 'B-Trees', 'B.Tech CS'],
  metadata: {
    generationDurationMs: 4200,
    wordCount: 4850,
    diagramCount: 8,
    codeBlockCount: 4,
    sourceFileName: 'Syllabus_Unit3_TreeDataStructures.pdf',
    aiModel: 'Lumixora High-Fidelity Academic Engine',
  },
  tableOfContents: [
    { id: 'sec-intro', title: '1. Introduction & Learning Objectives', level: 2 },
    { id: 'sec-terminology', title: '2. Formal Tree Terminology & Anatomy', level: 2 },
    { id: 'sec-types', title: '3. Classification of Binary Trees', level: 2 },
    { id: 'sec-formulas', title: '4. Mathematical Formulas, Properties & Derivations', level: 2 },
    { id: 'sec-representation', title: '5. Memory Representations (Array vs Linked)', level: 2 },
    { id: 'sec-traversals', title: '6. Tree Traversal Algorithms (Recursive & Iterative)', level: 2 },
    { id: 'sec-bst', title: '7. Binary Search Trees (BST) — Operations & Deletion Cases', level: 2 },
    { id: 'sec-avl', title: '8. Self-Balancing AVL Trees & The 4 Rotations', level: 2 },
    { id: 'sec-advanced', title: '9. Advanced Trees: Heaps, B-Trees & Tries', level: 2 },
    { id: 'sec-complexity', title: '10. Comprehensive Complexity Analysis Table', level: 2 },
    { id: 'sec-programs', title: '11. Complete Verified Implementations (Python & C)', level: 2 },
    { id: 'sec-exam-qa', title: '12. University Exam Short & Long Questions', level: 2 },
    { id: 'sec-mcqs', title: '13. Practice MCQs & Viva Voce Q&A', level: 2 },
    { id: 'sec-revision', title: '14. Quick Revision Summary & Formula Cheatsheet', level: 2 },
  ],
  sections: [
    // Section 1
    {
      id: 'sec-intro',
      title: '1. Introduction & Learning Objectives',
      category: 'intro',
      blocks: [
        {
          id: 'b-intro-1',
          type: 'paragraph',
          content: 'A tree is a fundamental non-linear, hierarchical data structure composed of nodes connected by directed or undirected edges. Unlike linear structures (arrays, linked lists, stacks, and queues) where elements are arranged sequentially, trees organize data in hierarchical parent-child relationships, making them optimal for representing file systems, XML/HTML DOM trees, organization charts, routing tables, and database search indexes.',
        },
        {
          id: 'b-intro-callout',
          type: 'callout',
          variant: 'important',
          title: 'Learning Objectives (B.Tech Syllabus Alignment)',
          content: 'Upon mastering this module, you will be able to:\n1. Define and calculate all formal tree metrics (height, depth, degree, balance factor).\n2. Differentiate between Full, Complete, Perfect, and Degenerate Binary Trees.\n3. Formulate and mathematically prove binary tree node relationships (e.g., $n_0 = n_2 + 1$).\n4. Implement recursive and iterative tree traversals (Preorder, Inorder, Postorder, Level-order).\n5. Execute BST search, insertion, and handle all 3 deletion cases without violating the BST invariant.\n6. Trace AVL rotations (LL, RR, LR, RL) to restore balanced tree height in $O(\\log n)$.\n7. Compare operational time/space complexities across BST, AVL, Heaps, and B-Trees for competitive and university examinations.',
        },
      ],
    },

    // Section 2
    {
      id: 'sec-terminology',
      title: '2. Formal Tree Terminology & Anatomy',
      category: 'definitions',
      blocks: [
        {
          id: 'b-term-diag',
          type: 'diagram',
          diagramType: 'mermaid',
          source: `graph TD
    Root["Root Node (A) - Level 0, Height 3"] --> B["Internal Node (B) - Level 1"]
    Root --> C["Internal Node (C) - Level 1"]
    B --> D["Leaf Node (D) - Level 2, Degree 0"]
    B --> E["Internal Node (E) - Level 2"]
    C --> F["Leaf Node (F) - Level 2"]
    C --> G["Internal Node (G) - Level 2"]
    E --> H["Leaf Node (H) - Level 3"]
    G --> I["Leaf Node (I) - Level 3"]

    style Root fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#1e1b4b
    style B fill:#f1f5f9,stroke:#64748b,stroke-width:1.5px
    style C fill:#f1f5f9,stroke:#64748b,stroke-width:1.5px
    style D fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px
    style F fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px
    style H fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px
    style I fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px`,
          caption: 'Figure 2.1: Hierarchical Anatomy of a Tree Structure with Root, Internal, and Leaf Nodes',
          description: 'A standard rooted binary tree illustrating depth, height levels, and node roles.',
        },
        {
          id: 'b-term-table',
          type: 'table',
          caption: 'Table 2.1: Standard Tree Terminology and Precise Definitions',
          headers: ['Term', 'Formal Definition', 'Mathematical / Structural Formula', 'Example in Fig 2.1'],
          rows: [
            ['Root', 'The unique top-level node with no incoming edges (in-degree = 0).', 'Entry point of tree $T$', 'Node A'],
            ['Edge', 'A directed connection between parent node $u$ and child node $v$.', 'Total edges = $n - 1$ where $n$ is total nodes', '(A, B), (A, C)'],
            ['Parent / Child', 'If node $u$ points directly to node $v$, $u$ is parent of $v$, and $v$ is child of $u$.', '$u = \\text{parent}(v)$', 'B is parent of D and E'],
            ['Siblings', 'Nodes that share the exact same immediate parent node.', '$\\text{parent}(u) = \\text{parent}(v)$', 'D and E are siblings (parent B)'],
            ['Leaf Node (Terminal)', 'A node having no children (out-degree = 0).', '$\\text{degree}(v) = 0$', 'D, F, H, I'],
            ['Internal Node (Non-terminal)', 'A node having at least one child node.', '$\\text{degree}(v) \\ge 1$ and $v \\neq \\text{Root}$', 'B, C, E, G'],
            ['Degree of a Node', 'The number of subtrees / children originating from the node.', '$\\text{deg}(v) = |\\text{children}(v)|$', '$\\text{deg}(A)=2, \\text{deg}(E)=1, \\text{deg}(D)=0$'],
            ['Degree of a Tree', 'The maximum degree among all nodes in the tree.', '$\\max_{v \\in V}(\\text{deg}(v))$', 'Degree = 2 (Binary Tree)'],
            ['Level of a Node', 'The count of edges from the root node to the target node.', '$\\text{level}(\\text{root}) = 0$, $\\text{level}(v) = \\text{level}(\\text{parent}) + 1$', 'Level of A = 0, Level of H = 3'],
            ['Depth of a Node', 'Length of the path from root to the node (identical to Level).', '$\\text{depth}(v) = \\text{path\\_length}(\\text{root} \\to v)$', 'Depth of E = 2'],
            ['Height of a Node', 'Length of the longest downward path from that node to a leaf.', '$\\text{height}(\\text{leaf}) = 0$', 'Height of A = 3, Height of E = 1'],
            ['Height of a Tree', 'The height of the root node (maximum level among all nodes).', '$h = \\max_{v \\in V}(\\text{depth}(v))$', '$h = 3$'],
          ],
        },
      ],
    },

    // Section 3
    {
      id: 'sec-types',
      title: '3. Classification of Binary Trees',
      category: 'explanations',
      blocks: [
        {
          id: 'b-types-intro',
          type: 'paragraph',
          content: 'A **Binary Tree** is a specialized tree in which every node has at most two children, referred to as the **left child** and the **right child**. Binary trees are categorized into distinct structural classes based on their completeness and branch balancing:',
        },
        {
          id: 'b-types-diag',
          type: 'diagram',
          diagramType: 'mermaid',
          source: `graph TD
    subgraph Full_Binary_Tree["1. Full / Strict Binary Tree"]
        F1((1)) --> F2((2))
        F1 --> F3((3))
        F2 --> F4((4))
        F2 --> F5((5))
    end

    subgraph Complete_Binary_Tree["2. Complete Binary Tree"]
        C1((1)) --> C2((2))
        C1 --> C3((3))
        C2 --> C4((4))
        C2 --> C5((5))
        C3 --> C6((6))
    end

    subgraph Perfect_Binary_Tree["3. Perfect Binary Tree"]
        P1((1)) --> P2((2))
        P1 --> P3((3))
        P2 --> P4((4))
        P2 --> P5((5))
        P3 --> P6((6))
        P3 --> P7((7))
    end

    subgraph Skewed_Binary_Tree["4. Degenerate / Skewed Tree"]
        S1((1)) --> S2((2))
        S2 --> S3((3))
        S3 --> S4((4))
    end

    style Full_Binary_Tree fill:#f8fafc,stroke:#94a3b8
    style Complete_Binary_Tree fill:#f8fafc,stroke:#94a3b8
    style Perfect_Binary_Tree fill:#f8fafc,stroke:#94a3b8
    style Skewed_Binary_Tree fill:#fef2f2,stroke:#ef4444`,
          caption: 'Figure 3.1: Structural Comparison of Key Binary Tree Types',
          description: 'Visual comparison showing Full, Complete, Perfect, and Degenerate (Skewed) topologies.',
        },
        {
          id: 'b-types-list',
          type: 'list',
          ordered: true,
          items: [
            '**Full (Proper / Strictly) Binary Tree**: Every node has either exactly 0 or exactly 2 children. No node has only 1 child.',
            '**Complete Binary Tree**: All levels are completely filled except possibly the last level, and in the last level, all nodes are positioned as far left as possible. Essential for array-based binary heaps.',
            '**Perfect Binary Tree**: All internal nodes have exactly two children and all leaf nodes are at the exact same depth. Total nodes $n = 2^{h+1} - 1$.',
            '**Balanced Binary Tree**: For every node in the tree, the height difference between its left and right subtrees (Balance Factor) does not exceed 1 ($|h_L - h_R| \\le 1$). Examples include AVL and Red-Black trees.',
            '**Degenerate (Pathological / Skewed) Tree**: Every internal node has exactly one child. Structurally degrades into a linear linked list with worst-case performance $O(n)$ for search, insertion, and deletion.',
          ],
        },
      ],
    },

    // Section 4
    {
      id: 'sec-formulas',
      title: '4. Mathematical Formulas, Properties & Derivations',
      category: 'formulas',
      blocks: [
        {
          id: 'b-formula-p1',
          type: 'paragraph',
          content: 'In university examinations and technical competitive tests (e.g., GATE CS), the following mathematical theorems and counting relations are frequently tested. Formulas assume level of root is $0$ and height $h$ is maximum level.',
        },
        {
          id: 'b-eq-1',
          type: 'equation',
          latex: 'N_{\\text{max}}(\\text{level } i) = 2^i',
          isBlock: true,
          caption: 'Theorem 1: The maximum number of nodes at any level i of a binary tree is 2^i.',
        },
        {
          id: 'b-eq-2',
          type: 'equation',
          latex: 'N_{\\text{max}}(\\text{height } h) = \\sum_{i=0}^h 2^i = 2^0 + 2^1 + 2^2 + \\dots + 2^h = 2^{h+1} - 1',
          isBlock: true,
          caption: 'Theorem 2: The maximum number of nodes in a binary tree of height h is 2^(h+1) - 1.',
        },
        {
          id: 'b-eq-3',
          type: 'equation',
          latex: 'h_{\\text{min}} = \\lceil \\log_2(n + 1) \\rceil - 1 \\quad \\implies \\quad h \\in \\Omega(\\log n)',
          isBlock: true,
          caption: 'Theorem 3: Minimum possible height of a binary tree with n nodes.',
        },
        {
          id: 'b-formula-proof',
          type: 'callout',
          variant: 'formula',
          title: 'Theorem 4 & Formal Proof: Leaf Node Relation (n0 = n2 + 1)',
          content: '**Statement**: In any non-empty binary tree, if $n_0$ is the number of leaf nodes (degree 0) and $n_2$ is the number of internal nodes with degree 2, then:\n$$n_0 = n_2 + 1$$\n\n**Proof by Handshaking / Edge Summation**:\nLet $n$ be total number of nodes, $e$ be total number of edges, and $n_1$ be nodes with degree 1.\n1. Total nodes: $n = n_0 + n_1 + n_2$\n2. In any tree, total edges is one less than total nodes: $e = n - 1$\n3. Every edge terminates at a child node from its parent. Summing outgoing degrees:\n   $$e = 0 \\cdot n_0 + 1 \\cdot n_1 + 2 \\cdot n_2 = n_1 + 2n_2$$\n4. Equating the two expressions for edges $e$:\n   $$n - 1 = n_1 + 2n_2$$\n   $$(n_0 + n_1 + n_2) - 1 = n_1 + 2n_2$$\n5. Subtracting $n_1 + n_2$ from both sides:\n   $$n_0 - 1 = n_2 \\implies n_0 = n_2 + 1$$\n**Hence Proved (Q.E.D.)**',
        },
      ],
    },

    // Section 5
    {
      id: 'sec-representation',
      title: '5. Memory Representations (Array vs Linked)',
      category: 'explanations',
      blocks: [
        {
          id: 'b-rep-p',
          type: 'paragraph',
          content: 'Binary trees can be stored in computer memory using two distinct paradigms: sequential allocation (array-based) and linked allocation (pointer-based).',
        },
        {
          id: 'b-rep-table',
          type: 'table',
          caption: 'Table 5.1: Comparative Analysis of Memory Representations',
          headers: ['Feature', 'Array (Sequential) Representation', 'Linked (Dynamic) Representation'],
          rows: [
            ['Data Structure', '1D Array $A[0 \\dots 2^{h+1}-2]$', 'Doubly/triply-linked pointer nodes'],
            ['Left Child Index', '$2i + 1$ (for 0-based indexing)', '`node->left` pointer'],
            ['Right Child Index', '$2i + 2$ (for 0-based indexing)', '`node->right` pointer'],
            ['Parent Node Index', '$\\lfloor (i - 1) / 2 \\rfloor$', '`node->parent` (if maintained)'],
            ['Space Efficiency', 'Optimal for Complete Binary Trees & Heaps; massive memory waste for sparse/skewed trees ($O(2^h)$ array size for $h$ nodes).', 'Optimal for dynamic trees; consumes pointer overhead (2-3 pointers per node).'],
            ['Insertion / Dynamic Resizing', 'Rigid; requires array reallocation if tree height exceeds allocated size.', 'Flexible; allocate dynamically with `malloc()` or `new` as needed.'],
          ],
        },
      ],
    },

    // Section 6
    {
      id: 'sec-traversals',
      title: '6. Tree Traversal Algorithms (Recursive & Iterative)',
      category: 'algorithms',
      blocks: [
        {
          id: 'b-trav-intro',
          type: 'paragraph',
          content: 'Tree traversal is the process of visiting every node in the tree structure exactly once in a defined order. Traversals are categorized into Depth-First Traversals (Preorder, Inorder, Postorder) and Breadth-First Traversal (Level-Order).',
        },
        {
          id: 'b-trav-diag',
          type: 'diagram',
          diagramType: 'mermaid',
          source: `graph TD
    T4((4)) --> T2((2))
    T4 --> T6((6))
    T2 --> T1((1))
    T2 --> T3((3))
    T6 --> T5((5))
    T6 --> T7((7))

    style T4 fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style T2 fill:#ede9fe,stroke:#7c3aed,stroke-width:1.5px
    style T6 fill:#ede9fe,stroke:#7c3aed,stroke-width:1.5px`,
          caption: 'Figure 6.1: Sample Binary Search Tree for Traversal Demonstration',
          description: 'Balanced BST with keys 1 through 7.',
        },
        {
          id: 'b-trav-table',
          type: 'table',
          caption: 'Table 6.1: Summary of Traversal Orders for Figure 6.1',
          headers: ['Traversal Type', 'Operational Sequence', 'Resulting Sequence for Fig 6.1', 'Primary Use Cases'],
          rows: [
            ['**Preorder (DFS)**', 'Root $\\to$ Left $\\to$ Right', '`4, 2, 1, 3, 6, 5, 7`', 'Tree cloning, prefix expression evaluation (Polish notation), serialization.'],
            ['**Inorder (DFS)**', 'Left $\\to$ Root $\\to$ Right', '`1, 2, 3, 4, 5, 6, 7`', '**Always outputs BST keys in strictly sorted ascending order!**'],
            ['**Postorder (DFS)**', 'Left $\\to$ Right $\\to$ Root', '`1, 3, 2, 5, 7, 6, 4`', 'Tree deallocation/deletion (`free`), postfix expression evaluation (Reverse Polish notation).'],
            ['**Level-Order (BFS)**', 'Level by level (Left to Right)', '`4, 2, 6, 1, 3, 5, 7`', 'Shortest path search in unweighted graphs, serialization, printing tree level-by-level.'],
          ],
        },
        {
          id: 'b-trav-code',
          type: 'code',
          language: 'python',
          caption: 'Python: Recursive & Iterative Level-Order Traversals',
          code: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# 1. Inorder: Left -> Root -> Right (Recursive)
def inorder(root: TreeNode) -> list:
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []

# 2. Preorder: Root -> Left -> Right (Recursive)
def preorder(root: TreeNode) -> list:
    return [root.val] + preorder(root.left) + preorder(root.right) if root else []

# 3. Postorder: Left -> Right -> Root (Recursive)
def postorder(root: TreeNode) -> list:
    return postorder(root.left) + postorder(root.right) + [root.val] if root else []

# 4. Level-Order Traversal (BFS using Queue)
def level_order(root: TreeNode) -> list:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        curr = queue.popleft()
        result.append(curr.val)
        if curr.left:
            queue.append(curr.left)
        if curr.right:
            queue.append(curr.right)
    return result

# Construct Sample Tree from Figure 6.1
root = TreeNode(4)
root.left = TreeNode(2, TreeNode(1), TreeNode(3))
root.right = TreeNode(6, TreeNode(5), TreeNode(7))

print("Inorder Traversal:    ", inorder(root))
print("Preorder Traversal:   ", preorder(root))
print("Postorder Traversal:  ", postorder(root))
print("Level-Order (BFS):    ", level_order(root))`,
          expectedOutput: `Inorder Traversal:     [1, 2, 3, 4, 5, 6, 7]
Preorder Traversal:    [4, 2, 1, 3, 6, 5, 7]
Postorder Traversal:   [1, 3, 2, 5, 7, 6, 4]
Level-Order (BFS):     [4, 2, 6, 1, 3, 5, 7]`,
          explanation: 'Demonstrates all four fundamental tree traversals with identical output to theoretical derivations.',
        },
      ],
    },

    // Section 7
    {
      id: 'sec-bst',
      title: '7. Binary Search Trees (BST) — Operations & Deletion Cases',
      category: 'algorithms',
      blocks: [
        {
          id: 'b-bst-def',
          type: 'callout',
          variant: 'note',
          title: 'Binary Search Tree (BST) Invariant Property',
          content: 'For every node $X$ in a Binary Search Tree:\n- All values in the **left subtree** of $X$ are strictly less than $X.val$ ($key < X.val$).\n- All values in the **right subtree** of $X$ are strictly greater than $X.val$ ($key > X.val$).\n- Both the left and right subtrees must themselves be valid binary search trees.',
        },
        {
          id: 'b-bst-diag',
          type: 'diagram',
          diagramType: 'mermaid',
          source: `flowchart TD
    Start([Delete Node Z]) --> Check{How many children does Z have?}
    Check -- 0 Children --> Case1[Case 1: Leaf Node<br/>Simply set parent's pointer to NULL and free Z]
    Check -- 1 Child --> Case2[Case 2: One Child<br/>Bypass Z: Link parent directly to Z's child and free Z]
    Check -- 2 Children --> Case3[Case 3: Two Children<br/>1. Find Inorder Successor S (min in right subtree)<br/>2. Copy S.val to Z.val<br/>3. Recursively delete S from right subtree]
    Case1 --> End([Done: BST Property Maintained])
    Case2 --> End
    Case3 --> End

    style Start fill:#e0e7ff,stroke:#4f46e5
    style Case1 fill:#dcfce7,stroke:#16a34a
    style Case2 fill:#fef3c7,stroke:#d97706
    style Case3 fill:#fee2e2,stroke:#dc2626
    style End fill:#f1f5f9,stroke:#64748b`,
          caption: 'Figure 7.1: Decision Flowchart for the 3 BST Deletion Cases',
          description: 'A structured decision tree outlining the algorithm for deleting a node from a BST.',
        },
        {
          id: 'b-bst-code',
          type: 'code',
          language: 'python',
          caption: 'Python: BST Search, Insertion, and 3-Case Deletion',
          code: `class BSTNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, key):
        self.root = self._insert(self.root, key)

    def _insert(self, node, key):
        if node is None:
            return BSTNode(key)
        if key < node.key:
            node.left = self._insert(node.left, key)
        elif key > node.key:
            node.right = self._insert(node.right, key)
        return node

    def search(self, key):
        curr = self.root
        while curr:
            if key == curr.key:
                return True
            curr = curr.left if key < curr.key else curr.right
        return False

    def delete(self, key):
        self.root = self._delete(self.root, key)

    def _delete(self, node, key):
        if node is None:
            return None
        if key < node.key:
            node.left = self._delete(node.left, key)
        elif key > node.key:
            node.right = self._delete(node.right, key)
        else:
            # Case 1: Leaf node (0 children)
            if node.left is None and node.right is None:
                return None
            # Case 2: One child
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left
            # Case 3: Two children
            # Find Inorder Successor (smallest in right subtree)
            successor = self._min_node(node.right)
            node.key = successor.key
            node.right = self._delete(node.right, successor.key)
        return node

    def _min_node(self, node):
        while node.left:
            node = node.left
        return node

    def to_sorted_list(self):
        res = []
        def dfs(n):
            if n:
                dfs(n.left)
                res.append(n.key)
                dfs(n.right)
        dfs(self.root)
        return res

# Demonstration
tree = BinarySearchTree()
for val in [50, 30, 70, 20, 40, 60, 80]:
    tree.insert(val)

print("Initial BST Inorder:       ", tree.to_sorted_list())
print("Search 40:                 ", tree.search(40))
print("Search 99:                 ", tree.search(99))

# Test Case 1: Delete Leaf Node (20)
tree.delete(20)
print("After deleting leaf 20:    ", tree.to_sorted_list())

# Test Case 2: Delete Node with 1 child (30 now has only child 40)
tree.delete(30)
print("After deleting 30 (1 child):", tree.to_sorted_list())

# Test Case 3: Delete Node with 2 children (Root 50)
tree.delete(50)
print("After deleting root 50:    ", tree.to_sorted_list())`,
          expectedOutput: `Initial BST Inorder:        [20, 30, 40, 50, 60, 70, 80]
Search 40:                  True
Search 99:                  False
After deleting leaf 20:     [30, 40, 50, 60, 70, 80]
After deleting 30 (1 child): [40, 50, 60, 70, 80]
After deleting root 50:     [40, 60, 70, 80]`,
          explanation: 'Demonstrates BST operations with edge cases covering leaf deletion, single-child deletion, and two-child deletion.',
        },
      ],
    },

    // Section 8
    {
      id: 'sec-avl',
      title: '8. Self-Balancing AVL Trees & The 4 Rotations',
      category: 'explanations',
      blocks: [
        {
          id: 'b-avl-p1',
          type: 'paragraph',
          content: 'Invented by Adelson-Velsky and Landis (1962), an **AVL Tree** is a height-balanced binary search tree. For every node, the heights of its left and right subtrees differ by at most 1.',
        },
        {
          id: 'b-avl-eq',
          type: 'equation',
          latex: 'BF(v) = \\text{height}(\\text{left\\_subtree}(v)) - \\text{height}(\\text{right\\_subtree}(v)) \\quad \\text{where } BF(v) \\in \\{-1, 0, +1\\}',
          isBlock: true,
          caption: 'AVL Balance Factor Condition',
        },
        {
          id: 'b-avl-diag',
          type: 'diagram',
          diagramType: 'mermaid',
          source: `graph TD
    subgraph LL_Rotation["1. LL Rotation (Right Rotation)"]
        LL_Z((Z: +2)) --> LL_Y((Y: +1))
        LL_Y --> LL_X((X))
        LL_Arrow[Apply Right Rotate on Z] --> LL_Res((Y: 0))
        LL_Res --> LL_ResX((X))
        LL_Res --> LL_ResZ((Z: 0))
    end

    subgraph RR_Rotation["2. RR Rotation (Left Rotation)"]
        RR_Z((Z: -2)) --> RR_Y((Y: -1))
        RR_Y --> RR_X((X))
        RR_Arrow[Apply Left Rotate on Z] --> RR_Res((Y: 0))
        RR_Res --> RR_ResZ((Z: 0))
        RR_Res --> RR_ResX((X))
    end

    subgraph LR_Rotation["3. LR Rotation (Left then Right)"]
        LR_Z((Z: +2)) --> LR_Y((Y: -1))
        LR_Y --> LR_X((X))
        LR_Arrow[1. Left Rotate Y<br/>2. Right Rotate Z] --> LR_Res((X: 0))
        LR_Res --> LR_ResY((Y))
        LR_Res --> LR_ResZ((Z))
    end

    subgraph RL_Rotation["4. RL Rotation (Right then Left)"]
        RL_Z((Z: -2)) --> RL_Y((Y: +1))
        RL_Y --> RL_X((X))
        RL_Arrow[1. Right Rotate Y<br/>2. Left Rotate Z] --> RL_Res((X: 0))
        RL_Res --> RL_ResZ((Z))
        RL_Res --> RL_ResY((Y))
    end

    style LL_Rotation fill:#f8fafc,stroke:#93c5fd
    style RR_Rotation fill:#f8fafc,stroke:#93c5fd
    style LR_Rotation fill:#f8fafc,stroke:#c4b5fd
    style RL_Rotation fill:#f8fafc,stroke:#c4b5fd`,
          caption: 'Figure 8.1: The Four AVL Balancing Rotations (LL, RR, LR, RL)',
          description: 'Step-by-step transformation diagrams restoring balance factor to {-1, 0, 1}.',
        },
        {
          id: 'b-avl-table',
          type: 'table',
          caption: 'Table 8.1: AVL Imbalance Scenarios and Corrective Actions',
          headers: ['Imbalance Pattern', 'Location of New Insertion', 'Balance Factor Signature', 'Corrective Rotation', 'Time Complexity'],
          rows: [
            ['LL (Left-of-Left)', 'Left child of the left subtree of Z', '$BF(Z) = +2$, $BF(\\text{left}) = +1$', 'Single Right Rotation on $Z$', '$O(1)$'],
            ['RR (Right-of-Right)', 'Right child of the right subtree of Z', '$BF(Z) = -2$, $BF(\\text{right}) = -1$', 'Single Left Rotation on $Z$', '$O(1)$'],
            ['LR (Right-of-Left)', 'Right child of the left subtree of Z', '$BF(Z) = +2$, $BF(\\text{left}) = -1$', 'Double: Left Rotate on left child, then Right Rotate on $Z$', '$O(1)$'],
            ['RL (Left-of-Right)', 'Left child of the right subtree of Z', '$BF(Z) = -2$, $BF(\\text{right}) = +1$', 'Double: Right Rotate on right child, then Left Rotate on $Z$', '$O(1)$'],
          ],
        },
      ],
    },

    // Section 9
    {
      id: 'sec-advanced',
      title: '9. Advanced Trees: Heaps, B-Trees & Tries',
      category: 'explanations',
      blocks: [
        {
          id: 'b-adv-p1',
          type: 'paragraph',
          content: 'Beyond simple binary trees, real-world high-performance computing requires specialized tree data structures tailored for priority queues, database indexing, and lexical pattern searching:',
        },
        {
          id: 'b-heap-callout',
          type: 'callout',
          variant: 'tip',
          title: '1. Binary Heaps (Min-Heap / Max-Heap)',
          content: '**Properties**: A complete binary tree where every parent node satisfies the heap property: in a Min-Heap, $A[\\text{parent}(i)] \\le A[i]$; in a Max-Heap, $A[\\text{parent}(i)] \\ge A[i]$.\n- **Representation**: Stored as a contiguous 1D array without pointers ($2i+1$ left child, $2i+2$ right child).\n- **Heapify**: Restores heap order in $O(\\log n)$.\n- **Build-Heap**: Linear time $O(n)$ build algorithm using bottom-up sift-down.\n- **Primary Application**: Priority queues, Dijkstra\'s algorithm, Heap Sort.',
        },
        {
          id: 'b-btree-callout',
          type: 'callout',
          variant: 'important',
          title: '2. B-Trees & B+ Trees (Disk & Database Storage)',
          content: '**Properties**: Self-balancing multi-way search trees of order $m$ designed specifically for secondary storage (HDDs/SSDs) where block I/O is the bottleneck.\n- Every node has at most $m$ children and at least $\\lceil m/2 \\rceil$ children (except root).\n- A node with $k$ children contains $k - 1$ sorted keys.\n- All leaf nodes exist at the exact same depth.\n- Minimizes disk read latency by packing hundreds of keys per block node.\n- **Primary Application**: PostgreSQL, MySQL InnoDB indexing, Linux ext4/NTFS file systems.',
        },
        {
          id: 'b-trie-callout',
          type: 'callout',
          variant: 'note',
          title: '3. Tries (Prefix Trees)',
          content: '**Properties**: An ordered search tree used to store associative arrays where keys are strings.\n- All descendants of a node share a common string prefix associated with that node.\n- The root is associated with the empty string `""`.\n- Search and insertion time is $O(L)$ where $L$ is key length, completely independent of total number of stored keys $N$!\n- **Primary Application**: Search engine autocomplete, spell checkers, IP routing table lookups.',
        },
      ],
    },

    // Section 10
    {
      id: 'sec-complexity',
      title: '10. Comprehensive Complexity Analysis Table',
      category: 'comparisons',
      blocks: [
        {
          id: 'b-comp-table',
          type: 'table',
          caption: 'Table 10.1: Rigorous Operational Complexity Comparison Across All Tree Structures',
          headers: ['Data Structure', 'Search (Avg)', 'Search (Worst)', 'Insert (Avg)', 'Insert (Worst)', 'Delete (Worst)', 'Space Complexity', 'Key Weakness / Limitation'],
          rows: [
            ['Standard BST', '$O(\\log n)$', '$O(n)$', '$O(\\log n)$', '$O(n)$', '$O(n)$', '$O(n)$', 'Degenerates into a linked list on sorted input.'],
            ['AVL Tree', '$O(\\log n)$', '$O(\\log n)$', '$O(\\log n)$', '$O(\\log n)$', '$O(\\log n)$', '$O(n)$', 'Frequent rotations on insertion and deletion.'],
            ['Red-Black Tree', '$O(\\log n)$', '$O(\\log n)$', '$O(\\log n)$', '$O(\\log n)$', '$O(\\log n)$', '$O(n)$', 'Slightly slower search than AVL due to relaxed balance ($2\\log n$).'],
            ['Binary Heap', '$O(n)$', '$O(n)$', '$O(1)$ amortized', '$O(\\log n)$', '$O(\\log n)$', '$O(n)$', 'Arbitrary search is slow ($O(n)$ linear scan); only min/max is $O(1)$.'],
            ['B-Tree (Order m)', '$O(\\log_m n)$', '$O(\\log_m n)$', '$O(\\log_m n)$', '$O(\\log_m n)$', '$O(\\log_m n)$', '$O(n)$', 'Complex node split and merge implementation.'],
            ['Trie (Key Len L)', '$O(L)$', '$O(L)$', '$O(L)$', '$O(L)$', '$O(L)$', '$O(\\Sigma \\cdot L \\cdot N)$', 'High memory consumption due to sparse alphabet pointers.'],
          ],
        },
      ],
    },

    // Section 11
    {
      id: 'sec-programs',
      title: '11. Complete Verified Implementations (Python & C)',
      category: 'code',
      blocks: [
        {
          id: 'b-prog-c',
          type: 'code',
          language: 'c',
          caption: 'Complete C Implementation: Binary Search Tree with Dynamic Memory',
          code: `#include <stdio.h>
#include <stdlib.h>

// Definition of BST Node
struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

// Create a new node dynamically
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    if (!newNode) {
        printf("Memory allocation failed!\\n");
        exit(1);
    }
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

// Insert a node into BST
struct Node* insert(struct Node* root, int value) {
    if (root == NULL) return createNode(value);
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else if (value > root->data) {
        root->right = insert(root->right, value);
    }
    return root;
}

// Inorder Traversal (Always prints sorted keys)
void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

// Find minimum value node (for deletion successor)
struct Node* findMin(struct Node* root) {
    while (root && root->left != NULL) {
        root = root->left;
    }
    return root;
}

// Delete a node from BST
struct Node* deleteNode(struct Node* root, int value) {
    if (root == NULL) return NULL;

    if (value < root->data) {
        root->left = deleteNode(root->left, value);
    } else if (value > root->data) {
        root->right = deleteNode(root->right, value);
    } else {
        // Case 1 & 2: 0 or 1 child
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }
        // Case 3: 2 children -> replace with inorder successor
        struct Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}

int main() {
    struct Node* root = NULL;
    int values[] = {50, 30, 70, 20, 40, 60, 80};
    int n = sizeof(values) / sizeof(values[0]);

    for (int i = 0; i < n; i++) {
        root = insert(root, values[i]);
    }

    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");

    printf("Deleting node 20 (Leaf)...\\n");
    root = deleteNode(root, 20);
    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");

    printf("Deleting node 50 (Root with 2 children)...\\n");
    root = deleteNode(root, 50);
    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");

    return 0;
}`,
          expectedOutput: `Inorder Traversal: 20 30 40 50 60 70 80 
Deleting node 20 (Leaf)...
Inorder Traversal: 30 40 50 60 70 80 
Deleting node 50 (Root with 2 children)...
Inorder Traversal: 30 40 60 70 80 `,
          explanation: 'Standard ANSI C implementation demonstrating dynamic allocation, pointers, and clean deallocation with free().',
        },
      ],
    },

    // Section 12
    {
      id: 'sec-exam-qa',
      title: '12. University Exam Short & Long Questions',
      category: 'exam',
      blocks: [
        {
          id: 'b-exam-q1',
          type: 'examQuestion',
          questionType: 'short',
          marks: 2,
          question: 'Q1 (2 Marks): Why does the Inorder traversal of a Binary Search Tree always produce elements in strictly sorted ascending order?',
          answer: 'By definition of a BST, for any node $X$, all values in its left subtree are strictly less than $X$ ($L < X$), and all values in its right subtree are strictly greater than $X$ ($X < R$). Since Inorder traversal follows the sequence (Left Subtree $\\to$ Root $\\to$ Right Subtree), it recursively processes elements in the strict ordering $L < X < R$. Therefore, visiting nodes in Inorder traversal mathematically guarantees monotonic non-decreasing order.',
        },
        {
          id: 'b-exam-q2',
          type: 'examQuestion',
          questionType: 'short',
          marks: 2,
          question: 'Q2 (2 Marks): Define Balance Factor of a node in an AVL tree. What are its permissible values?',
          answer: 'The Balance Factor (BF) of a node $v$ in an AVL tree is defined as the height of its left subtree minus the height of its right subtree:\n$$BF(v) = \\text{height}(\\text{left\\_subtree}(v)) - \\text{height}(\\text{right\\_subtree}(v))$$\nIn a valid AVL tree, for every node in the tree, $BF(v) \\in \\{-1, 0, +1\\}$. If $|BF(v)| \\ge 2$ after an insertion or deletion, the tree is unbalanced and requires rotation.',
        },
        {
          id: 'b-exam-q3',
          type: 'examQuestion',
          questionType: 'long',
          marks: 10,
          question: 'Q3 (10 Marks): Explain in detail the three cases of node deletion in a Binary Search Tree (BST). Illustrate Case 3 with an example where the deleted node has two children.',
          answer: `**Comprehensive Deletion Solution**:

1. **Case 1: Deleting a Leaf Node (Degree 0)**
   - The node to be deleted has no left or right child.
   - Action: Simply locate the parent of the node, set the corresponding pointer (left or right) to \`NULL\`, and release the memory using \`free()\`.
   - Time Complexity: $O(h)$ where $h$ is tree height.

2. **Case 2: Deleting a Node with Exactly One Child (Degree 1)**
   - The node has either only a left child or only a right child.
   - Action: Bypass the target node. Link the parent of the deleted node directly to the single child of the target node, then free the target node.
   - Time Complexity: $O(h)$.

3. **Case 3: Deleting a Node with Two Children (Degree 2)**
   - The node $Z$ has both non-empty left and right subtrees. Directly removing $Z$ would sever two subtrees.
   - Algorithm:
     a. Find the **Inorder Successor** $S$ of node $Z$. (The Inorder Successor is the node with the minimum key in $Z$'s right subtree).
     b. Alternatively, one could use the Inorder Predecessor (maximum in left subtree).
     c. Copy the data value of $S$ into $Z$ ($Z.val = S.val$).
     d. Now, delete $S$ from $Z$'s right subtree. Because $S$ is the minimum in the right subtree, $S$ cannot have a left child (it has at most 1 right child). This transforms the deletion into Case 1 or Case 2!
   - **Example**: In a BST with root $50$, left child $30$, right child $70$, deleting $50$ finds successor $60$ (min in right subtree). Node $50$ is overwritten with value $60$, and original node $60$ is freed.`,
        },
      ],
    },

    // Section 13
    {
      id: 'sec-mcqs',
      title: '13. Practice MCQs & Viva Voce Q&A',
      category: 'exam',
      blocks: [
        {
          id: 'b-mcq-1',
          type: 'examQuestion',
          questionType: 'mcq',
          marks: 1,
          question: 'What is the maximum number of nodes in a binary tree of height h (where root is at height 0)?',
          options: ['2^h - 1', '2^(h+1) - 1', '2^(h-1) + 1', '2^h'],
          correctOptionIndex: 1,
          explanation: 'Summing geometric progression from level 0 to h: Sum = 2^0 + 2^1 + ... + 2^h = 2^(h+1) - 1. For example, for h = 2, max nodes = 2^(2+1) - 1 = 7.',
          answer: 'Option B: 2^(h+1) - 1',
        },
        {
          id: 'b-mcq-2',
          type: 'examQuestion',
          questionType: 'mcq',
          marks: 1,
          question: 'If a binary tree has 20 nodes with degree 2, how many leaf nodes (degree 0) does it contain?',
          options: ['19', '20', '21', '40'],
          correctOptionIndex: 2,
          explanation: 'According to Theorem 4, in any binary tree, the number of leaf nodes n0 is strictly equal to nodes of degree two plus one: n0 = n2 + 1 = 20 + 1 = 21.',
          answer: 'Option C: 21',
        },
        {
          id: 'b-viva-1',
          type: 'examQuestion',
          questionType: 'viva',
          question: 'Viva Question: Why are B-Trees preferred over Binary Search Trees or AVL Trees for database indexing and file system storage?',
          answer: 'In disk storage (HDDs/SSDs), disk head movement and block I/O are thousands of times slower than main memory access. A binary tree has a large height ($O(\\log_2 n)$), requiring dozens of distinct disk accesses per search. A B-tree of order $m$ (e.g., $m=1024$) has a huge branching factor, reducing tree height to 3 or 4 for millions of records, so a record can be retrieved in only 3-4 disk block reads.',
        },
      ],
    },

    // Section 14
    {
      id: 'sec-revision',
      title: '14. Quick Revision Summary & Formula Cheatsheet',
      category: 'revision',
      blocks: [
        {
          id: 'b-rev-callout',
          type: 'callout',
          variant: 'formula',
          title: 'High-Yield Formula Cheatsheet for Exam Hall',
          content: '1. **Total Edges**: $e = n - 1$\n2. **Leaf Node Theorem**: $n_0 = n_2 + 1$\n3. **Max Nodes at Level $i$**: $2^i$\n4. **Max Nodes at Height $h$**: $2^{h+1} - 1$\n5. **Min Height for $n$ nodes**: $\\lceil \\log_2(n+1) \\rceil - 1$\n6. **Max Height for $n$ nodes (Degenerate)**: $n - 1$\n7. **AVL Balance Factor**: $BF \\in \\{-1, 0, +1\\}$\n8. **Complete Binary Tree Array Pointers (0-indexed)**:\n   - Left child = $2i + 1$\n   - Right child = $2i + 2$\n   - Parent = $\\lfloor (i - 1)/2 \\rfloor$\n9. **BST Inorder Traversal Property**: Inorder(BST) $\\equiv$ Sorted Ascending Order',
        },
        {
          id: 'b-rev-takeaways',
          type: 'list',
          ordered: false,
          items: [
            'Trees are non-linear hierarchical data structures; binary trees restrict nodes to at most 2 children.',
            'Full binary trees have 0 or 2 children; Complete binary trees are filled from left to right; Perfect binary trees are completely filled on all levels.',
            'BST search, insert, and delete take $O(h)$ time, which can degrade to $O(n)$ in degenerate trees.',
            'AVL trees maintain $O(\\log n)$ worst-case height by applying 4 rotations (LL, RR, LR, RL) when $|BF| \\ge 2$.',
            'Binary Heaps provide $O(1)$ peek and $O(\\log n)$ extract-min/max using array representation.',
            'B-Trees optimize secondary block I/O through high branching factors for databases and filesystems.',
          ],
        },
      ],
    },
  ],
};
