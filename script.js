'use strict';

// Data
const account1 = {
  owner: 'Adetayo Adebowale',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Yinka Quadri',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Tolu Oye',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Steve Baba Agba',
  movements: [430, 1000, 700, -50, 90],
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

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//COMPUTING THE DOM
containerMovements.innerHTML = ' ';

const displayMovements = function (movements) {
  movements.forEach((value, i) => {
    const type = value > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${Math.abs(value)}$</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// COMPUTING THE OVERALL BALANCE
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = `${account.balance}$`;
};

//COMPUTING THE TOTAL INCOME AND OUTCOME AND INTEREST.

const calDisplaySumary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov));

  labelSumIn.textContent = `${income}$`;

  const out = account.movements
    .filter(mov => mov < 0)
    ?.reduce((acc, mov) => (acc += mov));

  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, mov) => (acc += mov));

  labelSumInterest.textContent = `${interest}$`;
};

//COMPUTING THE USERNAME

(acts => {
  acts.forEach(act => {
    act.username = act.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
})(accounts);

//UPDATE THE BALANCE, SUMMARY AND FLOW

const updateUI = acc => {
  //calculate Balance
  calcDisplayBalance(acc);
  // calculate Summary
  calDisplaySumary(acc);
  // display FLOW
  displayMovements(acc.movements);
};

//LOGGING IN AND UPDATING THE UI

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    //display UI and welcome message!
    labelWelcome.textContent = `Good day ${
      currentAccount.owner.split(' ')[0]
    }!`;
    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
  }
});

//COMPUTING THE TRANSFER FUNCTION

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    receiver.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    updateUI(currentAccount);
  }
});

//REQUESTING LOAN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

//CLOSE ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeUser = inputCloseUsername.value;
  const closeUserPin = Number(inputClosePin.value);

  const index = accounts.findIndex(acc => acc.username === closeUser);

  console.log(index);
  if (
    closeUser === currentAccount.username &&
    closeUserPin === currentAccount.pin
  ) {
    accounts.splice(index, 1);
  }

  containerApp.style.opacity = 0;
});

console.log(accounts);
