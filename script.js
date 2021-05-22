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

const displayMovements = function (acc, sort = true) {
    containerMovements.innerHTML = '';//remove any hardcoded values in .html

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);

    })
}

const calcDisplaySummary = function (account) {
    const incomes = account.movements.filter(mov => mov > 0)
        .reduce((acc, curr) => acc + curr, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`

    const out = account.movements.filter(mov => mov < 0)
        .reduce((acc, cur) => acc + cur, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

    const interest = account.movements.filter(mov => mov > 0)
        .map(deposit => deposit * (account.interestRate / 100))
        .filter((int, i, arr) => {
            return int >= 1
        })
        .reduce((acc, int) => acc + int, 0);

    labelSumInterest.textContent = `${interest.toFixed(2)}€`
}


const updateUI = function (account) {
    displayMovements(account);
    calcBalance(account);
    calcDisplaySummary(account);
}

const calcBalance = function (account) {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = `${account.balance.toFixed(2)} EUR`;
}

accounts.forEach(acc => calcBalance(acc))

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    })
}
createUsernames(accounts);

const startLogOutTimer = function (){

    const tick = function (){
        const min = String(Math.floor(time / 60)).padStart(2,0);
        const seconds = String(time % 60).padStart(2,0);

        labelTimer.textContent = `${min}:${seconds}`;

        if(time < 1){
            clearInterval(timer);
            labelWelcome.textContent= `You've been logged out`;
            containerApp.style.opacity = 0;
        }
        time--;
    }

    let time = 120;

    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}


let currentAccount, timer;

// FAKE login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


//day/month/years

btnLogin.addEventListener('click', function (e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

    if (currentAccount?.pin === +(inputLoginPin.value)) {
        console.log('Logged in.');
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;
        updateUI(currentAccount);

        const now = new Date();
        const day = `${now.getDate()}`.padStart(2,0);
        const month = `${now.getMonth()+1}`.padStart(2,0);
        const year = now.getFullYear();
        const hour = now.getHours();
        const min = now.getMinutes();
        labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`


        if (timer) clearInterval(timer);
        timer = startLogOutTimer();

        //clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

    } else {
        console.log('not Logged in.');
    }

})

btnTransfer.addEventListener('click', function (event) {
    event.preventDefault();

    const amount = +(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

    //handle conversion
    if (receiverAcc && amount > 0 && currentAccount.balance >= amount && receiverAcc?.username !==
        currentAccount.username) {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        updateUI(currentAccount);

        console.log('Transfer valid!')
    } else {
        console.log('Transfer invalid!')
    }

    inputTransferAmount.value = inputTransferTo.value = ''

    clearInterval(timer);
    timer = startLogOutTimer();
})

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
        //add movement
        currentAccount.movements.push(amount);

        //update UI
        updateUI(currentAccount);
    }

    inputTransferAmount.value = inputTransferTo.value = '';

    clearInterval(timer);
    timer = startLogOutTimer();

});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Deleting a user');

    if (inputCloseUsername.value === currentAccount.username
        && +(inputClosePin.value) === currentAccount.pin) {

        const index = accounts.findIndex(acc => acc.username === currentAccount.username)

        //hide UI
        containerApp.style.opacity = 0;
        inputCloseUsername.value = inputClosePin.value = '';

        //Delete user
        accounts.splice(index, 1);

    }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})

// setInterval(function (){
//     const now = new Date();
//     console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
// },1000);


//Challenge 4.
/*
Eating too much or too little.
Eating an okay amount means the dog's current food portion is within range 10%
above and 10% below the recommended portion.

 */
/*
const dogs = [
    {weight: 22, curFood: 250, owners: ['Alice', 'Bob']},
    {weight: 8, curFood: 200, owners: ['Matilda']},
    {weight: 13, curFood: 275, owners: ['Sarah', 'John']},
    {weight: 32, curFood: 340, owners: ['Michael']},
]

//task 1
dogs.forEach(dog => dog.recommendedFood = dog.weight ** 0.75 * 28)
//task 2

// const sarah = dogs.filter(dog => dog.owners.includes('Sarah'))
const sarahsdog = dogs.find(dog => dog.owners.includes('Sarah'));

if(sarahsdog.curFood >= sarahsdog.recommendedFood * 0.9
    && sarahsdog.curFood <= sarahsdog.recommendedFood *1.1){
  console.log('Eats enough')
} else if (sarahsdog.curFood > sarahsdog.recommendedFood * 1.1){
  console.log('Eats too much')
} else if (sarahsdog.curFood < sarahsdog.recommendedFood * 0.9){
  console.log('Eats too little')
} else {
  console.log('Not found... :/')
}

//task 3
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood * 1.1)
    .map(dog => dog.owners).flat();
console.log(ownersEatTooMuch);

//task 4

const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood * 0.9)
    .map(dog => dog.owners).flat();


console.log(`${ownersEatTooMuch.join(' and ')} dog's eat too much.`);
console.log(`${ownersEatTooLittle.join(' and ')} dog's eat too little`);

//task 5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//task 6
console.log(dogs.some(dog => dog.curFood >= dog.recommendedFood * 0.9
    && dog.curFood <= dog.recommendedFood *1.1));

//task 7
const healthyDogs = dogs.filter(dog => dog.curFood >= dog.recommendedFood * 0.9
    && dog.curFood <= dog.recommendedFood *1.1)

console.log(healthyDogs);

//task 8

const newDogs = dogs.slice().sort(
    (dog1,dog2) => (dog1.curFood>dog2.curFood) ? 1 : -1
);
console.log(newDogs);
 */

// LECTURES

// console.log(23 ===23.0)
//
// console.log(0.1+0.2)
//
// console.log(Number('23'))
// console.log(+'23')
//
// //parsing
//
// console.log(Number.parseInt('30px'))
// console.log(Number.parseFloat('2.5rem'))
//
// console.log(Number.isNaN(20))
// console.log(Number.isNaN(+'20x'))
//
//
//
// console.log(Number.isFinite(20));


