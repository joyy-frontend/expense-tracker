
let categories = [];
let editingIndex = -1;
const categoriesContainer = document.querySelector('.categories');
const newCategoryBtn = document.getElementById('newCategoryBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const editCategoryModal = document.getElementById('editCategoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const editCategoryBtn = document.getElementById('editCategoryBtn');
const categoryItems = document.querySelectorAll('.category-item');
const categoryName = document.getElementById('categoryName');
const closeModalButtons = document.querySelectorAll('.close');  
const categoryTitleEdit = document.getElementById('categoryTitleEdit');

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
            <p data-index="${index}">${category.title}</p>
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

// Save Button Functionality
saveCategoryBtn.addEventListener('click', (e) => {
    e.preventDefault();  // Prevent form submission

    const categoryTitle = document.getElementById('categoryTitleInput').value;
    const categoryDescription = document.getElementById('categoryDescriptionInput').value;

    if (categoryTitle && categoryDescription) {
        if (editingIndex === -1) {
            // Add new category to the array
            categories.push({ title: categoryTitle, description: categoryDescription });
        } else {
            // Edit existing category in the array
            categories[editingIndex] = { title: categoryTitle, description: categoryDescription };
            editingIndex = -1;  // Reset after editing
        }

        // Render the updated list of categories
        renderCategories();

        // Close the modal
        addCategoryModal.style.display = 'none';
    } else {
        alert('Please fill in all fields');
    }
});

// Delete Button Functionality
function handleDelete(e) {
    const index = e.target.dataset.index;
    categories.splice(index, 1);  // Remove the category from the array
    renderCategories();  // Re-render the categories list
}

// Edit Button Functionality
function handleEdit(index) {
    document.getElementById('categoryTitleEdit').value = categories[index].title;
    document.getElementById('categoryDescriptionEdit').value = categories[index].description;

    // Open the modal for editing
    editCategoryModal.style.display = 'block';
    
    editCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("edit button click");
        // Update category details
        categories[index].title = document.getElementById('categoryTitleEdit').value;
        categories[index].description = document.getElementById('categoryDescriptionEdit').value;

        // Re-render the categories after editing
        renderCategories();

        // Close the modal after saving the changes
        editCategoryModal.style.display = 'none';
    });
}

// Show the modal when the +New button is clicked
newCategoryBtn.addEventListener('click', () => {
    clearModalInputs(addCategoryModal);
    addCategoryModal.style.display = 'block';
});

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

function clearModalInputs(modal) {
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';  // Clear the input field
    });
}
