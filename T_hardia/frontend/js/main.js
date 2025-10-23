// Variables globales
const API_BASE_URL = '/api/v1';

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Cargar datos según la página
    if (currentPage === 'hardware-comparison.html') {
        // Ya se maneja con el script inline
    } else if (currentPage === 'survey.html') {
        loadSurveyQuestions();
    } else if (currentPage === 'blog.html') {
        loadBlogPosts();
    }
    
    // Animar elementos cuando entran en la vista
    animateOnScroll();
});

// Manejar comparación de hardware
async function handleComparisonSubmit(event) {
    event.preventDefault();
    
    const component1 = document.getElementById('component1').value;
    const component2 = document.getElementById('component2').value;
    
    if (!component1 || !component2) {
        alert('Por favor selecciona ambos componentes');
        return;
    }
    
    // Obtener nombres legibles de los componentes
    const component1Name = document.getElementById('component1').selectedOptions[0].text;
    const component2Name = document.getElementById('component2').selectedOptions[0].text;
    
    try {
        // Mostrar loading
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/comparisons/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                component1: component1Name,
                component2: component2Name,
                user_id: 'anonymous' // En producción usar ID de usuario real
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error en la comparación');
        }
        
        const comparison = await response.json();
        displayComparisonResult(comparison);
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al realizar la comparación: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Mostrar resultados de comparación
function displayComparisonResult(comparison) {
    const resultsDiv = document.getElementById('comparison-results');
    const contentDiv = document.getElementById('comparison-content');
    
    if (comparison.result && !comparison.result.error) {
        let html = `
            <div class="comparison-result">
                <h3>Comparación: ${comparison.component1} vs ${comparison.component2}</h3>
                <div class="result-section">
                    <h4>Resumen</h4>
                    <div class="summary-content">
                        ${comparison.result.recommendation || 'Comparación generada por IA'}
                    </div>
                </div>
        `;
        
        if (comparison.result.performance_comparison) {
            html += `
                <div class="result-section">
                    <h4>Comparación de Rendimiento</h4>
                    <div class="performance-content">
                        ${typeof comparison.result.performance_comparison === 'string' 
                          ? comparison.result.performance_comparison 
                          : JSON.stringify(comparison.result.performance_comparison, null, 2)}
                    </div>
                </div>
            `;
        }
        
        if (comparison.result.price_performance) {
            html += `
                <div class="result-section">
                    <h4>Relación Precio-Rendimiento</h4>
                    <div class="price-content">
                        ${typeof comparison.result.price_performance === 'string' 
                          ? comparison.result.price_performance 
                          : JSON.stringify(comparison.result.price_performance, null, 2)}
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        contentDiv.innerHTML = html;
    } else {
        contentDiv.innerHTML = `
            <div class="comparison-result">
                <h3>Comparación: ${comparison.component1} vs ${comparison.component2}</h3>
                <div class="error-content">
                    <p>No se pudieron obtener resultados detallados de la comparación.</p>
                    <p>Resultado: ${JSON.stringify(comparison.result || 'Sin datos', null, 2)}</p>
                </div>
            </div>
        `;
    }
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Cargar preguntas de encuesta
async function loadSurveyQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/surveys/questions/random?count=5`);
        if (!response.ok) {
            throw new Error('Error al cargar preguntas');
        }
        
        const questions = await response.json();
        displaySurveyQuestions(questions);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('survey-questions').innerHTML = 
            '<p class="error">Error al cargar las preguntas. Por favor recarga la página.</p>';
    }
}

// Mostrar preguntas de encuesta
function displaySurveyQuestions(questions) {
    const questionsDiv = document.getElementById('survey-questions');
    let html = '';
    
    if (questions && questions.length > 0) {
        questions.forEach((question, index) => {
            html += `
                <div class="question-card slide-up" style="animation-delay: ${index * 0.1}s">
                    <h3>${question.question}</h3>
                    <div class="question-options">
                        <button class="btn btn-yes" onclick="submitSurveyResponse('${question.id}', true)">Sí</button>
                        <button class="btn btn-no" onclick="submitSurveyResponse('${question.id}', false)">No</button>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<p class="no-questions">No hay preguntas disponibles en este momento.</p>';
    }
    
    questionsDiv.innerHTML = html;
    
    // Animar elementos
    setTimeout(() => {
        document.querySelectorAll('.question-card').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

// Enviar respuesta de encuesta
async function submitSurveyResponse(questionId, response) {
    try {
        const responseObj = await fetch(`${API_BASE_URL}/surveys/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question_id: questionId,
                user_id: 'anonymous', // En producción usar ID real
                response: response
            })
        });
        
        if (responseObj.ok) {
            // Mostrar feedback visual
            const buttonContainer = event.target.parentElement;
            buttonContainer.innerHTML = response ? 
                '<span class="response-success">✓ Respondido: Sí</span>' : 
                '<span class="response-success">✓ Respondido: No</span>';
        } else {
            throw new Error('Error al enviar respuesta');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar respuesta. Por favor intenta de nuevo.');
    }
}

// Cargar posts de blog
async function loadBlogPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/`);
        if (!response.ok) {
            throw new Error('Error al cargar posts');
        }
        
        const posts = await response.json();
        displayBlogPosts(posts);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('blog-posts').innerHTML = 
            '<p class="error">Error al cargar los posts. Por favor recarga la página.</p>';
    }
}

// Mostrar posts de blog
function displayBlogPosts(posts) {
    const postsDiv = document.getElementById('blog-posts');
    let html = '';
    
    if (posts && posts.length > 0) {
        posts.forEach((post, index) => {
            html += `
                <article class="blog-post slide-up" style="animation-delay: ${index * 0.1}s">
                    <h2><a href="/blog/${post.slug}">${post.title}</a></h2>
                    <div class="post-meta">
                        <span class="author">Por ${post.author}</span>
                        <span class="category">${post.category}</span>
                        <span class="date">${new Date(post.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                    <p>${post.content.substring(0, 200)}...</p>
                    <div class="post-tags">
                        ${post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                    <a href="/blog/${post.slug}" class="btn btn-primary">Leer más</a>
                </article>
            `;
        });
    } else {
        html = '<p class="no-posts">No hay posts disponibles en este momento.</p>';
    }
    
    postsDiv.innerHTML = html;
    
    // Animar elementos
    setTimeout(() => {
        document.querySelectorAll('.blog-post').forEach(post => {
            post.classList.add('visible');
        });
    }, 100);
}

// Mostrar/Ocultar loading
function showLoading() {
    const button = document.querySelector('#comparison-form button');
    button.innerHTML = '<span class="loading-spinner"></span> Comparando...';
    button.disabled = true;
}

function hideLoading() {
    const button = document.querySelector('#comparison-form button');
    button.innerHTML = 'Comparar con IA';
    button.disabled = false;
}

// Animar elementos al hacer scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.slide-up, .fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Manejar login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_email', email);
            window.location.href = '/'; // Redirigir a página principal
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Credenciales inválidas');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión. Por favor intenta de nuevo.');
    }
}

// Manejar registro
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password })
        });
        
        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/login.html';
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error en el registro');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro. Por favor intenta de nuevo.');
    }
}

// Verificar si el usuario está logueado
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    window.location.href = '/login.html';
}


