export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return [];

  const clonedArray = [...originalArray];
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]);
  });

  return orderedArray;
};

/**
 * const originalArray = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Alice' },
  { id: 3, name: 'Bob' }
];

const orderArray = [3, 1, 2];

const orderedArray = mapOrder(originalArray, orderArray, 'id');
console.log(orderedArray);

results: [
  { id: 3, name: 'Bob' },
  { id: 1, name: 'John' },
  { id: 2, name: 'Alice' }
]
 */
