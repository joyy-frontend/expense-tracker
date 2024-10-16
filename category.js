
import { categories, renderBudgetTracking } from './script.js';

let editingIndex = -1;
const categoriesContainer = document.querySelector('.categories');
const newCategoryBtn = document.getElementById('newCategoryBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const editCategoryModal = document.getElementById('editCategoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const editCategoryBtn = document.getElementById('editCategoryBtn');
let emojiPickerInitialized = false;

renderCategories();

document.addEventListener('DOMContentLoaded', () => {
    newCategoryBtn.addEventListener('click', () => {
        clearModalInputs();
        addCategoryModal.style.display = 'block';
        editingIndex = -1;

        // Initialize emoji picker if it hasn't been initialized
        if (!emojiPickerInitialized) {
            emojiPicker('addEmojiPicker', 'categorySymbol');
            emojiPickerInitialized = true;  // Ensure we only initialize the picker once
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
                // Add new category with budget to the array
                categories.push({ 
                    symbol: categorySymbol, 
                    title: categoryTitle, 
                    description: categoryDescription,
                    budget: parseFloat(categoryBudget)  // Include budget
                });
            } else {
                // Edit existing category in the array
                categories[editingIndex] = { 
                    symbol: categorySymbol, 
                    title: categoryTitle, 
                    description: categoryDescription,
                    budget: parseFloat(categoryBudget)  // Include budget
                };
                editingIndex = -1;  // Reset after editing
            }
    
            // Render the updated list of categories
            renderCategories();
    
            // Render budget tracking since categories have been updated
            renderBudgetTracking();
    
            // Close the modal after saving
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
    }
});


function renderCategories() {
    categoriesContainer.innerHTML = '';  // Clear previous list

    categories.forEach((category, index) => {
        // Create category element with the budget
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');
        categoryElement.innerHTML = `
            <p data-index="${index}">${category.symbol} ${category.title} $${category.budget}</p>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        // Append the element to the container
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
    categories.splice(index, 1);  // Remove the category from the array
    renderCategories();  // Re-render the categories list
    renderBudgetTracking();
}

function handleEdit(index) {
    editingIndex = index;
    // Pre-fill the edit modal with the category's existing data
    document.getElementById('categorySymbolEdit').value = categories[index].symbol;
    document.getElementById('categoryTitleEdit').value = categories[index].title;
    document.getElementById('categoryDescriptionEdit').value = categories[index].description;
    document.getElementById('categoryBudgetEdit').value = categories[index].budget; // Pre-fill budget

    // Open the modal for editing
    editCategoryModal.style.display = 'block';

    // Initialize the emoji picker for editing if not already initialized
    if (!emojiPickerInitialized) {
        emojiPicker('editEmojiPicker', 'categorySymbolEdit');  // Initialize emoji picker for the edit modal
        emojiPickerInitialized = true;  // Ensure we only initialize once
    }
    
    // Add event listener for save button inside the edit modal
    editCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (editingIndex !== -1) {
            // Update the category in the array using the index
            categories[editingIndex].symbol = document.getElementById('categorySymbolEdit').value;
            categories[editingIndex].title = document.getElementById('categoryTitleEdit').value;
            categories[editingIndex].description = document.getElementById('categoryDescriptionEdit').value;
            categories[editingIndex].budget = parseFloat(document.getElementById('categoryBudgetEdit').value); // Update budget

            // Re-render the updated list of categories
            renderCategories();
            renderBudgetTracking(); // Update budget tracking

            // Close the modal after saving
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