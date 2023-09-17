import { CodingContract, CodingContractData } from '@ns';

type ContractSolver = {
  type:
    | 'HammingCodes: Encoded Binary to Integer'
    | 'Array Jumping Game II'
    | 'Sanitize Parentheses in Expression'
    | 'Encryption I: Caesar Cipher'
    | 'Generate IP Addresses';
  solve: (data: CodingContractData) => string | number;
};
export const solvers: ContractSolver[] = [
  {
    type: 'Encryption I: Caesar Cipher',
    solve: (data: CodingContractData) => {
      const cipher = data[0];
      const shift = parseInt(data[1]);
      return cipher
        .split('')
        .map((char) => (char === ' ' ? char : String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65)))
        .join('');
    },
  },
  {
    type: 'Array Jumping Game II',
    solve: (data: CodingContractData) => {
      if (data[0] == 0) return '0';
      const n = data.length;
      let reach = 0;
      let jumps = 0;
      let lastJump = -1;
      while (reach < n - 1) {
        let jumpedFrom = -1;
        for (let i = reach; i > lastJump; i--) {
          if (i + data[i] > reach) {
            reach = i + data[i];
            jumpedFrom = i;
          }
        }
        if (jumpedFrom === -1) {
          jumps = 0;
          break;
        }
        lastJump = jumpedFrom;
        jumps++;
      }
      return jumps;
    },
  },
  {
    type: 'Sanitize Parentheses in Expression',
    solve: (data: CodingContractData) => {
      let left = 0;
      let right = 0;
      const res = [];
      for (let i = 0; i < data.length; ++i) {
        if (data[i] === '(') {
          ++left;
        } else if (data[i] === ')') {
          left > 0 ? --left : ++right;
        }
      }

      function dfs(pair, index, left, right, s, solution, res) {
        if (s.length === index) {
          if (left === 0 && right === 0 && pair === 0) {
            for (let i = 0; i < res.length; i++) {
              if (res[i] === solution) {
                return;
              }
            }
            res.push(solution);
          }
          return;
        }
        if (s[index] === '(') {
          if (left > 0) {
            dfs(pair, index + 1, left - 1, right, s, solution, res);
          }
          dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
        } else if (s[index] === ')') {
          if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
          if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
        } else {
          dfs(pair, index + 1, left, right, s, solution + s[index], res);
        }
      }
      dfs(0, 0, left, right, data, '', res);

      return res;
    },
  },
  {
    type: 'Generate IP Addresses',
    solve: (data: CodingContractData) => {
      const ret = [];
      for (let a = 1; a <= 3; ++a) {
        for (let b = 1; b <= 3; ++b) {
          for (let c = 1; c <= 3; ++c) {
            for (let d = 1; d <= 3; ++d) {
              if (a + b + c + d === data.length) {
                const A = parseInt(data.substring(0, a), 10);
                const B = parseInt(data.substring(a, a + b), 10);
                const C = parseInt(data.substring(a + b, a + b + c), 10);
                const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
                if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                  const ip = [A.toString(), '.', B.toString(), '.', C.toString(), '.', D.toString()].join('');
                  if (ip.length === data.length + 3) {
                    ret.push(ip);
                  }
                }
              }
            }
          }
        }
      }
      return ret.toString();
    },
  },
];
