export let categories = JSON.parse(localStorage.getItem('categories')) || [{ symbol: '🏠', title: 'Rent', description: 'Monthly rent', budget: 3000, alertShown: false },
    { symbol: '🛍️', title: 'Shopping', description: 'Clothing and other shopping', budget: 1000, alertShown: false },
    { symbol: '🛒', title: 'Grocery', description: 'Grocery shopping', budget: 500, alertShown: false }];
export let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
export let monthsData = JSON.parse(localStorage.getItem('monthsData')) || {};
const now = new Date(); 
const currentYear = now.getFullYear(); 
const currentMonthIndex = now.getMonth(); 
const months = [];
const editIncomeModal = document.getElementById('editIncomeModal');


////////////////////////////////////////////////// Month part
for (let year = 2024; year <= 2200; year++) {
    for (let month = 0; month < 12; month++) {
        const date = new Date(year, month);
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        months.push(monthName);
    }
}
export let currentMonth = months[currentMonthIndex + (currentYear - 2024) * 12]; // get index.
export const salary = document.querySelector('.salary');
export const closeModalButtons = document.querySelectorAll('.close');  

export function setCurrentMonth(currentMonth) {
    const showCurrentMonth = document.querySelector('#currentMonth');
    showCurrentMonth.innerHTML = currentMonth;
}

function changeMonth(direction) {
    let currentIndex = months.indexOf(currentMonth);
    
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % months.length;
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + months.length) % months.length;
    }
    
    currentMonth = months[currentIndex];
    setCurrentMonth(currentMonth);
    prevBtnDisplay();//haruka added
    
    // Re-render data for the new month
    renderDataForMonth(currentMonth); 
    updateTotals();        // Recalculate and update totals
    updateExpenseChart();   // Update the expense chart for the new month
    renderBudgetTracking(); // Re-render the budget tracking for the new month
}

function prevBtnDisplay(){//haruka added
    const prevButton = document.querySelector('.material-icons.left');
    if (currentMonth == months[0]) {//when displayed month is first
        prevButton.style.color = 'gray';
        prevButton.style.pointerEvents = 'none';//disable prev event
     } else {
    prevButton.style.color = 'black';
    prevButton.style.pointerEvents = 'auto';//able prev event
    }};    
document.querySelector('.material-icons.left').addEventListener('click', () => changeMonth('prev'));
document.querySelector('.material-icons.right').addEventListener('click', () => changeMonth('next'));



/////////////////////////////////////////////////// local storage part
export function saveToLocalStorage() {
    localStorage.setItem('monthsData', JSON.stringify(monthsData));
    localStorage.setItem('categories', JSON.stringify(categories));
    //console.log("Saved monthsData:", localStorage.getItem('monthsData'));  
}

export function loadFromLocalStorage() {
    const storedMonthsData = localStorage.getItem('monthsData');
    const storedCategories = localStorage.getItem('categories');
    
    // Load monthsData from localStorage if available
    if (storedMonthsData) {
        try {
            monthsData = JSON.parse(storedMonthsData);  // Overwrite safely with parsed data
            console.log("monthsData loaded from localStorage:", monthsData);
        } catch (e) {
            console.error("Error parsing monthsData from localStorage", e);
        }
    } else {
        monthsData = {};  // Initialize if localStorage is empty
    }

    // Load categories from localStorage if available
    if (storedCategories) {
        try {
            categories = JSON.parse(storedCategories);  // Overwrite safely with parsed data
            console.log("Categories loaded from localStorage:", categories);
        } catch (e) {
            console.error("Error parsing categories from localStorage", e);
        }
    } else {
        categories = [];  // Initialize as empty array if no data
    }
}


export function renderDataForMonth(month) {
    const monthData = monthsData[month] || { income: [], expenses: [] };

    renderIncome();
    renderExpense(monthData);
}

export function saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

export function loadCategoriesFromLocalStorage() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories); // Load and overwrite current categories
    } else {
        categories = []; // Initialize with an empty array if no data in local storage
    }
}


//////////////////////////////// bring month data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setCurrentMonth(currentMonth);
    renderDataForMonth(currentMonth); // Initial render for the default month
    loadCategoriesFromLocalStorage();
    renderCategories();
});



//////////////////////////////// Close X button, Close the modal when clicking outside the modal
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        
        if (modal) {
            modal.style.display = 'none';  // Close the modal dynamically
            console.log(`${modal.id} closed`);
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        console.log(`${e.target.id} closed`);
    }
});



