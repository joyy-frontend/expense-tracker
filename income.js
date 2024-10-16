import { currentMonth, monthsData, updateTotals, renderIncome, renderBudgetTracking } from './script.js';

const btnIncomeNew = document.getElementById("btnIncomeNew");
const addIncomeModal = document.getElementById('addIncomeModal');
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const errorMessage = document.getElementById('errorMessage');
const editIncomeModal = document.getElementById('editIncomeModal');
const editIncomeBtn = document.getElementById('editIncomeBtn');
const closeModalButtons = document.querySelectorAll('.close');

// Ensure modal inputs are cleared when opened
function incomeClearModalInputs(modal) {
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';  // Clear the input value
    });
}

// Open New Income Modal
btnIncomeNew.addEventListener('click', () => {
    incomeClearModalInputs(addIncomeModal);  // Clear inputs before showing the modal
    addIncomeModal.style.display = 'block';  // Show the modal
    errorMessage.style.display = 'none';  // Hide error message
});

// Save New Income
saveIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const incomeTitleInput = document.getElementById('incomeTitleInput');
    const incomeAmountInput = document.getElementById('incomeAmountInput');

    if (incomeTitleInput.value.trim() !== '' && incomeAmountInput.value.trim() !== '') {
        errorMessage.style.display = 'none';
        addIncome(incomeAmountInput.value, incomeTitleInput.value);  // Add new income
        renderIncome();  // Re-render income
        addIncomeModal.style.display = 'none';  // Close modal
    } else {
        errorMessage.textContent = 'Please fill in both fields.';
        errorMessage.style.display = 'block';
    }
});

// Open Edit Income Modal
function IncomeHandleEdit(index) {
    const monthData = monthsData[currentMonth];

    incomeClearModalInputs(editIncomeModal);  // Clear the modal inputs before editing
    errorMessage.style.display = 'none';  // Hide error message

    // Populate the modal with existing income data
    document.getElementById('incomeTitleEdit').value = monthData.income[index].description;
    document.getElementById('incomeAmountEdit').value = monthData.income[index].amount;
    editIncomeModal.style.display = 'block';  // Show the modal
    editIncomeBtn.setAttribute('data-index', index);
}

// Save Edited Income
editIncomeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const index = editIncomeBtn.getAttribute('data-index');  // Get the index to edit
    const incomeTitleEdit = document.getElementById('incomeTitleEdit').value.trim();
    const incomeAmountEdit = document.getElementById('incomeAmountEdit').value.trim();
    const errorMessageEdit = document.getElementById('errorMessageEdit');
    document.querySelector('#errorMessageEdit').style.display = 'none';
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTt");

    if (incomeTitleEdit === '' || incomeAmountEdit === '') {
        errorMessageEdit.textContent = 'Please fill in both fields.';
        errorMessageEdit.style.display = 'block';
        return;
    }

    const monthData = monthsData[currentMonth];
    monthData.income[index].description = incomeTitleEdit;
    monthData.income[index].amount = incomeAmountEdit;

    renderIncome();  // Re-render income after editing
    editIncomeModal.style.display = 'none';  // Close modal
    updateTotals();  // Update totals after editing
    renderBudgetTracking();  // Recalculate and update budget tracking
});

// Close the modal and clear inputs
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';  // Close the modal dynamically
            incomeClearModalInputs(modal);  // Clear modal inputs
            console.log(`${modal.id} closed and inputs cleared.`);
        }
    });
});

// Close the modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        incomeClearModalInputs(e.target);  // Clear modal inputs
        console.log(`${e.target.id} closed and inputs cleared.`);
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
