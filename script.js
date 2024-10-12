export let categories = [];
export let monthsData = {};
export let currentMonth = 'October 2024';

const closeModalButtons = document.querySelectorAll('.close');  

// Function to update the current month
export function setCurrentMonth(currentMonth) {
    const showCurrentMonth = document.querySelector('#currentMonth');
    showCurrentMonth.innerHTML = currentMonth;
}

function changeMonth(direction) {
    console.log("clicked");
    
    const months = [
        'January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024', 'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024', 'January 2025'
    ];
    let currentIndex = months.indexOf(currentMonth);
    
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % months.length;
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + months.length) % months.length;
    }
    
    currentMonth = months[currentIndex];
    setCurrentMonth(currentMonth);

    renderDataForMonth(currentMonth);
}

document.querySelector('.material-icons.left').addEventListener('click', () => changeMonth('prev'));
document.querySelector('.material-icons.right').addEventListener('click', () => changeMonth('next'));


export function renderDataForMonth(month) {
    const monthData = monthsData[month] || { income: [], expenses: [] };
    
    // Render income
    const incomeContainer = document.querySelector('.salary');
    incomeContainer.innerHTML = '';
    monthData.income.forEach(income => {
        const incomeItem = `<div class="salary"><p>${income.description}</p><p>${income.amount}</p></div>`;
        incomeContainer.innerHTML += incomeItem;
    });
    
    // Render expenses
    const expensesContainer = document.querySelector('.expence-wrap');
    expensesContainer.innerHTML = '';
    monthData.expenses.forEach(expense => {
        const expenseItem = `<div class="category-expence">
                                <p>${expense.category}</p>
                                <p>${expense.description}</p>
                                <p class="color-expence">-${expense.amount}</p>
                                <p>${expense.date}</p>
                             </div>`;
        expensesContainer.innerHTML += expenseItem;
    });
}

// Close X button
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        
        if (modal) {
            modal.style.display = 'none';  // Close the modal dynamically
            console.log(`${modal.id} closed`);

            clearModalInputs(modal);
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