///////////////////////////////////////////////////////////////income
export function renderIncome() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };
    salary.innerHTML = '';  // Clear previous income list
    
    // Standardize rendering for old and new income data
    monthData.income.forEach((income, index) => {
        // Create income element container
        const incomeElement = document.createElement('div');
        incomeElement.classList.add('income-first-container');  // Ensure class is consistent
        incomeElement.innerHTML = `
            <div class="income-box">
                <p class="income-title" data-index="${index}">${income.description}</p>
                <p class="income-amount" data-index="${index}">$${income.amount}</p>
                <button class="income-del" id="delIncomeBtn" data-index="${index}">Delete</button>
            </div>
        `;
        salary.appendChild(incomeElement);
    });

    document.querySelectorAll('.income-box').forEach(incomeDiv => {
        incomeDiv.addEventListener('click', (e) => {
            // Get the necessary information from the clicked div
            const index = incomeDiv.querySelector('.income-title').dataset.index;
            
            console.log(`Income edit clicked for index: ${index}`);  // Debugging
            IncomeHandleEdit(index);
        });
    });

    // Reattach event listeners for deleting income
    document.querySelectorAll('.income-del').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent the delete button from triggering the edit modal
            incomeHandleDelete(e);  // Call the delete function
        });
    });

    updateTotals();    // Recalculate totals after rendering income
    renderBudgetTracking();  // Update budget tracking
}


// Function to handle income editing
function IncomeHandleEdit(index) { 
    const monthData = monthsData[currentMonth];
    console.log('Editing income:', monthData.income[index]);  // Debugging
    //clearIncomeModalInputs();
    
    editIncomeModal.style.display = 'block';
    document.getElementById('incomeTitleEdit').value = monthData.income[index].description;
    document.getElementById('incomeAmountEdit').value = monthData.income[index].amount;
    document.querySelector('#errorMessageEdit').style.display = 'none';
    editIncomeBtn.setAttribute('data-index', index);
}

function incomeHandleDelete(e) {
    const index = e.target.dataset.index;
    monthsData[currentMonth].income.splice(index, 1);  // Remove from monthly data
    
    let incomeArray = JSON.parse(localStorage.getItem('income')) || [];

    if (index >= 0 && index < incomeArray.length) {
        incomeArray.splice(index, 1);
    }

    localStorage.setItem('income', JSON.stringify(incomeArray));

    renderIncome();  // Re-render after deletion
    updateTotals();    // Recalculate totals
    renderBudgetTracking();  // Recalculate budget tracking
}




