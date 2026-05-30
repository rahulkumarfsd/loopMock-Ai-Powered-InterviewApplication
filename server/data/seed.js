require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question.model');

// ─────────────────────────────────────────────────────────────
// IMPORTANT: Starter code MUST read from stdin and print to stdout
// Judge0 sends test case input via stdin for each test run
// The solution function stays the same — only main() changes
// ─────────────────────────────────────────────────────────────

const questions = [

  // ════════════════════════════════════════
  // TWO SUM
  // ════════════════════════════════════════
  {
    title: 'Two Sum',
    body: 'Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers that add up to target.\n\nAssume exactly one solution exists. You may not use the same element twice.\n\n**Example 1:**\n```\nInput:  nums = [2,7,11,15], target = 9\nOutput: [0,1]\n```\n**Example 2:**\n```\nInput:  nums = [3,2,4], target = 6\nOutput: [1,2]\n```',
    type: 'dsa', difficulty: 'easy', topic: 'arrays',
    company: ['google', 'amazon', 'facebook', 'microsoft'],
    coding: {
      starterCode: {

        javascript: `function twoSum(nums, target) {
  // Write your solution here

}

// ── I/O runner (do not modify) ──────────────
const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums   = JSON.parse(lines[0]);
const target = parseInt(lines[1]);
const result = twoSum(nums, target);
console.log(JSON.stringify(result));`,

        python: `import json, sys

def two_sum(nums, target):
    # Write your solution here
    pass

# ── I/O runner (do not modify) ──────────────
lines  = sys.stdin.read().strip().split('\\n')
nums   = json.loads(lines[0])
target = int(lines[1])
print(json.dumps(two_sum(nums, target)))`,

        java: `import java.util.*;

public class Main {

    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }

    // ── I/O runner (do not modify) ──────────
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().replaceAll("[\\\\[\\\\] ]", "");
        int target = Integer.parseInt(sc.nextLine().trim());
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int[] res = twoSum(nums, target);
        System.out.println("[" + res[0] + "," + res[1] + "]");
    }
}`,

        cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
#include <algorithm>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here

    return {};
}

// ── I/O runner (do not modify) ──────────────
int main() {
    string line;
    getline(cin, line);
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());
    line.erase(remove(line.begin(), line.end(), ' '), line.end());
    vector<int> nums;
    stringstream ss(line);
    string tok;
    while (getline(ss, tok, ',')) nums.push_back(stoi(tok));
    int target; cin >> target;
    auto res = twoSum(nums, target);
    cout << "[" << res[0] << "," << res[1] << "]" << endl;
}`,

      },
      testCases: [
        { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
        { input: '[3,2,4]\n6',     expectedOutput: '[1,2]', isHidden: false },
        { input: '[3,3]\n6',       expectedOutput: '[0,1]', isHidden: true  },
        { input: '[1,2,3,4]\n7',   expectedOutput: '[2,3]', isHidden: true  },
      ],
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9' },
        { input: 'nums = [3,2,4], target = 6',     output: '[1,2]', explanation: 'nums[1] + nums[2] = 6' },
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer'],
      timeLimit: 5000,
    },
    hints: ['Use a hash map — store each number and its index', 'For each number, check if (target - number) is already in the map'],
    evaluationCriteria: ['Correct indices', 'O(n) hash map', 'Handles [3,3] duplicate'],
    tags: ['array', 'hash-map'],
  },

  // ════════════════════════════════════════
  // BEST TIME TO BUY AND SELL STOCK
  // ════════════════════════════════════════
  {
    title: 'Best Time to Buy and Sell Stock',
    body: 'Given `prices[i]` = stock price on day i, return the **maximum profit** by buying on one day and selling on a later day. Return `0` if no profit is possible.\n\n**Example 1:**\n```\nInput:  [7,1,5,3,6,4]\nOutput: 5  (buy at 1, sell at 6)\n```\n**Example 2:**\n```\nInput:  [7,6,4,3,1]\nOutput: 0  (prices only fall)\n```',
    type: 'dsa', difficulty: 'easy', topic: 'arrays',
    company: ['amazon', 'facebook', 'bloomberg', 'microsoft'],
    coding: {
      starterCode: {
        javascript: `function maxProfit(prices) {
  // Write your solution here

}

// ── I/O runner ──
const prices = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
console.log(maxProfit(prices));`,

        python: `import json, sys

def max_profit(prices):
    # Write your solution here
    pass

prices = json.loads(sys.stdin.read().strip())
print(max_profit(prices))`,

        java: `import java.util.*;

public class Main {
    public static int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().replaceAll("[\\\\[\\\\] ]", "");
        int[] prices = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();
        System.out.println(maxProfit(prices));
    }
}`,

        cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your solution here
    return 0;
}

// ── I/O runner ──
int main() {
    string line; getline(cin, line);
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());
    line.erase(remove(line.begin(), line.end(), ' '), line.end());
    vector<int> prices;
    stringstream ss(line); string tok;
    while (getline(ss, tok, ',')) prices.push_back(stoi(tok));
    cout << maxProfit(prices) << endl;
}`,
      },
      testCases: [
        { input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false },
        { input: '[7,6,4,3,1]',   expectedOutput: '0', isHidden: false },
        { input: '[1,2]',         expectedOutput: '1', isHidden: false },
        { input: '[2,4,1]',       expectedOutput: '2', isHidden: true  },
      ],
      constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
      timeLimit: 5000,
    },
    hints: ['Track minimum price seen so far', 'At each day: profit = price - minSoFar'],
    evaluationCriteria: ['O(n) single pass', 'Returns 0 for all-decreasing', 'Single element'],
    tags: ['array', 'greedy'],
  },

  // ════════════════════════════════════════
  // VALID PARENTHESES
  // ════════════════════════════════════════
  {
    title: 'Valid Parentheses',
    body: 'Given string `s` of `(`, `)`, `{`, `}`, `[`, `]` — return `true` if it is valid. Open brackets must be closed by same type in correct order.\n\n**Examples:**\n```\n"()"      true\n"()[]{}"  true\n"(]"      false\n"([)]"    false\n"{[]}"    true\n```',
    type: 'dsa', difficulty: 'easy', topic: 'stacks',
    company: ['amazon', 'google', 'facebook', 'microsoft', 'infosys'],
    coding: {
      starterCode: {
        javascript: `function isValid(s) {
  // Write your solution here

}

// ── I/O runner ──
const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
console.log(String(isValid(s)));`,

        python: `import sys

def is_valid(s):
    # Write your solution here
    pass

s = sys.stdin.read().strip()
print(str(is_valid(s)).lower())`,

        java: `import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        // Write your solution here
        return false;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(isValid(sc.nextLine().trim()));
    }
}`,

        cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    // Write your solution here
    return false;
}

// ── I/O runner ──
int main() {
    string s; getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << endl;
}`,
      },
      testCases: [
        { input: '()',      expectedOutput: 'true',  isHidden: false },
        { input: '()[]{}'  ,expectedOutput: 'true',  isHidden: false },
        { input: '(]',      expectedOutput: 'false', isHidden: false },
        { input: '([)]',    expectedOutput: 'false', isHidden: true  },
        { input: '{[]}',    expectedOutput: 'true',  isHidden: true  },
      ],
      constraints: ['0 ≤ s.length ≤ 10⁴'],
      timeLimit: 5000,
    },
    hints: ['Push open brackets to stack', 'On close bracket, pop and check match'],
    evaluationCriteria: ['Stack', 'All bracket types', 'Empty string  true'],
    tags: ['stack', 'string'],
  },

  // ════════════════════════════════════════
  // MAXIMUM SUBARRAY
  // ════════════════════════════════════════
  {
    title: 'Maximum Subarray',
    body: 'Find the contiguous subarray with the **largest sum**.\n\n**Example 1:**\n```\nInput:  [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6  ([4,-1,2,1])\n```\n**Example 2:**\n```\nInput:  [-1,-2,-3]\nOutput: -1\n```',
    type: 'dsa', difficulty: 'medium', topic: 'arrays',
    company: ['amazon', 'microsoft', 'linkedin', 'apple'],
    coding: {
      starterCode: {
        javascript: `function maxSubArray(nums) {
  // Write your solution here

}

// ── I/O runner ──
const nums = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
console.log(maxSubArray(nums));`,

        python: `import json, sys

def max_sub_array(nums):
    # Write your solution here
    pass

nums = json.loads(sys.stdin.read().strip())
print(max_sub_array(nums))`,

        java: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().replaceAll("[\\\\[\\\\] ]", "");
        int[] nums = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();
        System.out.println(maxSubArray(nums));
    }
}`,

        cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

// ── I/O runner ──
int main() {
    string line; getline(cin, line);
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());
    line.erase(remove(line.begin(), line.end(), ' '), line.end());
    vector<int> nums;
    stringstream ss(line); string tok;
    while (getline(ss, tok, ',')) nums.push_back(stoi(tok));
    cout << maxSubArray(nums) << endl;
}`,
      },
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6',  isHidden: false },
        { input: '[1]',                       expectedOutput: '1',  isHidden: false },
        { input: '[5,4,-1,7,8]',              expectedOutput: '23', isHidden: false },
        { input: '[-1,-2,-3]',                expectedOutput: '-1', isHidden: true  },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵'],
      timeLimit: 5000,
    },
    hints: ['Kadane\'s: maxHere = max(num, maxHere + num)', 'Track overall max separately'],
    evaluationCriteria: ['Kadane\'s O(n)', 'All-negative', 'Single element'],
    tags: ['array', 'dynamic-programming', 'kadanes'],
  },

  // ════════════════════════════════════════
  // CLIMBING STAIRS
  // ════════════════════════════════════════
  {
    title: 'Climbing Stairs',
    body: 'You can climb **1 or 2 steps** at a time. How many distinct ways to reach the top of n stairs?\n\n**Example 1:** n=2  2 ([1+1], [2])\n**Example 2:** n=3  3 ([1+1+1], [1+2], [2+1])',
    type: 'dsa', difficulty: 'easy', topic: 'dynamic-programming',
    company: ['amazon', 'google', 'adobe', 'tcs'],
    coding: {
      starterCode: {
        javascript: `function climbStairs(n) {
  // Write your solution here

}

// ── I/O runner ──
const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
console.log(climbStairs(n));`,

        python: `import sys

def climb_stairs(n):
    # Write your solution here
    pass

n = int(sys.stdin.read().strip())
print(climb_stairs(n))`,

        java: `import java.util.*;

public class Main {
    public static int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        System.out.println(climbStairs(new Scanner(System.in).nextInt()));
    }
}`,

        cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // Write your solution here
    return 0;
}

// ── I/O runner ──
int main() {
    int n; cin >> n;
    cout << climbStairs(n) << endl;
}`,
      },
      testCases: [
        { input: '2',  expectedOutput: '2',  isHidden: false },
        { input: '3',  expectedOutput: '3',  isHidden: false },
        { input: '4',  expectedOutput: '5',  isHidden: false },
        { input: '5',  expectedOutput: '8',  isHidden: true  },
        { input: '10', expectedOutput: '89', isHidden: true  },
      ],
      constraints: ['1 ≤ n ≤ 45'],
      timeLimit: 5000,
    },
    hints: ['Fibonacci! dp[i] = dp[i-1] + dp[i-2]', 'Base: dp[1]=1, dp[2]=2'],
    evaluationCriteria: ['Fibonacci pattern', 'O(1) space solution', 'Base cases'],
    tags: ['dynamic-programming', 'fibonacci'],
  },

  // ════════════════════════════════════════
  // LONGEST SUBSTRING WITHOUT REPEATING
  // ════════════════════════════════════════
  {
    title: 'Longest Substring Without Repeating Characters',
    body: 'Find the length of the **longest substring without repeating characters**.\n\n**Examples:**\n```\n"abcabcbb"  3  ("abc")\n"bbbbb"     1  ("b")\n"pwwkew"    3  ("wke")\n```',
    type: 'dsa', difficulty: 'medium', topic: 'strings',
    company: ['amazon', 'bloomberg', 'facebook', 'tcs', 'infosys'],
    coding: {
      starterCode: {
        javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here

}

// ── I/O runner ──
const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
console.log(lengthOfLongestSubstring(s));`,

        python: `import sys

def length_of_longest_substring(s):
    # Write your solution here
    pass

s = sys.stdin.read().strip()
print(length_of_longest_substring(s))`,

        java: `import java.util.*;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(lengthOfLongestSubstring(s));
    }
}`,

        cpp: `#include <iostream>
