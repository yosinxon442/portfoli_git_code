const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
});

function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const noProjects = document.getElementById('noProjects');
    
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    
    if (projects.length === 0) {
        projectsGrid.style.display = 'none';
        noProjects.style.display = 'block';
        return;
    }
    
    let projectsHTML = '';
    
    projects.forEach(project => {
        projectsHTML += `
            <div class="project-card" data-category="${project.category}">
                <div class="project-card-image">
                    <img src="${project.image}" alt="${project.name}">
                    <div class="project-card-overlay">
                        <a href="${project.liveDemo}" target="_blank" class="project-card-link">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
                <div class="project-card-content">
                    <div class="project-card-header">
                        <h3>${project.name}</h3>
                        <span class="project-card-category">${project.category}</span>
                    </div>
                    <p class="project-card-description">${project.description}</p>
                    <div class="project-card-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-card-links">
                        <a href="${project.github}" target="_blank" class="project-card-github">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        <a href="${project.liveDemo}" target="_blank" class="project-card-demo">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    projectsGrid.innerHTML = projectsHTML;
    projectsGrid.style.display = 'grid';
    noProjects.style.display = 'none';
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}