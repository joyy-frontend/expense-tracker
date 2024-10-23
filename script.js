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
        const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
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
    
    renderDataForMonth(currentMonth); 
    updateTotals();       
    updateExpenseChart();  
    renderBudgetTracking(); 
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
}

export function loadFromLocalStorage() {
    const storedMonthsData = localStorage.getItem('monthsData');
    const storedCategories = localStorage.getItem('categories');
    
    if (storedMonthsData) {
        try {
            monthsData = JSON.parse(storedMonthsData);  
        } catch (e) {
            console.error("Error parsing monthsData from localStorage", e);
        }
    } else {
        monthsData = {};  
    }

    if (storedCategories) {
        try {
            categories = JSON.parse(storedCategories);  
        } catch (e) {
            console.error("Error parsing categories from localStorage", e);
        }
    } else {
        categories = [];  
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
        categories = JSON.parse(storedCategories); 
    } else {
        categories = []; 
    }
}


//////////////////////////////// bring month data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setCurrentMonth(currentMonth);
    renderDataForMonth(currentMonth); 
    loadCategoriesFromLocalStorage();
    renderCategories();
});



//////////////////////////////// Close X button, Close the modal when clicking outside the modal
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        
        if (modal) {
            modal.style.display = 'none';  
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});



///////////////////////////////////////////////////////////////income
export function renderIncome() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };
    salary.innerHTML = '';  // Clear previous income list
    
    // Standardize rendering for old and new income data
    monthData.income.forEach((income, index) => {
        const incomeElement = document.createElement('div');
        incomeElement.classList.add('income-first-container');  
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
            const index = incomeDiv.querySelector('.income-title').dataset.index;
            
            IncomeHandleEdit(index);
        });
    });

    document.querySelectorAll('.income-del').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();  
            incomeHandleDelete(e); 
        });
    });

    updateTotals();    
    renderBudgetTracking(); 
}


// Function to handle income editing
function IncomeHandleEdit(index) { 
    const monthData = monthsData[currentMonth];
    
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

    renderIncome();  
    updateTotals();    
    renderBudgetTracking();  
}




///////////////////////////////////////////////////////expense
export function renderExpense() { 
    const storedMonthsData = localStorage.getItem('monthsData'); 

    if (!storedMonthsData) {
        console.error("No data found in localStorage for 'monthsData'");
        return;
    }

    const monthData = JSON.parse(storedMonthsData)[currentMonth] || { income: [], expenses: [] }; 
    const expensesContainer = document.querySelector('.expense-wrap');
    expensesContainer.innerHTML = ''; 
    const chartContainer = document.querySelector('.expense-chart');
    
    if (monthData.expenses.length > 0) {
        expensesContainer.style.height = 'auto'; 
        expensesContainer.style.overflow = 'visible';
        chartContainer.style.display = 'block';
    } else {
        expensesContainer.style.overflow = 'hidden';
        chartContainer.style.display = 'none';
    }

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

    document.querySelectorAll('.category-expense').forEach(expenseElement => {
        expenseElement.addEventListener('click', (e) => {
            const index = Number(expenseElement.dataset.index);
            handleEdit(index); // Handle editing an expense
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            handleDelete(e);
        });
    });

    saveToLocalStorage();
    updateExpenseChart();
    showHideExpense();
}

function handleDelete(e) {
    const index = e.target.dataset.index;
    monthsData[currentMonth].expenses.splice(index, 1); 

    const storedMonthsData = JSON.parse(localStorage.getItem('monthsData')) || {};
    if (storedMonthsData[currentMonth] && storedMonthsData[currentMonth].expenses) {
        storedMonthsData[currentMonth].expenses.splice(index, 1);
        localStorage.setItem('monthsData', JSON.stringify(storedMonthsData));  
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
    
    const editExpenseBtn = document.getElementById('editExpenseBtn');

    renderCategoryOptionsForEdit();

    const selectedCategoryIndex = categories.findIndex(cat => `${cat.symbol} ${cat.title}` === expense.category);
    if (selectedCategoryIndex === -1) {
        console.error('Category not found for this expense:', expense.category);
        return;
    }

    document.getElementById('expenseCategoryEdit').value = selectedCategoryIndex;
    document.getElementById('expenseDescriptionEdit').value = expense.description;
    document.getElementById('expensePriceEdit').value = expense.amount;
    document.getElementById('expenseDateEdit').value = expense.date;
    exerrorMessageEdit.style.display = 'none';
    exerrorMessageEdit.textContent = '';
    document.getElementById('editExpenseModal').style.display = 'block';

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

    if (newCategory && expenseDescription && expensePrice && expenseDate) {
        monthData.expenses[index] = {
            category: `${newCategory.symbol} ${newCategory.title}`,
            description: expenseDescription,
            amount: expensePrice,
            date: expenseDate
        };

        saveToLocalStorage();
        renderExpense();
        document.getElementById('editExpenseModal').style.display = 'none';

        updateTotals();  
        updateExpenseChart();  
        renderBudgetTracking();  
    } else {
        exerrorMessageEdit.style.display = 'block'; 
        exerrorMessageEdit.textContent = 'Please fill all fields before saving.';  
        exerrorMessageEdit.style.color = 'red'; 
    }
}



function renderCategoryOptionsForEdit() {
    const categorySelect = document.getElementById('expenseCategoryEdit');
    categorySelect.innerHTML = '';

    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index;  
        option.textContent = `${category.symbol} ${category.title}`; 
        categorySelect.appendChild(option);
    });
}