#include <unordered_set>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Write your solution here
    return 0;
}

// ── I/O runner ──
int main() {
    string s; getline(cin, s);
    cout << lengthOfLongestSubstring(s) << endl;
}`,
      },
      testCases: [
        { input: 'abcabcbb', expectedOutput: '3', isHidden: false },
        { input: 'bbbbb',    expectedOutput: '1', isHidden: false },
        { input: 'pwwkew',   expectedOutput: '3', isHidden: false },
        { input: '',          expectedOutput: '0', isHidden: true  },
      ],
      constraints: ['0 ≤ s.length ≤ 5×10⁴'],
      timeLimit: 5000,
    },
    hints: ['Sliding window with a Set', 'Move left pointer when duplicate found'],
    evaluationCriteria: ['Sliding window O(n)', 'Empty string  0', 'All same  1'],
    tags: ['string', 'sliding-window', 'hash-map'],
  },

  // ════════════════════════════════════════
  // COIN CHANGE
  // ════════════════════════════════════════
  {
    title: 'Coin Change',
    body: 'Return the **minimum coins** to make up `amount`. Return `-1` if impossible.\n\n**Example 1:** coins=[1,5,11], amount=15  3 (5+5+5)\n**Example 2:** coins=[2], amount=3  -1',
    type: 'dsa', difficulty: 'medium', topic: 'dynamic-programming',
    company: ['amazon', 'google', 'microsoft', 'uber'],
    coding: {
      starterCode: {
        javascript: `function coinChange(coins, amount) {
  // Write your solution here

}

