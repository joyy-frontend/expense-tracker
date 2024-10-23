import { categories, renderBudgetTracking, monthsData, saveToLocalStorage, saveCategoriesToLocalStorage, loadCategoriesFromLocalStorage } from './script.js';

let editingIndex = -1;
const categoriesContainer = document.querySelector('.categories');
const newCategoryBtn = document.getElementById('newCategoryBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const editCategoryModal = document.getElementById('editCategoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const editCategoryBtn = document.getElementById('editCategoryBtn');
let emojiPickerInitialized = false;

// Load categories from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesFromLocalStorage();
    renderCategories(); 
});

newCategoryBtn.addEventListener('click', () => {
    clearModalInputs();
    addCategoryModal.style.display = 'block';
    editingIndex = -1;

    if (!emojiPickerInitialized) {
        emojiPicker('addEmojiPicker', 'categorySymbol');
        emojiPickerInitialized = true;  
    }
});

// Add event listener for Save Button (Handle both new and editing case)
saveCategoryBtn.addEventListener('click', handleSaveOrEdit);

function handleSaveOrEdit(e) {
    e.preventDefault();  // Prevent form submission

    const categorySymbol = document.getElementById('categorySymbol').value;
    const categoryTitle = document.getElementById('categoryTitleInput').value;
    const categoryDescription = document.getElementById('categoryDescriptionInput').value;
    const categoryBudget = document.getElementById('categoryBudgetInput').value; // Get the budget

    if (categorySymbol && categoryTitle && categoryDescription && categoryBudget) {
        if (editingIndex === -1) {
            categories.unshift({ 
                symbol: categorySymbol, 
                title: categoryTitle, 
                description: categoryDescription,
                budget: parseFloat(categoryBudget)  // Include budget
            });
        } else {
            categories[editingIndex] = { 
                symbol: categorySymbol, 
                title: categoryTitle, 
                description: categoryDescription,
                budget: parseFloat(categoryBudget)  // Include budget
            };
            editingIndex = -1;  // Reset after editing
        }

        saveCategoriesToLocalStorage();
        renderCategories();
        renderBudgetTracking();

        addCategoryModal.style.display = 'none';
    } else {
        alert('Please fill in all fields including the budget.');
    }
}

// Function to clear modal inputs
function clearModalInputs() {
    document.getElementById('categorySymbol').value = '';
    document.getElementById('categoryTitleInput').value = '';
    document.getElementById('categoryDescriptionInput').value = '';
    document.getElementById('categoryBudgetInput').value = '';
}

function renderCategories() {
    categoriesContainer.innerHTML = '';  // Clear previous list

    categories.forEach((category, index) => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');
        categoryElement.innerHTML = `
            <p data-index="${index}">${category.symbol} ${category.title}</p><p data-index="${index}">$${category.budget}</p>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;//haruka added <p></p> between title and amount to make spaces

        categoriesContainer.appendChild(categoryElement);
    });

    document.querySelectorAll('.category-item p').forEach(p => {
        p.addEventListener('click', (e) => {
            const index = Number(e.target.dataset.index); // Convert to a number
            handleEdit(index);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

// Delete Button Functionality
function handleDelete(e) {
    const index = e.target.dataset.index;
    const categoryToDelete = categories[index].title;  // Get the title of the category to delete

    // Check if the category has associated expenses in any month
    let hasExpenses = false;

    // Loop through each month to check for expenses
    Object.keys(monthsData).forEach(month => {
        const monthData = monthsData[month];
        if (monthData.expenses) {
            // Check if any expense belongs to the category we're trying to delete
            if (monthData.expenses.some(expense => expense.category.includes(categoryToDelete))) {
                hasExpenses = true;
            }
        }
    });

    // If expenses are found, ask for confirmation to delete the category and associated expenses
    if (hasExpenses) {
        const confirmDelete = confirm(`The "${categoryToDelete}" category has associated expenses. Do you want to delete the category and all related expenses?`);
        if (confirmDelete) {
            // If user confirms, delete both the category and the expenses
            Object.keys(monthsData).forEach(month => {
                const monthData = monthsData[month];
                if (monthData.expenses) {
                    // Filter out expenses that belong to the category to delete
                    monthData.expenses = monthData.expenses.filter(expense => !expense.category.includes(categoryToDelete));
                }
            });
            // Proceed to delete the category
            categories.splice(index, 1); 
            renderCategories();  
            renderExpense(); 
            renderBudgetTracking();  
            updateTotals(); 
            saveToLocalStorage(); 
            saveCategoriesToLocalStorage(); 
        }
    } else {
        categories.splice(index, 1);
        renderCategories(); 
        renderBudgetTracking(); 
        saveToLocalStorage(); 
        saveCategoriesToLocalStorage(); 
    }
}

function handleEdit(index) {
    editingIndex = index;
    document.getElementById('categorySymbolEdit').value = categories[index].symbol;
    document.getElementById('categoryTitleEdit').value = categories[index].title;
    document.getElementById('categoryDescriptionEdit').value = categories[index].description;
    document.getElementById('categoryBudgetEdit').value = categories[index].budget; // Pre-fill budget

    editCategoryModal.style.display = 'block';

    if (!emojiPickerInitialized) {
        emojiPicker('editEmojiPicker', 'categorySymbolEdit');  // Initialize emoji picker for the edit modal
        emojiPickerInitialized = true;  // Ensure we only initialize once
    }
    
    editCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (editingIndex !== -1) {
            // Update the category in the array using the index
            categories[editingIndex].symbol = document.getElementById('categorySymbolEdit').value;
            categories[editingIndex].title = document.getElementById('categoryTitleEdit').value;
            categories[editingIndex].description = document.getElementById('categoryDescriptionEdit').value;
            categories[editingIndex].budget = parseFloat(document.getElementById('categoryBudgetEdit').value); // Update budget

            saveCategoriesToLocalStorage();
            renderCategories();
            renderBudgetTracking(); 

            editCategoryModal.style.display = 'none';
            editingIndex = -1; // Reset the editing index
        }
    });
}

// Function for initializing the emoji picker only once
function emojiPicker(pickerId, inputId) {
    const picker = document.getElementById(pickerId);
    const input = document.getElementById(inputId);

    if (picker) {
        picker.addEventListener('emoji-click', (event) => {
            if (event.detail && event.detail.unicode) {
                const selectedEmoji = event.detail.unicode;
                input.value += selectedEmoji;
            }
        });
    } else {
        console.error('Emoji picker element not found!');
    }
}
