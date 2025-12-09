document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'yosinxon' && password === 'holbi2007') {
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            } else {
                alert('Invalid username or password. Please try again.');
            }
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            location.reload();
        });
    }
    
    const imageInput = document.getElementById('projectImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    imagePreview.innerHTML = `
                        <div class="preview-container">
                            <img src="${reader.result}" alt="Project Preview">
                            <button type="button" class="remove-image" id="removeImage">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    
                    document.getElementById('removeImage').addEventListener('click', function() {
                        imagePreview.innerHTML = '';
                        imageInput.value = '';
                    });
                });
                
                reader.readAsDataURL(file);
            }
        });
    }

    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectName = document.getElementById('projectName').value;
            const projectCategory = document.getElementById('projectCategory').value;
            const projectDescription = document.getElementById('projectDescription').value;
            const githubLink = document.getElementById('githubLink').value;
            const liveDemo = document.getElementById('liveDemo').value;
            const technologies = document.getElementById('technologies').value;
            
            let projectImage = '';
            const imageFile = document.getElementById('projectImage').files[0];
            
            if (imageFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = function() {
                    projectImage = reader.result;
                    saveProject(projectName, projectCategory, projectDescription, githubLink, liveDemo, technologies, projectImage);
                };
            } else {
                projectImage = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80';
                saveProject(projectName, projectCategory, projectDescription, githubLink, liveDemo, technologies, projectImage);
            }
        });
    }
    
    loadProjects();
});

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
}

function saveProject(name, category, description, github, liveDemo, tech, image) {

    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    
    const newProject = {
        id: Date.now(),
        name: name,
        category: category,
        description: description,
        github: github,
        liveDemo: liveDemo,
        technologies: tech.split(',').map(t => t.trim()),
        image: image,
        date: new Date().toLocaleDateString()
    };
    
    projects.unshift(newProject);
    
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    
    document.getElementById('projectForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    alert('Project added successfully!');
    
    loadProjects();
}

function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    
    if (projects.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No projects added yet. Your projects will appear here.</p>
            </div>
        `;
        return;
    }
    
    let projectsHTML = '';
    
    projects.slice(0, 5).forEach(project => {
        projectsHTML += `
            <div class="project-item">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.name}">
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p class="project-category">${project.category}</p>
                    <p class="project-description">${project.description.substring(0, 100)}...</p>
                    <div class="project-links">
                        <a href="${project.github}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        <a href="${project.liveDemo}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                    <button type="button" class="btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    projectsList.innerHTML = projectsHTML;
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const filteredProjects = projects.filter(project => project.id !== id);
        localStorage.setItem('portfolioProjects', JSON.stringify(filteredProjects));
        loadProjects();
    }
}