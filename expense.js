import { categories, currentMonth, renderBudgetTracking, updateTotals, updateExpenseChart, monthsData, renderExpense, renderDataForMonth, saveToLocalStorage, loadFromLocalStorage } from './script.js';

const addExpenseModal = document.getElementById('addExpenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const saveExpenseBtn = document.getElementById('saveExpenseBtn');

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();  
    renderDataForMonth(currentMonth);  
});


function addExpense(categoryTitle, amount, description, date) {
    if (!monthsData[currentMonth]) {
        monthsData[currentMonth] = { income: [], expenses: [] };
    }

    const newExpense = {
        category: categoryTitle,
        amount: amount,
        description: description,
        date: date
    };

    monthsData[currentMonth].expenses.unshift(newExpense);
    saveToLocalStorage();

    renderExpense();  
    updateTotals();    
    updateExpenseChart();  
    renderBudgetTracking();  
}


// Populate categories in the dropdown
function renderCategoryOptions() {
    const categorySelect = document.getElementById('expenseCategory');
    categorySelect.innerHTML = ''; 

    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${category.symbol} ${category.title}`; 
        categorySelect.appendChild(option);
    });
}

// Show the add expense modal
addExpenseBtn.addEventListener('click', () => {
    const exerrorMessage = document.getElementById('exerrorMessage');

    renderCategoryOptions();
    document.getElementById('expenseDescriptionInput').value = ''; // Clear previous inputs
    document.getElementById('expensePriceInput').value = '';
    document.getElementById('expenseDateInput').value = getTodayDate();
    
    exerrorMessage.style.display = 'none';
    exerrorMessage.textContent = '';
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
    const exerrorMessage = document.getElementById('exerrorMessage'); 

    if (selectedCategory && expenseDescription && expensePrice && expenseDate) {
        addExpense(`${selectedCategory.symbol} ${selectedCategory.title}`, expensePrice, expenseDescription, expenseDate);
        addExpenseModal.style.display = 'none'; // Close modal
    } else {
        exerrorMessage.textContent = 'Please fill all fields before saving.';  
        exerrorMessage.style.color = 'red'; 
        exerrorMessage.style.display = 'block';  
        return;  
    }
});

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading 0 if needed
    const day = String(today.getDate()).padStart(2, '0'); // Add leading 0 if needed
    return `${year}-${month}-${day}`; // Return in 'YYYY-MM-DD' format
}

