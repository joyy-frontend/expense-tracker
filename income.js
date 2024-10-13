const btnIncomeNew = document.getElementById("btnIncomNew");
const addIncomeModal = document.getElementById('addIncomeModal');
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const errorMessage = document.getElementById('errorMessage'); 
const salary = document.querySelector('.salary');
const editIncomeModal = document.getElementById('editIncomeModal');
const editIncomeBtn = document.getElementById('editIncomeBtn');
const incomeArray = [];

renderIncome();

function renderIncome() {
  salary.innerHTML = '';

  incomeArray.forEach((income, index) => {
    const incomeElement = document.createElement('div');
    incomeElement.classList.add('expence-container');
    incomeElement.innerHTML = `
        <div class="income-box">
          <p class="income-title" data-index="${index}">${income.title}</p>
          <p class="income-amount" data-index="${index}">$${income.amount}</p>
          <button class="income-del" id="delIncomeBtn" data-index="${index}">Delete</button>
        </div>
    `;
    salary.appendChild(incomeElement);
  })

  document.querySelectorAll('.salary p').forEach(p => {
    p.addEventListener('click', (e) => {
      const index = Number(e.target.dataset.index);
      IncomeHandleEdit(index);
    })
  });

  document.querySelectorAll('.income-del').forEach(button => {
    button.addEventListener('click', incomeHandleDelete);
  })
}

btnIncomeNew.addEventListener('click', () => {
  incomeClearModalInputs(addIncomeModal);
  addIncomeModal.style.display = 'block';
});

function IncomeHandleEdit(index) {
  document.getElementById('incomeTitleEdit').value = incomeArray[index].title;
  document.getElementById('incomeAmountEdit').value = incomeArray[index].amount;
  editIncomeModal.style.display = 'block';
  editIncomeBtn.setAttribute('data-index', index);
}

editIncomeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const index = editIncomeBtn.getAttribute('data-index'); 
  const incomeTitleEdit = document.getElementById('incomeTitleEdit');
  const incomeAmountEdit = document.getElementById('incomeAmountEdit');
  
  handleIncomeAction(incomeTitleEdit, incomeAmountEdit, editIncomeModal, 'edit', index);
});


function incomeHandleDelete(e) {
  const index = e.target.dataset.index;
  incomeArray.splice(index, 1);  
  renderIncome();
}

function incomeClearModalInputs(modal) {
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
}

function handleIncomeAction(titleInput, amountInput, modal, status, index) {
  const errorMessageEdit = document.getElementById('errorMessageEdit'); 

  if (titleInput.value.trim() !== '' && amountInput.value.trim() !== '') {
    errorMessageEdit.style.display = 'none'; 

    if (status === 'edit') {
      incomeArray[index].title = titleInput.value;
      incomeArray[index].amount = amountInput.value;
    } else {
      incomeArray.push({ title: titleInput.value, amount: amountInput.value });
    }

    renderIncome(); 
    modal.style.display = 'none'; 
  } else {
    if (status === 'edit') {
      errorMessageEdit.textContent = 'Please check your input values.';
      errorMessageEdit.style.display = 'block';
    } else {
      errorMessage.textContent = 'Please check your input values.';
      errorMessage.style.display = 'block';
    }
  }
}

saveIncomeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const incomeTitleInput = document.getElementById('incomeTitleInput');
  const incomeAmountInput = document.getElementById('incomeAmountInput');
  handleIncomeAction(incomeTitleInput, incomeAmountInput, addIncomeModal, 'save');
});

