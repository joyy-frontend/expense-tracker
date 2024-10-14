import { currentMonth, monthsData, updateTotals, renderIncome, salary } from './script.js';

const btnIncomeNew = document.getElementById("btnIncomeNew");
const addIncomeModal = document.getElementById('addIncomeModal');
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const errorMessage = document.getElementById('errorMessage');
//const salary = document.querySelector('.salary');
const editIncomeModal = document.getElementById('editIncomeModal');
const editIncomeBtn = document.getElementById('editIncomeBtn');

// Function to add income to the selected month
function addIncome(amount, description) {
    if (!monthsData[currentMonth]) {
        monthsData[currentMonth] = { income: [], expenses: [] };
    }
    monthsData[currentMonth].income.push({ amount, description });
    renderIncome();  // Re-render after adding new income
    updateTotals();  // Update totals
}


// Show the add income modal
btnIncomeNew.addEventListener('click', () => {
    incomeClearModalInputs(addIncomeModal);
    addIncomeModal.style.display = 'block';
});


// Handle saving the edited income
editIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const index = editIncomeBtn.getAttribute('data-index');
    const monthData = monthsData[currentMonth];

    // Update the income with edited values
    monthData.income[index].description = document.getElementById('incomeTitleEdit').value;
    monthData.income[index].amount = document.getElementById('incomeAmountEdit').value;

    console.log('Updated income:', monthData.income[index]);  // Debugging

    renderIncome();  // Re-render income after editing
    editIncomeModal.style.display = 'none';
});


// Clear modal input fields
function incomeClearModalInputs(modal) {
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
}

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
        console.log("Income modal closed");
    } else {
        errorMessage.textContent = 'Please check your input values.';
        errorMessage.style.display = 'block';
    }
});
