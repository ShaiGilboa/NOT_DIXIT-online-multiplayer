export const randInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const randFromArr = (amount, arr) => {
  if (amount > arr.length) return false;
  if (amount === arr.length) return arr;
  const chosenObjects = [];
  const chosenIndexes = [];
  while (chosenObjects.length < amount) {
    let randomIndex = randInRange(0, arr.length);
    if(!chosenIndexes.includes(randomIndex)) {
      chosenIndexes.push(randomIndex);
      chosenObjects.push(arr[randomIndex])
    }
  }
  return chosenObjects;
}

export const oneRandFromArr = (arr) => {
  if(arr.length===1)return arr[0]

}

export const reshuffleArr = (arr) => {
  if(arr.length<=1)return arr;
  const reshuffledArr = [];
  while (arr.length) {
    let randomNumber = randInRange(1, 101);
    let item = randomNumber%2===0
      ? arr.pop()
      : arr.shift()
    randomNumber = randInRange(1, 101)
    randomNumber%2===0
      ? reshuffledArr.push(item)
      : reshuffledArr.unshift(item)
  }
  return reshuffledArr
}
