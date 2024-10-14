export let categories = [];
export let expenses = [];
export let monthsData = {};
export let currentMonth = 'October 2024';
export const salary = document.querySelector('.salary');

const closeModalButtons = document.querySelectorAll('.close');  

// Function to update the current month
export function setCurrentMonth(currentMonth) {
    const showCurrentMonth = document.querySelector('#currentMonth');
    showCurrentMonth.innerHTML = currentMonth;
}

// Function to render both income and expense data for a selected month
export function renderDataForMonth(month) {
    const monthData = monthsData[month] || { income: [], expenses: [] };

    renderIncome();

    renderExpense(monthData);
}

// Logic to switch between months (next/prev)
function changeMonth(direction) {
    const months = ['January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024', 
                    'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'];
    let currentIndex = months.indexOf(currentMonth);
    
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % months.length;
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + months.length) % months.length;
    }
    
    currentMonth = months[currentIndex];
    setCurrentMonth(currentMonth);
    renderDataForMonth(currentMonth); // Render data when month changes
}

document.querySelector('.material-icons.left').addEventListener('click', () => changeMonth('prev'));
document.querySelector('.material-icons.right').addEventListener('click', () => changeMonth('next'));

document.addEventListener('DOMContentLoaded', () => {
    setCurrentMonth(currentMonth);
    renderDataForMonth(currentMonth); // Initial render for the default month
});

// Close X button
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        
        if (modal) {
            modal.style.display = 'none';  // Close the modal dynamically
            console.log(`${modal.id} closed`);

            //clearModalInputs(modal);
        }
    });
});

// Close the modal when clicking outside the modal
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        console.log(`${e.target.id} closed`);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    setCurrentMonth(currentMonth);
});


///////////////////////////////////////////////////////////////expense
// Function to render income for the current month (new and existing)
export function renderIncome() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };
    salary.innerHTML = '';  // Clear previous income list

    console.log('Rendering income for the current month:', monthData.income); // Debugging

    // Standardize rendering for old and new income data
    monthData.income.forEach((income, index) => {
        console.log(`Rendering income at index ${index}:`, income);  // Debugging

        // Create income element container
        const incomeElement = document.createElement('div');
        incomeElement.classList.add('income-list');

        // Create a single p tag for description and amount
        const incomeText = document.createElement('p');
        incomeText.textContent = `${income.description} - $${income.amount}`;  // Standardized format
        incomeText.dataset.index = index;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('income-del');
        deleteButton.dataset.index = index;

        // Append the text and button to the income element
        incomeElement.appendChild(incomeText);
        incomeElement.appendChild(deleteButton);

        // Append the income element to the salary container
        salary.appendChild(incomeElement);
    });

    // Reattach event listeners after rendering for each p tag
    document.querySelectorAll('.salary p').forEach(p => {
        p.addEventListener('click', (e) => {
            const index = Number(e.target.dataset.index);
            console.log('Income edit clicked at index:', index);  // Debugging
            IncomeHandleEdit(index);
        });
    });

    // Reattach event listeners after rendering for each delete button
    document.querySelectorAll('.income-del').forEach(button => {
        button.addEventListener('click', incomeHandleDelete);
    });
}

// Function to handle income editing
export function IncomeHandleEdit(index) {
    const monthData = monthsData[currentMonth];
    console.log('Editing income:', monthData.income[index]);  // Debugging
    document.getElementById('incomeTitleEdit').value = monthData.income[index].description;
    document.getElementById('incomeAmountEdit').value = monthData.income[index].amount;
    editIncomeModal.style.display = 'block';
    editIncomeBtn.setAttribute('data-index', index);
}

// Handle income deletion
function incomeHandleDelete(e) {
    const index = e.target.dataset.index;
    console.log('Deleting income at index:', index);  // Debugging
    monthsData[currentMonth].income.splice(index, 1);  // Remove from monthly data
    renderIncome();  // Re-render after deletion
}




///////////////////////////////////////////////////////expense
export function renderExpense() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };
    const expensesContainer = document.querySelector('.expence-wrap');
    expensesContainer.innerHTML = ''; // Clear previous expenses

    // Render each expense
    monthData.expenses.forEach((expense, index) => {
        const expenseItem = `
            <div class="category-expense" data-index="${index}">
                <p data-index="${index}">${expense.category} ${expense.description}</p>
                <p class="color-expense">${expense.amount}</p>
                <p>${expense.date}</p>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>`;
        expensesContainer.innerHTML += expenseItem;
    });

    // Attach event listeners to the entire expense container (not just p tags)
    document.querySelectorAll('.category-expense').forEach(expenseElement => {
        expenseElement.addEventListener('click', (e) => {
            const index = Number(expenseElement.dataset.index);
            console.log('Clicked expense with index:', index);  // Debugging
            handleEdit(index); // Handle editing an expense
        });
    });

    // Attach event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the edit function when clicking delete
            handleDelete(e); // Handle deleting an expense
        });
    });
}

// Delete expense function
function handleDelete(e) {
    const index = e.target.dataset.index;
    monthsData[currentMonth].expenses.splice(index, 1);  // Remove the expense from the array
    renderExpense();  // Re-render the updated expense list
}

function handleEdit(index) {
    const monthData = monthsData[currentMonth];
    const expense = monthData.expenses[index];

    // Select the edit button
    const editExpenseBtn = document.getElementById('editExpenseBtn');

    // Populate category options in the dropdown
    renderCategoryOptionsForEdit();

    // Find the category in the dropdown
    const selectedCategoryIndex = categories.findIndex(cat => `${cat.symbol} ${cat.title}` === expense.category);
    if (selectedCategoryIndex === -1) {
        console.error('Category not found for this expense:', expense.category);
        return;
    }

    // Populate the modal with the existing expense data
    document.getElementById('expenseCategoryEdit').value = selectedCategoryIndex;
    document.getElementById('expenseDescriptionEdit').value = expense.description;
    document.getElementById('expensePriceEdit').value = expense.amount;
    document.getElementById('expenseDateEdit').value = expense.date;

    // Show the modal
    document.getElementById('editExpenseModal').style.display = 'block';

    // Remove previous event listener to prevent stacking
    editExpenseBtn.removeEventListener('click', handleSaveExpense);

    // Define the event listener for saving the edited expense
    function handleSaveExpense(e) {
        e.preventDefault();

        const newCategoryIndex = document.getElementById('expenseCategoryEdit').value;
        const newCategory = categories[newCategoryIndex];
        const expenseDescription = document.getElementById('expenseDescriptionEdit').value;
        const expensePrice = document.getElementById('expensePriceEdit').value;
        const expenseDate = document.getElementById('expenseDateEdit').value;

        if (newCategory && expenseDescription && expensePrice && expenseDate) {
            // Update the expense with new values
            monthData.expenses[index] = {
                category: `${newCategory.symbol} ${newCategory.title}`,
                description: expenseDescription,
                amount: expensePrice,
                date: expenseDate
            };

            // Re-render the updated list of expenses
            renderExpense();
            document.getElementById('editExpenseModal').style.display = 'none'; // Close modal
        } else {
            alert('Please fill in all fields.');
        }
    }

    // Attach the event listener for saving
    editExpenseBtn.addEventListener('click', handleSaveExpense);
}

function renderCategoryOptionsForEdit() {
    const categorySelect = document.getElementById('expenseCategoryEdit');
    categorySelect.innerHTML = ''; // Clear previous options

    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index;  // Use the index as the value
        option.textContent = `${category.symbol} ${category.title}`;  // Display symbol and title
        categorySelect.appendChild(option);
    });
}