import { categories, currentMonth, monthsData, renderExpense, renderDataForMonth } from './script.js';

const addExpenseModal = document.getElementById('addExpenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const saveExpenseBtn = document.getElementById('saveExpenseBtn');
const expenseContainer = document.querySelector('.category-expence');

function addExpense(category, amount, description, date) {
    if (!monthsData[currentMonth]) {
        monthsData[currentMonth] = { income: [], expenses: [] };
    }
    
    // Check how the expense is being added
    const newExpense = { category, amount, description, date };
    console.log('Adding new expense:', newExpense);
    
    monthsData[currentMonth].expenses.push(newExpense);

    console.log('Updated monthsData:', monthsData);  // Check if category is saved correctly
    renderExpense();  // Re-render after adding new expense
}

// Populate categories in the dropdown
function renderCategoryOptions() {
    const categorySelect = document.getElementById('expenseCategory');
    categorySelect.innerHTML = ''; // Clear previous options

    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${category.symbol} ${category.title}`; // Show symbol and title in the dropdown
        categorySelect.appendChild(option);
    });
}

// Show the add expense modal
addExpenseBtn.addEventListener('click', () => {
    renderCategoryOptions();
    document.getElementById('expenseDescriptionInput').value = ''; // Clear previous inputs
    document.getElementById('expensePriceInput').value = '';
    document.getElementById('expenseDateInput').value = getTodayDate();
    addExpenseModal.style.display = 'block';
});

// Save expense when clicking the save button
saveExpenseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const selectedCategoryIndex = document.getElementById('expenseCategory').value;
    const selectedCategory = categories[selectedCategoryIndex];
    const expenseDescription = document.getElementById('expenseDescriptionInput').value;
    const expensePrice = document.getElementById('expensePriceInput').value;
    const expenseDate = document.getElementById('expenseDateInput').value;

    if (selectedCategory && expenseDescription && expensePrice && expenseDate) {
        addExpense(`${selectedCategory.symbol} ${selectedCategory.title}`, expensePrice, expenseDescription, expenseDate);
        addExpenseModal.style.display = 'none'; // Close modal
    } else {
        alert('Please fill in all fields.');
    }
});

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading 0 if needed
    const day = String(today.getDate()).padStart(2, '0'); // Add leading 0 if needed
    return `${year}-${month}-${day}`; // Return in 'YYYY-MM-DD' format
}