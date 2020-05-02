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

export const stateDifferentThenDB = (state, db) => {
  if(state.length!==db.length)return true
  // for each player
  for(let playerTurn=0; playerTurn<state.length; playerTurn++){
    let statePlayerKeys = Object.keys(state[playerTurn])
    let dbPlayerKeys = Object.keys(db[playerTurn])
    if (statePlayerKeys.length !== dbPlayerKeys.length)return true;
    // check all keys in state and db
    for(let stateKey of statePlayerKeys) {
      if(state[playerTurn][stateKey] !== db[playerTurn][stateKey]) return true
    }
  }
  return false
}

