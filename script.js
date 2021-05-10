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

const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = '';//remove any hardcoded values in .html

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);

    })
}

const updateUI = function (account) {
    displayMovements(account.movements);
    calcBalance(account);
    calcDisplaySummary(account);
}

const calcBalance = function (account) {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = `${account.balance} EUR`;
}

accounts.forEach(acc => calcBalance(acc))

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    })
}
createUsernames(accounts);

let currentAccount;

btnLogin.addEventListener('click', function (e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
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

const calcDisplaySummary = function (account) {
    const incomes = account.movements.filter(mov => mov > 0)
        .reduce((acc, curr) => acc + curr, 0);
    labelSumIn.textContent = `${incomes}€`

    const out = account.movements.filter(mov => mov < 0)
        .reduce((acc, cur) => acc + cur, 0);
    labelSumOut.textContent = `${Math.abs(out)}€`;

    const interest = account.movements.filter(mov => mov > 0)
        .map(deposit => deposit * (account.interestRate / 100))
        .filter((int, i, arr) => {
            return int >= 1
        })
        .reduce((acc, int) => acc + int, 0);

    labelSumInterest.textContent = `${interest}€`
}

btnTransfer.addEventListener('click', function (event) {
    event.preventDefault();

    const amount = Number(inputTransferAmount.value);
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

    inputTransferAmount.value = inputTransferTo.value = '';
})

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
        //add movement
        currentAccount.movements.push(amount);

        //update UI
        updateUI(currentAccount);
    }

    inputTransferAmount.value = inputTransferTo.value = '';

});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Deleting a user');

    if (inputCloseUsername.value === currentAccount.username
        && Number(inputClosePin.value) === currentAccount.pin) {

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


//Challenge 4.
/*
Eating too much or too little.
Eating an okay amount means the dog's current food portion is within range 10%
above and 10% below the recommended portion.

 */

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