///////////////////////////////////////////////////////expense
export function renderExpense() { 
    const storedMonthsData = localStorage.getItem('monthsData'); 

    if (!storedMonthsData) {
        console.error("No data found in localStorage for 'monthsData'");
        return;
    }

    // Parse monthsData and fetch data for the current month
    const monthData = JSON.parse(storedMonthsData)[currentMonth] || { income: [], expenses: [] }; // Parse and access current month's data
    const expensesContainer = document.querySelector('.expense-wrap');
    expensesContainer.innerHTML = ''; // Clear previous expenses
    const chartContainer = document.querySelector('.expense-chart');
    console.log("Rendering expenses for current month:", monthData.expenses);  // This will now show the correct expenses
    
    // If there are any expenses, remove the height restriction
    if (monthData.expenses.length > 0) {
        expensesContainer.style.height = 'auto'; // Allow the container to expand naturally
        expensesContainer.style.overflow = 'visible'; // Show all expenses
        chartContainer.style.display = 'block';
        console.log("if condition");
    } else {
        // If no expenses, keep the default height
        console.log("else condition");
        //expensesContainer.style.height = '143.54px';
        expensesContainer.style.overflow = 'hidden';
        chartContainer.style.display = 'none';
    }

    // Render each expense
    monthData.expenses.forEach((expense, index) => {
        const expenseItem = `
            <div class="category-expense" data-index="${index}">
                <p data-index="${index}">${expense.category} </p><p>${expense.description}</p>
                <p class="color-expense">$${expense.amount}</p>
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

    saveToLocalStorage();
    updateExpenseChart();
    showHideExpense();//added
}

function handleDelete(e) {
    const index = e.target.dataset.index;
    monthsData[currentMonth].expenses.splice(index, 1);  // Remove the expense from the array

    const storedMonthsData = JSON.parse(localStorage.getItem('monthsData')) || {};
    if (storedMonthsData[currentMonth] && storedMonthsData[currentMonth].expenses) {
        storedMonthsData[currentMonth].expenses.splice(index, 1);
        localStorage.setItem('monthsData', JSON.stringify(storedMonthsData));  // Save the updated data
    }

    renderExpense();  
    updateTotals();    
    updateExpenseChart(); 
    renderBudgetTracking();  
    saveToLocalStorage();
}


function handleEdit(index) {
    const monthData = monthsData[currentMonth];
    const expense = monthData.expenses[index];
    const exerrorMessageEdit = document.querySelector('#exerrorMessageEdit');
    
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
    exerrorMessageEdit.style.display = 'none';
    exerrorMessageEdit.textContent = '';
    // Show the modal
    document.getElementById('editExpenseModal').style.display = 'block';

    // Remove any existing event listener for editExpenseBtn before adding a new one
    editExpenseBtn.onclick = function(e) {
        e.preventDefault();
        handleSaveExpense(index);
    };
}

function handleSaveExpense(index) {
    const monthData = monthsData[currentMonth];

    const newCategoryIndex = document.getElementById('expenseCategoryEdit').value;
    const newCategory = categories[newCategoryIndex];
    const expenseDescription = document.getElementById('expenseDescriptionEdit').value;
    const expensePrice = document.getElementById('expensePriceEdit').value;
    const expenseDate = document.getElementById('expenseDateEdit').value;
    const exerrorMessageEdit = document.querySelector('#exerrorMessageEdit');

    // Check if all fields are filled before saving
    if (newCategory && expenseDescription && expensePrice && expenseDate) {
        // Update the expense with new values
        monthData.expenses[index] = {
            category: `${newCategory.symbol} ${newCategory.title}`,
            description: expenseDescription,
            amount: expensePrice,
            date: expenseDate
        };

        saveToLocalStorage();
        renderExpense();
        // Close the edit modal
        document.getElementById('editExpenseModal').style.display = 'none';

        // Update totals and charts after editing
        updateTotals();  // Update totals after editing
        updateExpenseChart();  // Update chart after editing
        renderBudgetTracking();  // Recalculate and update budget tracking
    } else {
        console.log("Validation failed - showing error message");

        // Show error message and make sure it's visible
        exerrorMessageEdit.style.display = 'block'; 
        exerrorMessageEdit.textContent = 'Please fill all fields before saving.';  
        exerrorMessageEdit.style.color = 'red'; 
    }
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

// This function will be used to update the total balance, total income, and total expenses dynamically
export function updateTotals() {
    const storedMonthsData = localStorage.getItem('monthsData'); // Retrieve from localStorage

    if (!storedMonthsData) {
        console.error("No data found in localStorage for 'monthsData'");
        return;
    }

    const monthData = JSON.parse(storedMonthsData)[currentMonth] || { income: [], expenses: [] }; // Parse and access current month's data
    
    // Calculate total income
    const totalIncome = monthData.income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);

    // Calculate total expenses
    const totalExpenses = monthData.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    // Update total balance: income - expenses
    const totalBalance = totalIncome - totalExpenses;

    // Update the UI
    document.querySelector('.summary-container h2').textContent = `$${totalBalance.toFixed(2)}`; 
    document.querySelector('.summary-income p:last-child').textContent = `$${totalIncome.toFixed(2)}`; 
    document.querySelector('.summary-expense p:last-child').textContent = `$${totalExpenses.toFixed(2)}`; 
}


// Function to generate the expenses chart with grouped categories
export function updateExpenseChart() {
    const storedMonthsData = localStorage.getItem('monthsData'); // Retrieve from localStorage

    if (!storedMonthsData) {
        console.error("No data found in localStorage for 'monthsData'");
        return;
    }

    const monthData = JSON.parse(storedMonthsData)[currentMonth] || { income: [], expenses: [] }; // Parse and access current month's data

    // Group expenses by category
    const categoryTotals = {};
    
    monthData.expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += parseFloat(expense.amount);
        } else {
            categoryTotals[expense.category] = parseFloat(expense.amount);
        }
    });

    // Extract labels (categories) and data (totals for each category)
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Check if chart already exists and update it, otherwise create a new chart
    if (window.myExpenseChart) {
        // Update existing chart data
        window.myExpenseChart.data.labels = labels;
        window.myExpenseChart.data.datasets[0].data = data;
        window.myExpenseChart.update();
    } else {
        // Create a new chart
        const ctx = document.getElementById('myChart').getContext('2d');
        window.myExpenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels, // Grouped expense categories
                datasets: [{
                    label: 'Expenses',
                    data: data, // Grouped totals for each category
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
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
}

export function calculateCategoryExpenses() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };

    // Ensure categories is an array
    if (!Array.isArray(categories)) {
        console.error("Categories is not an array. Value of categories:", categories);
        return {};  // Return an empty object if categories is invalid
    }

    // Create a map of categories with their total expenses
    const categoryTotals = {};

    // Initialize each category with 0 spent
    categories.forEach(category => {
        categoryTotals[category.title.trim()] = 0;
    });

    // Sum expenses for each category
    monthData.expenses.forEach(expense => {
        const expenseCategoryTitle = expense.category.split(' ').slice(1).join(' ').trim();  // Remove emoji, match only the title

        if (categoryTotals[expenseCategoryTitle] !== undefined) {
            categoryTotals[expenseCategoryTitle] += parseFloat(expense.amount);
        } else {
            console.warn(`Category "${expenseCategoryTitle}" not found in categories`);
        }
    });

    console.log('Category totals after calculation:', categoryTotals);  // Debugging
    return categoryTotals;
}



export function renderBudgetTracking() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };
    const categoryTotals = calculateCategoryExpenses();  // This calculates based on the current month's data
    const budgetContainer = document.querySelector('.budget-tracking-container');
    budgetContainer.innerHTML = '';  // Clear previous content

    categories.forEach(category => {
        const totalSpent = categoryTotals[category.title] || 0;
        const percentage = Math.min((totalSpent / category.budget) * 100, 100);  // Calculate percentage, cap at 100%
        //let barColor = '#f35288';  // main color
        let barColor = '#a7b6f7';  // blue

        // Check if the total spent exceeds or is equal to the budget
        if (totalSpent >= category.budget) {
            //barColor = 'red';  // Change bar color to red if over the budget
            barColor = '#f35288'
            // Show the alert only if it hasn't been shown before for this category
            if (!category.alertShown) {
                alert(`⛔️ You have exceeded or reached your budget for ${category.title}!`);
                category.alertShown = true;  // Mark the alert as shown
            }
        } else {
            // Reset the alert flag if the total spent goes below the budget again
            category.alertShown = false;
        }

        // Create the budget tracking item with the updated color for the bar
        const budgetItem = `
            <div class="budget-item">
                <span>${category.title}</span>
                <div class="budget-bar">
                    <div class="budget-bar-inner" style="width: ${percentage}%; background-color: ${barColor};"></div>
                </div>
                <span>${totalSpent}/${category.budget}</span>
            </div>
        `;

        budgetContainer.innerHTML += budgetItem;
    });

    saveToLocalStorage();
}

// Function to render categories
export function renderCategories() {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = '';  // Clear previous list

    categories.forEach((category, index) => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');
        categoryElement.innerHTML = `
            <p data-index="${index}">${category.symbol} ${category.title}</p><p>$${category.budget}</p>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        categoriesContainer.appendChild(categoryElement);
    });

    document.querySelectorAll('.category-item p').forEach(p => {
        p.addEventListener('click', (e) => {
            const index = Number(e.target.dataset.index);
            handleEdit(index);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

//haruka added for mobile add botton
const responsiveAddBtnText = document.querySelectorAll('#btnIncomeNew,#addExpenseBtn, #newCategoryBtn');
function updateText() {
const newText = window.innerWidth <= 875 ? "+" : "+New";
responsiveAddBtnText.forEach(btn => {
    btn.textContent = newText;
});
}

//render it
updateText();

// when window resized, render
window.addEventListener('resize', updateText);


//// show more and show less button
const displayBtn = document.getElementById('displayBtn');
function showHideExpense(){
    const expenseItemsRow = document.querySelectorAll('.category-expense');
    let hiddenYes = false;//item to check if elements are hidden
    expenseItemsRow.forEach(expense=>{
        const index = Number(expense.getAttribute('data-index'));//get index-number attribute

        if (index>2){//hide if idx is greater than 2
            expense.style.height = '0';
            expense.style.margin = '0';
            expense.style.padding = 0;
            expense.style.visibility = 'hidden';
            hiddenYes = true;
        }
    });
        
        if (hiddenYes) {//if there are hidden items
            displayBtn.style.display = 'block'; // Show button
            displayBtn.textContent = 'Show More';
        }else{
            displayBtn.style.display = 'none'; // hide button
            displayBtn.textContent = 'Show Less';
        }
};
// Add event listener for displayBtn to toggle hidden expenses
displayBtn.addEventListener('click', () => {
    const expenseItemsRow = document.querySelectorAll('.category-expense');
    
    if(displayBtn.textContent === 'Show More'){
    expenseItemsRow.forEach(expense => {// Show all expenses
        expense.style.height = 'auto'; 
        expense.style.margin = ''; // Reset margin to default
        expense.style.padding = '';
        expense.style.visibility = 'visible';
    });
    displayBtn.textContent = 'Show Less';//change button text
}else{
    expenseItemsRow.forEach(expense => {//hide items
        const index = Number(expense.getAttribute('data-index'));
        if (index > 2) {
            expense.style.height = '0';
            expense.style.margin = '0';
            expense.style.padding = '0';
            expense.style.visibility = 'hidden';
        }});
        displayBtn.textContent = 'Show More';//change button text
}
});
