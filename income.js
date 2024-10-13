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

function IncomeHandleEdit(index) {
  document.getElementById('incomeTitleEdit').value = incomeArray[index].title;
  document.getElementById('incomeAmountEdit').value = incomeArray[index].amount;
  editIncomeModal.style.display = 'block';
  editIncomeBtn.setAttribute('data-index', index);
}


// Save edited income
editIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const index = editIncomeBtn.getAttribute('data-index');
    const monthData = monthsData[currentMonth];

    const incomeTitleEdit = document.getElementById('incomeTitleEdit').value.trim();
    const incomeAmountEdit = document.getElementById('incomeAmountEdit').value.trim();
    const errorMessageEdit = document.getElementById('errorMessageEdit');  

    // Update the income with edited values
    monthData.income[index].description = document.getElementById('incomeTitleEdit').value;
    monthData.income[index].amount = document.getElementById('incomeAmountEdit').value;

    // Check if the fields are not empty
    if (incomeTitleEdit === '' || incomeAmountEdit === '') {
        errorMessageEdit.textContent = 'Please fill in both fields before saving.';  
        errorMessageEdit.style.color = 'red'; 
        errorMessageEdit.style.display = 'block';  
        return;  
    }

    renderIncome();  // Re-render income after editing
    editIncomeModal.style.display = 'none';
});

// Clear modal input fields
function incomeClearModalInputs(modal) {
    const inputs = modal.querySelectorAll('input');
    const errorMessage = modal.querySelector('#errorMessage');
    errorMessage.innerHTML = '';
    inputs.forEach(input => {
        input.value = '';
    });
}

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


