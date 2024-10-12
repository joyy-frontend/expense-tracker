const btnIncomeNew = document.getElementById("btnIncomNew");
const addIncomeModal = document.getElementById('addIncomeModal');
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const errorMessage = document.getElementById('errorMessage'); 
const salary = document.querySelector('.salary');
const editIncomeModal = document.getElementById('editIncomeModal');
const incomeArray = [];

renderIncome();

function renderIncome() {
  salary.innerHTML = '';

  incomeArray.forEach((income, index) => {
    const incomeElement = document.createElement('div');
    incomeElement.classList.add('income-list');
    incomeElement.innerHTML = `
      <p data-index="${index}">${income.title} ${income.amount}</p>
      <button class="income-del" data-index="${index}">Delete</button>
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

  incomeArray[index].title = document.getElementById('incomeTitleEdit').value;
  incomeArray[index].amount = document.getElementById('incomeAmountEdit').value;

  renderIncome();

  editIncomeModal.style.display = 'none';
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

saveIncomeBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const incomeTitleInput = document.getElementById('incomeTitleInput');
  const incomeAmountInput = document.getElementById('incomeAmountInput');
  
  if (incomeTitleInput.value.trim() !== '' && incomeAmountInput.value.trim() !== '') {
    errorMessage.style.display = 'none';
    incomeArray.push({ title: incomeTitleInput.value, amount: incomeAmountInput.value });
    renderIncome();
    addIncomeModal.style.display = 'none';
  } else {
    errorMessage.textContent = 'Please check your input values.';
    errorMessage.style.display = 'block';
  }
});