// ── I/O runner ──
const lines  = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const coins  = JSON.parse(lines[0]);
const amount = parseInt(lines[1]);
console.log(coinChange(coins, amount));`,

        python: `import json, sys

def coin_change(coins, amount):
    # Write your solution here
    pass

lines  = sys.stdin.read().strip().split('\\n')
coins  = json.loads(lines[0])
amount = int(lines[1])
print(coin_change(coins, amount))`,

        java: `import java.util.*;

public class Main {
    public static int coinChange(int[] coins, int amount) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().replaceAll("[\\\\[\\\\] ]", "");
        int amount = Integer.parseInt(sc.nextLine().trim());
        int[] coins = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();
        System.out.println(coinChange(coins, amount));
    }
}`,

        cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Write your solution here
    return 0;
}

// ── I/O runner ──
int main() {
    string line; getline(cin, line);
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());
    line.erase(remove(line.begin(), line.end(), ' '), line.end());
    vector<int> coins;
    stringstream ss(line); string tok;
    while (getline(ss, tok, ',')) coins.push_back(stoi(tok));
    int amount; cin >> amount;
    cout << coinChange(coins, amount) << endl;
}`,
      },
      testCases: [
        { input: '[1,5,11]\n15', expectedOutput: '3',  isHidden: false },
        { input: '[2]\n3',       expectedOutput: '-1', isHidden: false },
        { input: '[1]\n0',       expectedOutput: '0',  isHidden: false },
        { input: '[1,2,5]\n11',  expectedOutput: '3',  isHidden: true  },
      ],
      constraints: ['1 ≤ coins.length ≤ 12', '0 ≤ amount ≤ 10⁴'],
      timeLimit: 5000,
    },
    hints: ['dp[i] = min coins to make amount i', 'Initialize with Infinity, dp[0]=0'],
    evaluationCriteria: ['Correct DP', '-1 when impossible', 'amount=0  0'],
    tags: ['dynamic-programming', 'bottom-up'],
  },

  // ════════════════════════════════════════
  // NUMBER OF ISLANDS
  // ════════════════════════════════════════
  {
    title: 'Number of Islands',
    body: 'Count islands in a grid of `1` (land) and `0` (water). Islands are groups of adjacent land cells (horizontally/vertically).\n\n**Example:**\n```\n11000\n11000\n00100\n00011\n 3 islands\n```',
    type: 'dsa', difficulty: 'medium', topic: 'graphs',
    company: ['amazon', 'google', 'facebook', 'microsoft', 'uber'],
    coding: {
      starterCode: {
        javascript: `function numIslands(grid) {
  // Write your solution here

}

// ── I/O runner ──
const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const grid  = lines.map(l => l.split(''));
console.log(numIslands(grid));`,

        python: `import sys

def num_islands(grid):
    # Write your solution here
    pass

lines = sys.stdin.read().strip().split('\\n')
grid  = [list(l) for l in lines]
print(num_islands(grid))`,

        java: `import java.util.*;

public class Main {
    public static int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) {
            String l = sc.nextLine();
            if (l.isEmpty()) break;
            lines.add(l);
        }
        char[][] grid = new char[lines.size()][];
        for (int i = 0; i < lines.size(); i++) grid[i] = lines.get(i).toCharArray();
        System.out.println(numIslands(grid));
    }
}`,

        cpp: `#include <iostream>
#include <vector>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Write your solution here
    return 0;
}

// ── I/O runner ──
int main() {
    vector<vector<char>> grid;
    string line;
    while (getline(cin, line) && !line.empty()) {
        grid.push_back(vector<char>(line.begin(), line.end()));
    }
    cout << numIslands(grid) << endl;
}`,
      },
      testCases: [
        { input: '11110\n11010\n11000\n00000', expectedOutput: '1', isHidden: false },
        { input: '11000\n11000\n00100\n00011', expectedOutput: '3', isHidden: false },
        { input: '1',                          expectedOutput: '1', isHidden: true  },
        { input: '0',                          expectedOutput: '0', isHidden: true  },
      ],
      constraints: ['1 ≤ m, n ≤ 300'],
      timeLimit: 5000,
    },
    hints: ['DFS from each unvisited land cell', 'Mark visited cells as 0'],
    evaluationCriteria: ['DFS/BFS', '4-directional', 'In-place marking'],
    tags: ['graph', 'dfs', 'bfs', 'matrix'],
  },

  // ════════════════════════════════════════
  // SYSTEM DESIGN (no code — text answers)
  // ════════════════════════════════════════
  {
    title: 'Design a URL Shortener (bit.ly)',
    body: 'Design a URL shortening service.\n\n**Functional Requirements:**\n- Given a long URL, return a short URL (bit.ly/abc123)\n- Short URL redirects to original with <100ms latency\n- Optional: custom aliases, link expiry, click analytics\n\n**Non-Functional:**\n- 100M URL creations/day, 10B redirects/day (100:1 read/write)\n- High availability 99.99%\n\nDiscuss: API design, ID generation (Base62 vs MD5), database choice, caching layer, and scaling.',
    type: 'system-design', difficulty: 'medium', topic: 'url-shortener',
    company: ['google', 'amazon', 'facebook', 'uber', 'twitter'],
    hints: [
      'Capacity: 100M/day ≈ 1160 writes/sec, 10B/day ≈ 115K reads/sec',
      'Base62 (a-zA-Z0-9) with 7 chars = 62^7 = 3.5 trillion unique IDs',
      'Read-heavy: cache hot URLs in Redis (80% traffic = 20% of URLs)',
      'NoSQL (Cassandra/DynamoDB) for URL key-value storage — horizontally scalable',
    ],
    evaluationCriteria: ['Capacity estimation', 'API: POST /shorten, GET /:code  301', 'Collision handling', 'Redis caching', 'DB sharding', 'Analytics pipeline'],
    tags: ['system-design', 'caching', 'hashing', 'database'],
  },
  {
    title: 'Design Twitter Feed',
    body: 'Design the Twitter home timeline.\n\n**Requirements:** Users post tweets, follow others, see reverse-chronological feed. 500M DAU, P99 < 300ms.\n\n**Key question:** Fan-out on write vs fan-out on read? How do you handle celebrities with 100M+ followers?',
    type: 'system-design', difficulty: 'hard', topic: 'social-media-feed',
    company: ['twitter', 'facebook', 'instagram', 'linkedin'],
    hints: ['Fan-out on write: push tweets to followers\' feeds (fast read, expensive write)', 'Celebrity problem: fan-out for 100M followers is too expensive', 'Hybrid: fan-out on write for regular users, fan-out on read for celebrities', 'Redis sorted set for feed storage'],
    evaluationCriteria: ['Fan-out tradeoff explained', 'Celebrity problem solved', 'Redis sorted set for feed', 'Sharded tweet storage', 'CDN for media'],
    tags: ['system-design', 'fan-out', 'caching', 'distributed'],
  },
  {
    title: 'Design WhatsApp',
    body: 'Design a real-time messaging system.\n\n**Requirements:** 1-on-1 and group chat (1000 members), delivery receipts (✓ ✓✓ ✓✓ blue), media messages, online presence. 2B users, 100B messages/day, <1s delivery.\n\nFocus on: WebSocket vs HTTP polling, message ordering, group fanout.',
    type: 'system-design', difficulty: 'hard', topic: 'chat-system',
    company: ['facebook', 'microsoft', 'amazon', 'google'],
    hints: ['WebSocket for persistent bidirectional connection', 'Message queue per user — drain when receiver comes online', 'Cassandra for messages: write-heavy, time-series', 'Group fanout: store once, fan out references to members'],
    evaluationCriteria: ['WebSocket explained', 'Message schema', '3-state delivery receipts', 'Group fanout', 'Media: S3 presigned URLs', 'Presence heartbeat'],
    tags: ['system-design', 'websockets', 'real-time', 'cassandra'],
  },
  {
    title: 'Design Uber',
    body: 'Design a ride-sharing platform.\n\n**Requirements:** Match rider to nearby driver within 30s, real-time GPS tracking, surge pricing. 20M DAU, 3M active drivers, location updates every 4 seconds.\n\nFocus on the location-based matching problem.',
    type: 'system-design', difficulty: 'hard', topic: 'location-service',
    company: ['uber', 'lyft', 'ola', 'doordash'],
    hints: ['Geohash/quadtree to partition map for fast nearby lookup', 'Redis GEOADD/GEORADIUS for real-time driver locations', 'Matching: score by distance, rating, acceptance rate', 'WebSocket to push driver location to rider'],
    evaluationCriteria: ['Geohash/quadtree explained', 'Redis geospatial', 'Matching algorithm', 'Surge pricing formula', 'Trip state machine', 'ETA calculation'],
    tags: ['system-design', 'geospatial', 'real-time', 'matching'],
  },

  // ════════════════════════════════════════
  // BEHAVIORAL
  // ════════════════════════════════════════
  {
    title: 'Tell Me About a Time You Disagreed With Your Manager',
    body: 'Describe a specific situation where you disagreed with your manager\'s decision. What was the disagreement? How did you handle it? What was the outcome?\n\nThis tests Amazon\'s **"Have Backbone; Disagree and Commit"** — challenging decisions respectfully while committing to the outcome.\n\nUse STAR format. Be specific.',
    type: 'behavioral', difficulty: 'medium', topic: 'conflict-resolution',
    company: ['amazon', 'google', 'microsoft'],
    hints: ['Real, meaningful disagreement — not trivial', 'Data-driven reasoning, not just opinion', 'Show you committed fully even if overruled', 'End with positive outcome or lesson'],
    evaluationCriteria: ['Specific situation', 'Data-driven', 'Professional tone', 'Committed to outcome', 'Shows backbone without insubordination'],
    tags: ['behavioral', 'amazon-lp', 'conflict'],
  },
  {
    title: 'Tell Me About a Time You Failed',
    body: 'Describe a significant professional failure — not something trivial. What happened? Why? How did you respond? What did you learn?\n\n**"I worked too hard"** is NOT a failure. Interviewers want real self-awareness, ownership, and evidence of growth.',
    type: 'behavioral', difficulty: 'medium', topic: 'failure-and-growth',
    company: ['amazon', 'google', 'facebook', 'microsoft', 'netflix'],
    hints: ['Real failure with real consequences', 'Full ownership — no blame-shifting', '70% of answer on what you learned', 'Show concrete behavioral change'],
    evaluationCriteria: ['Genuine failure', 'Full ownership', 'Root cause analysis', 'Actions taken', 'Lasting change'],
    tags: ['behavioral', 'failure', 'growth-mindset'],
  },
  {
    title: 'How Do You Prioritize When Everything Is Urgent?',
    body: 'You have three things due simultaneously: a **critical production bug** affecting users, a **feature deadline** promised to a key customer, and a **code review** your teammate is blocked on.\n\nWalk me through exactly how you handle this.\n\nTests: prioritization framework, stakeholder communication, working under pressure.',
    type: 'behavioral', difficulty: 'medium', topic: 'prioritization',
    company: ['google', 'amazon', 'microsoft', 'meta'],
    hints: ['Production bug = P0, user impact is immediate', 'Communicate proactively with ALL stakeholders', 'Delegate the code review if possible', 'Use impact × urgency to justify your ordering'],
    evaluationCriteria: ['Production issue = top priority', 'Proactive communication', 'Clear framework', 'Delegation considered', 'Not just doing things in order received'],
    tags: ['behavioral', 'prioritization', 'communication'],
  },

  // ════════════════════════════════════════
  // FRONTEND
  // ════════════════════════════════════════
  {
    title: 'Explain the JavaScript Event Loop',
    body: 'What is the output of this code and **why**?\n\n```js\nconsole.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");\n```\n\nExpected: `1 4 3 2`\n\nExplain: call stack, Web APIs, microtask queue (Promises), macrotask queue (setTimeout), and how they interact.',
    type: 'frontend', difficulty: 'medium', topic: 'javascript-internals',
    company: ['google', 'facebook', 'netflix', 'airbnb', 'uber'],
    hints: ['Synchronous code runs first', 'Promises go to microtask queue (higher priority)', 'setTimeout goes to macrotask queue (lower priority)', 'Microtasks always run before macrotasks'],
    evaluationCriteria: ['Correct output 1,4,3,2', 'Microtask vs macrotask priority', 'Call stack model', 'Web APIs as separate thread'],
    tags: ['javascript', 'event-loop', 'async', 'promises'],
  },
  {
    title: 'Implement Debounce and Throttle',
    body: 'Implement **debounce** — ensures a function is only called after a specified delay since the last invocation.\n\nThen implement **throttle** — ensures a function is called at most once per interval.\n\nExplain real-world use cases for each.\n\n```js\nconst debouncedSearch = debounce(search, 300);\n// user types  only calls search 300ms after they stop\n```',
    type: 'frontend', difficulty: 'medium', topic: 'javascript-patterns',
    company: ['amazon', 'facebook', 'google', 'microsoft', 'flipkart'],
    hints: ['Debounce: clearTimeout on each call, setTimeout at end', 'Throttle: track last execution time', 'Debounce use case: search input', 'Throttle use case: scroll events'],
    evaluationCriteria: ['Correct debounce with setTimeout/clearTimeout', 'Handles arguments and this context', 'Throttle limits frequency', 'Use cases correct'],
    tags: ['javascript', 'closures', 'debounce', 'throttle'],
  },
  {
    title: 'React: Virtual DOM and Reconciliation',
    body: 'Explain how React\'s reconciliation algorithm works:\n\n1. What is the Virtual DOM and why does it exist?\n2. How does React\'s diffing achieve O(n) complexity?\n3. What are the two key assumptions React makes?\n4. Why are `key` props critical in list rendering?\n5. What is React Fiber? What problem does it solve?\n\nBonus: What triggers a re-render? How do `React.memo`, `useMemo`, `useCallback` help?',
    type: 'frontend', difficulty: 'hard', topic: 'react-internals',
    company: ['facebook', 'airbnb', 'netflix', 'twitter'],
    hints: ['VirtualDOM = lightweight JS copy of real DOM', 'Two assumptions: different types  different trees; keys stabilize list identity', 'Fiber: interruptible rendering for animations', 'Re-render: setState, prop change, context, parent re-render'],
    evaluationCriteria: ['Virtual DOM as optimization', 'O(n) diffing with 2 heuristics', 'Keys explained correctly', 'Fiber concurrent rendering', 'Memoization techniques'],
    tags: ['react', 'virtual-dom', 'reconciliation', 'fiber'],
  },

  // ════════════════════════════════════════
  // BACKEND
  // ════════════════════════════════════════
  {
    title: 'SQL vs NoSQL — When to Use Which?',
    body: 'When do you choose SQL vs NoSQL? For each use case below, which database type would you pick and why?\n\n- E-commerce order management (consistency critical)\n- Real-time game leaderboard\n- User activity feed\n- IoT sensor time-series data\n- Social graph (who follows whom)\n- Document storage (contracts, resumes)\n\nAlso explain: ACID vs BASE, CAP theorem.',
    type: 'backend', difficulty: 'medium', topic: 'databases',
    company: ['amazon', 'google', 'microsoft', 'stripe', 'shopify'],
    hints: ['Orders  PostgreSQL (ACID transactions)', 'Leaderboard  Redis sorted sets', 'Activity feed  Cassandra (write-heavy, time-series)', 'Social graph  Neo4j or recursive SQL', 'Documents  MongoDB'],
    evaluationCriteria: ['ACID vs BASE', 'CAP theorem mentioned', 'Correct DB for each use case with reasoning', 'Horizontal scaling advantage of NoSQL'],
    tags: ['database', 'sql', 'nosql', 'acid', 'cap-theorem'],
  },
  {
    title: 'JWT Authentication — Security Deep Dive',
    body: 'Explain JWT authentication end to end:\n\n1. Three parts of a JWT? (Header.Payload.Signature)\n2. How is it signed and verified?\n3. `localStorage` vs `httpOnly cookie` — which is safer and why?\n4. Why short-lived access tokens (15min) + refresh tokens (7 days)?\n5. How do you invalidate a JWT before expiry?\n6. JWT vs session-based auth — when to use each?\n\nBonus: How does OAuth 2.0 / "Sign in with Google" work?',
    type: 'backend', difficulty: 'medium', topic: 'authentication',
    company: ['amazon', 'google', 'facebook', 'stripe', 'tcs', 'infosys'],
    hints: ['localStorage: vulnerable to XSS. httpOnly cookie: immune to XSS', 'Short access + refresh token rotation = security + good UX', 'Invalidation: blacklist or very short expiry', 'OAuth 2.0: authorization code flow'],
    evaluationCriteria: ['Structure correct', 'HMAC-SHA256 signing', 'httpOnly cookie recommended', 'XSS vs CSRF tradeoffs', 'Access + refresh pattern', 'Invalidation strategy'],
    tags: ['authentication', 'jwt', 'security', 'oauth'],
  },
  {
    title: 'Database Indexing — B-Tree, Composite, EXPLAIN',
    body: 'Explain database indexing in depth:\n\n1. How does a B-Tree index work? What queries benefit?\n2. Cost of too many indexes?\n3. Composite index (a, b, c) — what is the left-prefix rule?\n4. What is a covering index?\n5. How do you use `EXPLAIN ANALYZE` to diagnose slow queries?\n\nGiven `orders(id, user_id, status, created_at, amount)` with 100M rows — what indexes would you create?',
    type: 'backend', difficulty: 'hard', topic: 'database-internals',
    company: ['amazon', 'google', 'uber', 'airbnb', 'stripe'],
    hints: ['B-Tree: O(log n) lookup, supports range queries and ORDER BY', 'Index cost: extra storage + slower writes', 'Left-prefix: (a,b,c) helps (a), (a,b), (a,b,c) but NOT (b,c)', 'Covering index: all query columns are IN the index'],
    evaluationCriteria: ['B-Tree structure', 'Write overhead acknowledged', 'Left-prefix rule', 'Covering index', 'Recommends (user_id, created_at)', 'EXPLAIN output interpretation'],
    tags: ['database', 'indexing', 'sql', 'performance', 'b-tree'],
  },
];

const seed = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) { console.error(' MONGO_URI not set in .env'); process.exit(1); }

    await mongoose.connect(uri, { dbName: 'ai-interview' });
    console.log(' Connected to MongoDB');

    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions\n');

    const inserted = await Question.insertMany(questions);

    const byType = {}, byDiff = {};
    inserted.forEach(q => {
      byType[q.type] = (byType[q.type] || 0) + 1;
      byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    });

    console.log(` Seeded ${inserted.length} questions\n`);
    console.log('By type:');
    Object.entries(byType).sort((a,b)=>b[1]-a[1]).forEach(([t,c]) => console.log(`  ${t.padEnd(20)} ${c}`));
    console.log('\nBy difficulty:');
    Object.entries(byDiff).forEach(([d,c]) => console.log(`  ${d.padEnd(20)} ${c}`));

    await mongoose.disconnect();
    console.log('\n Done! Starter code now reads from stdin — all test cases will work correctly.');
    process.exit(0);
  } catch (err) {
    console.error(' Seed error:', err.message);
    process.exit(1);
  }
};

seed();