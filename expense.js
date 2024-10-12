import { categories, monthsData, renderDataForMonth } from './script.js';

const addExpenseModal = document.getElementById('addExpenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const saveExpenseBtn = document.getElementById('saveExpenseBtn');


function addExpense(category, amount, description, date) {
    if (!monthsData[currentMonth]) {
        monthsData[currentMonth] = { income: [], expenses: [] };
    }
    
    monthsData[currentMonth].expenses.push({ category, amount, description, date });
    renderDataForMonth(currentMonth);
}

function renderCategoryOptions() {
    const categorySelect = document.getElementById('expenseCategory');
    categorySelect.innerHTML = ''; // Clear previous options

    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index;  // Store the index of the category
        option.textContent = `${category.symbol} ${category.title}`; // Show symbol and title in the dropdown
        categorySelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addExpenseBtn.addEventListener('click', () => {
        renderCategoryOptions(); // Populate categories
        addExpenseModal.style.display = 'block'; // Show modal
    });

    // Add event listener for Expense Save Button////////////////////////////////////////////////////////////
    saveExpenseBtn.addEventListener('click', handleSaveOrEditExpense);
    function handleSaveOrEditExpense(e){
        e.preventDefault();
        
        // Get the selected category's index
        const selectedCategoryIndex = document.getElementById('expenseCategory').value;
        
        // Retrieve the selected category from the categories array
        const selectedCategory = categories[selectedCategoryIndex];

        const expenseDescription = document.getElementById('expenseDescriptionInput').value;
        const expensePrice = document.getElementById('expensePriceInput').value;
        const expenseDate = document.getElementById('expenseDateInput').value;

        // Check if all fields are filled
        if (selectedCategory && expenseDescription && !isNaN(expensePrice) && expenseDate) {
            // Add the expense with both the symbol and title
            addExpense(`${selectedCategory.symbol} ${selectedCategory.title}`, expensePrice, expenseDescription, expenseDate);
            
            // Close the modal
            addExpenseModal.style.display = 'none';

            // Clear input fields
            clearExpenseInputs();
        } else {
            alert('Please fill in all fields');
        }
    }
    //clear inputted fileds
    function clearExpenseInputs() {
        document.getElementById('expenseDescriptionInput').value = '';
        document.getElementById('expensePriceInput').value = '';
        document.getElementById('expenseDateInput').value = '';
    }
    //////////////////////////////////
});


//chart js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Expenses',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
        }]
    },
});