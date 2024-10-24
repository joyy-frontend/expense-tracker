import { currentMonth, monthsData, updateTotals, renderIncome, renderBudgetTracking } from './script.js';

const btnIncomeNew = document.getElementById("btnIncomeNew");
const addIncomeModal = document.getElementById('addIncomeModal');
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const errorMessage = document.getElementById('errorMessage');
const editIncomeModal = document.getElementById('editIncomeModal');
const editIncomeBtn = document.getElementById('editIncomeBtn');

const incomeArray = [];

renderIncome();

btnIncomeNew.addEventListener('click', () => {
  incomeClearModalInputs(addIncomeModal);
  addIncomeModal.style.display = 'block';
});

// Save edited income
editIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const index = editIncomeBtn.getAttribute('data-index');  // Get index of the income being edited
    const incomeTitleEditValue = document.getElementById('incomeTitleEdit').value.trim();
    const incomeAmountEditValue = document.getElementById('incomeAmountEdit').value.trim();
    const errorMessageEdit = document.getElementById('errorMessageEdit');  

    if (incomeTitleEditValue === '' || incomeAmountEditValue === '') {
        // Show error message if validation fails
        errorMessageEdit.textContent = 'Please fill in both fields before saving.';  
        errorMessageEdit.style.color = 'red'; 
        errorMessageEdit.style.display = 'block';  
        return;  // Stop further execution if validation fails
    }

    const monthData = monthsData[currentMonth];
    
    monthData.income[index].description = incomeTitleEditValue;
    monthData.income[index].amount = incomeAmountEditValue;

    renderIncome();
    editIncomeModal.style.display = 'none';
    updateTotals();  
    renderBudgetTracking();  
});

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
      incomeArray.unshift({ title: titleInput.value, amount: amountInput.value });
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
    document.querySelector('#errorMessage').style.display = 'none';
});

// Handle saving new income
saveIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const incomeTitleInput = document.getElementById('incomeTitleInput');
    const incomeAmountInput = document.getElementById('incomeAmountInput');

    if (incomeTitleInput.value.trim() !== '' && incomeAmountInput.value.trim() !== '') {
        errorMessage.style.display = 'none';
        addIncome(incomeAmountInput.value, incomeTitleInput.value); 
        renderIncome();  
        addIncomeModal.style.display = 'none';  
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
    monthsData[currentMonth].income.unshift({ amount, description });
    renderIncome();  
    updateTotals(); 
    renderBudgetTracking();  
}