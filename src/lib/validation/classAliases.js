export const normalizeClass = (val) => {
  if (!val) return null;
  const s = String(val).toLowerCase().trim().replace(/class\s*/, '');
  
  const map = {
    'nursery': 'nursery', 'nur': 'nursery', 'n.c': 'nursery', 'nc': 'nursery',
    'pg-1': 'pg-1', 'pg1': 'pg-1',
    'pg-2': 'pg-2', 'pg2': 'pg-2',
    'lkg': 'lkg',
    'ukg': 'ukg',
    'i': '1', '1': '1', 'one': '1',
    'ii': '2', '2': '2', 'two': '2',
    'iii': '3', '3': '3', 'three': '3',
    'iv': '4', '4': '4', 'four': '4',
    'v': '5', '5': '5', 'five': '5',
    'vi': '6', '6': '6', 'six': '6',
    'vii': '7', '7': '7', 'seven': '7',
    'viii': '8', '8': '8', 'eight': '8',
    'ix': '9', '9': '9', 'nine': '9',
    'x': '10', '10': '10', 'ten': '10',
    'xi': '11', '11': '11', 'eleven': '11',
    'xii': '12', '12': '12', 'twelve': '12'
  };

  return map[s] || s;
};