export function updateTotals() {
    const storedMonthsData = localStorage.getItem('monthsData'); 

    if (!storedMonthsData) {
        console.error("No data found in localStorage for 'monthsData'");
        return;
    }

    const monthData = JSON.parse(storedMonthsData)[currentMonth] || { income: [], expenses: [] }; 
    const totalIncome = monthData.income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    const totalExpenses = monthData.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const totalBalance = totalIncome - totalExpenses;

    document.querySelector('.summary-container h2').textContent = `$${totalBalance.toFixed(2)}`; 
    document.querySelector('.summary-income p:last-child').textContent = `$${totalIncome.toFixed(2)}`; 
    document.querySelector('.summary-expense p:last-child').textContent = `$${totalExpenses.toFixed(2)}`; 
}


////////////////////////////////////////////////chart.js
export function updateExpenseChart() {
    const storedMonthsData = localStorage.getItem('monthsData');

    if (!storedMonthsData) {
        console.error("No data found in localStorage for 'monthsData'");
        return;
    }

    const monthData = JSON.parse(storedMonthsData)[currentMonth] || { income: [], expenses: [] }; 
    const categoryTotals = {};
    
    monthData.expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += parseFloat(expense.amount);
        } else {
            categoryTotals[expense.category] = parseFloat(expense.amount);
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (window.myExpenseChart) {
        window.myExpenseChart.data.labels = labels;
        window.myExpenseChart.data.datasets[0].data = data;
        window.myExpenseChart.update();
    } else {
        const ctx = document.getElementById('myChart').getContext('2d');
        window.myExpenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Expenses',
                    data: data,
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

    if (!Array.isArray(categories)) {
        console.error("Categories is not an array. Value of categories:", categories);
        return {};  // Return an empty object if categories is invalid
    }

    const categoryTotals = {};

    categories.forEach(category => {
        categoryTotals[category.title.trim()] = 0;
    });

    monthData.expenses.forEach(expense => {
        const expenseCategoryTitle = expense.category.split(' ').slice(1).join(' ').trim();  // Remove emoji, match only the title

        if (categoryTotals[expenseCategoryTitle] !== undefined) {
            categoryTotals[expenseCategoryTitle] += parseFloat(expense.amount);
        } else {
            console.warn(`Category "${expenseCategoryTitle}" not found in categories`);
        }
    });

    return categoryTotals;
}



export function renderBudgetTracking() {
    const monthData = monthsData[currentMonth] || { income: [], expenses: [] };
    const categoryTotals = calculateCategoryExpenses();  
    const budgetContainer = document.querySelector('.budget-tracking-container');
    budgetContainer.innerHTML = '';  

    categories.forEach(category => {
        const totalSpent = categoryTotals[category.title] || 0;
        const percentage = Math.min((totalSpent / category.budget) * 100, 100);  
        let barColor = '#a7b6f7';  // blue

        if (totalSpent >= category.budget) {
            barColor = '#f35288'
            if (!category.alertShown) {
                alert(`⛔️ You have exceeded or reached your budget for ${category.title}!`);
                category.alertShown = true;  // Mark the alert as shown
            }
        } else {
            category.alertShown = false;
        }

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

updateText();

window.addEventListener('resize', updateText);


//// show more and show less button
const displayBtn = document.getElementById('displayBtn');
const expenseWrap = document.querySelector('.expense-wrap');

function btnChecker() {
    const expenseItemsRow = document.querySelectorAll('.category-expense');

  if (expenseItemsRow.length < 4) {
    displayBtn.style.display = 'none';
    return; // exit
} 

// data-index has more than 4, show button
displayBtn.style.display = 'block';
}

// display/hide items
function showHideExpense() {
    const expenseItemsRow = document.querySelectorAll('.category-expense');
    
    expenseItemsRow.forEach(expense => {
        const index = Number(expense.getAttribute('data-index'));
        let hiddenYes = false; // checklist whether it has hidden items or not

        if (index > 2 && displayBtn.textContent === 'Show More') {
            expense.style.height = '0';
            expense.style.margin = '0';
            expense.style.padding = '0';
            expense.style.visibility = 'hidden';
            hiddenYes = true; // checkmark to hidden item
        } else {
            expense.style.height = 'auto';
            expense.style.margin = '';
            expense.style.padding = '';
            expense.style.visibility = 'visible';
        }
    });
    
}

// to observe changes of numbers of element
const observer = new MutationObserver(() => {//actions to do
    btnChecker();
    showHideExpense();
});

// what to observe
observer.observe(expenseWrap, { childList: true, subtree: true });

// element show/hide by click
displayBtn.addEventListener('click', () => {
    const expenseItemsRow = document.querySelectorAll('.category-expense');

    if (displayBtn.textContent === 'Show More') {
        expenseItemsRow.forEach(expense => {
            expense.style.height = 'auto';
            expense.style.margin = '';
            expense.style.padding = '';
            expense.style.visibility = 'visible';
        });
        displayBtn.textContent = 'Show Less';
    } else {
        expenseItemsRow.forEach(expense => {
            const index = Number(expense.getAttribute('data-index'));
            if (index > 2) {
                expense.style.height = '0';
                expense.style.margin = '0';
                expense.style.padding = '0';
                expense.style.visibility = 'hidden';
            }
        });
        displayBtn.textContent = 'Show More';
    }
});

// page loaded, take place
btnChecker();
showHideExpense();