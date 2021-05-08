'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';//remove any hardcoded values in .html

  movements.forEach(function(mov,i){
    const type = mov > 0 ? 'deposit':'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin',html);

  })
}

const updateUI = function (account){
  displayMovements(account.movements);
  calcBalance(account);
  calcDisplaySummary(account);

}

const calcBalance =  function(account){
  account.balance = account.movements.reduce((acc,curr) => acc + curr,0);
  labelBalance.textContent = `${account.balance} EUR`;
}

accounts.forEach(acc => calcBalance(acc))

const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name =>name[0]).join('');
  })
}
createUsernames(accounts);

let currentAccount;

btnLogin.addEventListener('click', function (e){
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Logged in.');
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    updateUI(currentAccount);

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

  } else {
    console.log('not Logged in.');
  }

  console.log(currentAccount)

})

const calcDisplaySummary = function (account){
  const incomes = account.movements.filter(mov => mov > 0)
      .reduce((acc,curr) => acc+curr,0);
  labelSumIn.textContent = `${incomes}€`

  const out = account.movements.filter(mov => mov < 0)
      .reduce((acc,cur) => acc+cur,0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements.filter(mov => mov > 0)
      .map(deposit => deposit * (account.interestRate/100))
      .filter((int,i,arr) => {
        return int >= 1
      })
      .reduce((acc,int) => acc+int,0);

  labelSumInterest.textContent = `${interest}€`
}

btnTransfer.addEventListener('click', function(event){
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  //handle conversion
  if (receiverAcc && amount > 0 && currentAccount.balance >= amount && receiverAcc?.username !==
  currentAccount.username){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);

    console.log('Transfer valid!')
  } else {
    console.log('Transfer invalid!')
  }

  inputTransferAmount.value = inputTransferTo.value = '';
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && ){

  }



})

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  console.log('Deleting a user');

  if(inputCloseUsername.value === currentAccount.username
  && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    //hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';

    //Delete user
    accounts.splice(index, 1);

  }
})



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//
// currencies.forEach(function (value,key,map){
//   console.log(`${key}: ${value}`);
// });
//
// const curenciesUnique = new Set([
//    'USD','GBP','USD','EUR','EUR'
// ]);
// console.log(curenciesUnique);
// curenciesUnique.forEach(function (value, _,map){
//   console.log(` ${value}`);
// });
//
//
// console.log(accounts);
//
//
// const deposits = movements.filter(function (mov){
//   return mov > 0;
// })
//
// console.log(movements);
// console.log(deposits);
//
// const depositsFor = [];
// for(const mov of movements) if (mov > 0) depositsFor.push(mov);


// const withdrawls = [];
// movements.forEach(function (mov){
//   mov < 0 && withdrawls.push(mov)
// });
/*
const withdrawls = movements.filter(mov => mov < 0)

console.log(withdrawls);*/


//accumulator -> snowball
// const balance = movements.reduce(function (acc,curr,i,arr){
//   return acc + curr;
// }, 0)

/*
for (const movement of movements) {
  if(movement > 0){
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);

  }
}

console.log('===FOR EACH===')

movements.forEach(function (movement,i,array){
  if(movement > 0){
    console.log(`${i+1}.You deposited ${movement}`);
  } else {
    console.log(`${i+1}.You withdrew ${Math.abs(movement)}`);

  }
});
*/


/////////////////////////////////////////////////
/*
let arr = ['a','b','c','d','e']


//slice
console.log(arr.slice(2));
console.log(arr.slice(2,4));
console.log(arr.slice(-1));
console.log(arr.slice(1,-2));
console.log(arr.slice());

//splice (mutates array permanently)
// console.log(arr.splice(2));
arr.splice(1,2);
console.log(arr);

//Reverse
arr = ['a','b','c','d','e']
const arr2 = ['j','i','h','g','f']
arr2.reverse();
console.log(arr2);

//concat
const  letters = arr.concat(arr2);
console.log(letters);

//JOIN
console.log(letters.join(' - '));


const Julia1 = [3,5,2,12,7];
const Kate1 = [4,1,15,8,3];

const Julia2 = [9,16,6,8,3];
const Kate2 = [19,5,6,1,4];


const checkDogs = function (arr1,arr2) {
  const arr1New = arr1.slice(1,3);

  const arrayCombined = [...arr1New,...arr2]

  arrayCombined.forEach(function (dog,index){
    if(dog >= 3){
      console.log(`Dog number ${index+1} is an adult, and is ${dog} years old.`);
    } else{
      console.log(`Dog number ${index+1} is still a puppy.`);
    }
  });
}

console.log('===Test 1===')
checkDogs(Julia1,Kate1);
console.log('===Test 2===')
checkDogs(Julia2,Kate2);


const euroToUsd = 1.1;
const movementsUsd = movements.map(mov => mov * euroToUsd);


console.log(movements)
console.log(movementsUsd)

const movementsUSDfor = [];
for(const mov of movements) movementsUSDfor.push(mov * euroToUsd);

console.log(movementsUSDfor);

*/


// console.log('coding challenge ===== 2')

// const calcAverageHumanAge = function(arr){
//
//   let dogsOut = arr.map(age => age <= 2 ? age * 2 : 16 + age*4)
//
//   dogsOut = dogsOut.filter(dog => dog > 18);
//   console.log(dogsOut)
//   const avgVal =dogsOut.reduce((acc,curr) => acc+curr,0) / dogsOut.length;
//   console.log(avgVal)
//
//   return avgVal;
// }
//
// const calcAverageHumanAge = (arr) => arr.map(age => age <= 2 ? age * 2 : 16 + age*4)
//     .filter(dog => dog > 18).reduce((acc,cur) => acc+cur,0) / arr.length;
//
// const arr1 = [5,2,4,1,15,8,3]
// const arr2 = [16,6,10,5,6,1,4]
//
// console.log(calcAverageHumanAge(arr1));
// console.log(calcAverageHumanAge(arr2));
//
// console.log('coding challenge ===== 2 done')
//
//
// const eurToUsd = 1.1
// const totalDepositInUsd =  movements.filter(mov => mov >0).map(num => num * eurToUsd).reduce((acc,mov) =>
// acc+mov,0)
//
// console.log(totalDepositInUsd);
//
