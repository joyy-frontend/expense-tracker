let categories = [];
let editingIndex = -1;
const categoriesContainer = document.querySelector('.categories');
const newCategoryBtn = document.getElementById('newCategoryBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const editCategoryModal = document.getElementById('editCategoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const editCategoryBtn = document.getElementById('editCategoryBtn');
const closeModalButtons = document.querySelectorAll('.close');  
let emojiPickerInitialized = false;

// Initially render the categories (if any)
renderCategories();

// Function to render categories from array
function renderCategories() {
    categoriesContainer.innerHTML = '';  // Clear previous list

    categories.forEach((category, index) => {
        // Create category element
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');
        categoryElement.innerHTML = `
            <p data-index="${index}">${category.symbol}${category.title}</p>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        // Append the element to the container
        categoriesContainer.appendChild(categoryElement);
    });

    document.querySelectorAll('.category-item p').forEach(p => {
        p.addEventListener('click', (e) => {
            const index = Number(e.target.dataset.index); // Convert to a number
            console.log(`Category clicked: ${categories[index].title}, Index: ${index}`);
            
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
}

function handleEdit(index) {
    // Pre-fill the edit modal with the category's existing data
    document.getElementById('categorySymbolEdit').value = categories[index].symbol;
    document.getElementById('categoryTitleEdit').value = categories[index].title;
    document.getElementById('categoryDescriptionEdit').value = categories[index].description;

    // Open the modal for editing
    editCategoryModal.style.display = 'block';

    // Show the modal when the +New button is clicked
    
    if (!emojiPickerInitialized) {
        emojiPicker('editEmojiPicker', 'categorySymbolEdit');
        emojiPickerInitialized = true;  // Ensure we only initialize the picker once
    }

    // Handle saving the edited category
    editCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Update the category in the array using the index
        categories[index].symbol = document.getElementById('categorySymbolEdit').value;
        categories[index].title = document.getElementById('categoryTitleEdit').value;
        categories[index].description = document.getElementById('categoryDescriptionEdit').value;

        // Re-render the updated list of categories
        renderCategories();

        // Close the modal after saving
        editCategoryModal.style.display = 'none';
    }, { once: true });  // The { once: true } ensures the event listener is only added once
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
    let emojiPickerInitialized = false;
    // Show the modal when the +New button is clicked
    newCategoryBtn.addEventListener('click', () => {
        clearModalInputs();
        if (!emojiPickerInitialized) {
            emojiPicker('addEmojiPicker', 'categorySymbol');
            emojiPickerInitialized = true;  // Ensure we only initialize the picker once
        }
        addCategoryModal.style.display = 'block';
        editingIndex = -1;
    });

    // Add event listener for Save Button (Handle both new and editing case)
    saveCategoryBtn.addEventListener('click', handleSaveOrEdit);

    // Function to handle both saving new and editing existing categories
    function handleSaveOrEdit(e) {
        e.preventDefault();  // Prevent form submission

        const categorySymbol = document.getElementById('categorySymbol').value;
        const categoryTitle = document.getElementById('categoryTitleInput').value;
        const categoryDescription = document.getElementById('categoryDescriptionInput').value;

        if (categorySymbol && categoryTitle && categoryDescription) {
            if (editingIndex === -1) {
                // Add new category to the array
                categories.push({ symbol: categorySymbol, title: categoryTitle, description: categoryDescription });
            } else {
                // Edit existing category in the array
                categories[editingIndex] = { symbol: categorySymbol, title: categoryTitle, description: categoryDescription };
                editingIndex = -1;  // Reset after editing
            }

            // Render the updated list of categories
            renderCategories();

            // Close the modal after saving
            addCategoryModal.style.display = 'none';
        } else {
            alert('Please fill in all fields');
        }
    }

    // Function to clear modal inputs
    function clearModalInputs() {
        document.getElementById('categorySymbol').value = '';
        document.getElementById('categoryTitleInput').value = '';
        document.getElementById('categoryDescriptionInput').value = '';
    }

});

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
