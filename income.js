






import { currentMonth, monthsData, updateTotals, renderIncome, renderBudgetTracking } from './script.js';

const btnIncomeNew = document.getElementById("btnIncomeNew");
const addIncomeModal = document.getElementById('addIncomeModal');
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const errorMessage = document.getElementById('errorMessage');
const salary = document.querySelector('.salary');
const editIncomeModal = document.getElementById('editIncomeModal');
const editIncomeBtn = document.getElementById('editIncomeBtn');

const incomeArray = [];

renderIncome();

// function renderIncome() {
//   salary.innerHTML = '';

//   incomeArray.forEach((income, index) => {
//     const incomeElement = document.createElement('div');
//     incomeElement.classList.add('expence-container');
//     incomeElement.innerHTML = `
//         <div class="income-box">
//           <p class="income-title" data-index="${index}">${income.title}</p>
//           <p class="income-amount" data-index="${index}">$${income.amount}</p>
//           <button class="income-del" id="delIncomeBtn" data-index="${index}">Delete</button>
//         </div>
//     `;
//     salary.appendChild(incomeElement);
//   })

//   document.querySelectorAll('.salary p').forEach(p => {
//     p.addEventListener('click', (e) => {
//       const index = Number(e.target.dataset.index);
//       IncomeHandleEdit(index);
//     })
//   });

//   document.querySelectorAll('.income-del').forEach(button => {
//     button.addEventListener('click', incomeHandleDelete);
//   })
// }

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

function incomeHandleDelete(e) {
  const index = e.target.dataset.index;
  incomeArray.splice(index, 1);  
  renderIncome();
}

// Save edited income
editIncomeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const index = editIncomeBtn.getAttribute('data-index'); 
  const incomeTitleEdit = document.getElementById('incomeTitleEdit');
  const incomeAmountEdit = document.getElementById('incomeAmountEdit');
  const monthData = monthsData[currentMonth];
  const incomeTitleEditValue = document.getElementById('incomeTitleEdit').value.trim();
  const incomeAmountEditValue = document.getElementById('incomeAmountEdit').value.trim();
  const errorMessageEdit = document.getElementById('errorMessageEdit');  

  monthData.income[index].description = document.getElementById('incomeTitleEdit').value;
  monthData.income[index].amount = document.getElementById('incomeAmountEdit').value;

  if (incomeTitleEditValue === '' || incomeAmountEditValue === '') {
    errorMessageEdit.textContent = 'Please fill in both fields before saving.';  
    errorMessageEdit.style.color = 'red'; 
    errorMessageEdit.style.display = 'block';  
    return;  
  }
  
  renderIncome();  // Re-render income after editing
  editIncomeModal.style.display = 'none';
  handleIncomeAction(incomeTitleEdit, incomeAmountEdit, editIncomeModal, 'edit', index);
});




//     editIncomeBtn 
//     e.preventDefault();
//     const index = editIncomeBtn.getAttribute('data-index');
//     const monthData = monthsData[currentMonth];

//     const incomeTitleEditValue = document.getElementById('incomeTitleEdit').value.trim();
//     const incomeAmountEditValue = document.getElementById('incomeAmountEdit').value.trim();
//     const errorMessageEdit = document.getElementById('errorMessageEdit');  

    
//     monthData.income[index].description = document.getElementById('incomeTitleEdit').value;
//     monthData.income[index].amount = document.getElementById('incomeAmountEdit').value;


//     if (incomeTitleEdit === '' || incomeAmountEdit === '') {
//         errorMessageEdit.textContent = 'Please fill in both fields before saving.';  
//         errorMessageEdit.style.color = 'red'; 
//         errorMessageEdit.style.display = 'block';  
//         return;  
//     }

//     renderIncome();  // Re-render income after editing
//     editIncomeModal.style.display = 'none';
// });

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


// Show the add income modal
btnIncomeNew.addEventListener('click', () => {
    incomeClearModalInputs(addIncomeModal);
    addIncomeModal.style.display = 'block';
});

// Handle saving new income
saveIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const incomeTitleInput = document.getElementById('incomeTitleInput');
    const incomeAmountInput = document.getElementById('incomeAmountInput');

    if (incomeTitleInput.value.trim() !== '' && incomeAmountInput.value.trim() !== '') {
        errorMessage.style.display = 'none';
        addIncome(incomeAmountInput.value, incomeTitleInput.value);  // Add income to current month data
        renderIncome();  // Re-render income
        addIncomeModal.style.display = 'none';  // Close modal
    } else {
        errorMessage.textContent = 'Please check your input values.';
        errorMessage.style.display = 'block';
    }
});

// Add new income to the current month
function addIncome(amount, description) {
    if (!monthsData[currentMonth]) {
        monthsData[currentMonth] = { income: [], expenses: [] };
    }
    monthsData[currentMonth].income.push({ amount, description });
    renderIncome();  // Re-render after adding new income
    updateTotals();  // Update totals
    renderBudgetTracking();  // Recalculate and update budget tracking
}

