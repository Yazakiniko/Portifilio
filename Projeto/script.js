// --- 1. Lógica do Modo Escuro / Claro ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// --- 2. Efeito de Digitação Automática ---
const typingElement = document.querySelector('.typing-text');
const words = ['Interfaces Modernas.', 'Aplicações Web.', 'Experiências Únicas.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingElement) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Apaga mais rápido (50ms) do que digita (150ms)
    let typingSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000; // Tempo parado no final da frase
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // Pausa antes de digitar a próxima frase
    }

    setTimeout(typeEffect, typingSpeed);
}

// --- 3. Lógica do Menu Mobile ---
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('nav a');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// --- 4. Efeito Scroll Reveal ---
const reveals = document.querySelectorAll('.section, .hero-content');

// Injeta a classe base reveal apenas uma vez
reveals.forEach(element => element.classList.add('reveal'));

function revealOnScroll() {
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// --- 5. Lógica do Botão Voltar ao Topo ---
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- 6. Carregamento Automático via API do GitHub ---
const GITHUB_USERNAME = 'Yazakiniko';
const projectsContainer = document.getElementById('projects-container');

async function loadProjectsFromGitHub() {
    if (!projectsContainer) return;

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
        
        if (!response.ok) {
            throw new Error('Não foi possível carregar os projetos do GitHub.');
        }

        const repos = await response.json();
        const myOwnRepos = repos.filter(repo => !repo.fork);

        projectsContainer.innerHTML = '';

        if (myOwnRepos.length === 0) {
            projectsContainer.innerHTML = '<p class="error-msg">Nenhum repositório público encontrado.</p>';
            return;
        }

        myOwnRepos.forEach(repo => {
            const card = document.createElement('div');
            card.classList.add('project-card');

            const description = repo.description || 'Projeto incrível desenvolvido no ecossistema web. Confira os detalhes no repositório.';

            // --- Lógica de Destaque Backend (Java + Oracle) ---
            let techsHTML = '';
            
            // Se o repositório principal for Java, assumimos a stack full-stack/backend com Oracle
            if (repo.language && repo.language.toLowerCase() === 'java') {
                card.classList.add('backend-highlight'); // Classe especial para estilizar se quiser
                techsHTML = `<span>Java</span><span>Oracle SQL</span><span>API Rest</span>`;
            } else {
                // Para outros projetos, usa a linguagem principal retornada pelo GitHub
                techsHTML = repo.language ? `<span>${repo.language}</span>` : '<span>Link</span>';
            }

            card.innerHTML = `
                <div class="project-header">
                    <span class="folder">📂</span>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" aria-label="Ver repositório no GitHub" rel="noopener noreferrer">🔗</a>
                    </div>
                </div>
                <h3>${repo.name.replace(/-/g, ' ')}</h3>
                <p>${description}</p>
                <div class="project-tech">
                    ${techsHTML}
                </div>
            `;

            projectsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erro:', error);
        projectsContainer.innerHTML = '<p class="error-msg">Ops! Ocorreu um erro ao carregar os projetos. Tente novamente mais tarde.</p>';
    }
}

// --- 7. Lógica de Envio do Formulário de Contato ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede a página de recarregar
        
        const data = new FormData(contactForm);
        formStatus.textContent = "Enviando...";
        formStatus.className = "form-status-msg";

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = "Mensagem enviada com sucesso! Obrigado.";
                formStatus.classList.add('success');
                contactForm.reset(); // Limpa os campos do formulário
            } else {
                const responseData = await response.json();
                if (responseData.errors) {
                    formStatus.textContent = responseData.errors.map(error => error.message).join(", ");
                } else {
                    formStatus.textContent = "Ops! Ocorreu um problema ao enviar seu formulário.";
                }
                formStatus.classList.add('error');
            }
        } catch (error) {
            formStatus.textContent = "Ops! Erro de conexão. Verifique sua internet.";
            formStatus.classList.add('error');
        }
    });
}



// --- 8. Inicialização Geral ---
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    loadProjectsFromGitHub(); // Troca a função antiga por esta nova assíncrona
    revealOnScroll();
});