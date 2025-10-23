// Variables globales
const API_BASE_URL = '/api/v1';

// Función para manejar el formulario de comparación
document.addEventListener('DOMContentLoaded', function() {
    const comparisonForm = document.getElementById('comparison-form');
    if (comparisonForm) {
        comparisonForm.addEventListener('submit', handleComparisonSubmit);
    }
    
    // Cargar preguntas de encuesta si estamos en la página de encuesta
    const surveyQuestionsDiv = document.getElementById('survey-questions');
    if (surveyQuestionsDiv) {
        loadSurveyQuestions();
    }
    
    // Cargar posts de blog si estamos en la página de blog
    const blogPostsDiv = document.getElementById('blog-posts');
    if (blogPostsDiv) {
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
        alert('Por favor completa ambos campos');
        return;
    }
    
    try {
        // Mostrar loading
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/comparisons/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                component1: component1,
                component2: component2,
                user_id: 'anonymous' // En producción usar ID de usuario real
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en la comparación');
        }
        
        const comparison = await response.json();
        displayComparisonResult(comparison);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al realizar la comparación. Por favor intenta de nuevo.');
    } finally {
        hideLoading();
    }
}

// Mostrar resultados de comparación
function displayComparisonResult(comparison) {
    const resultsDiv = document.getElementById('comparison-results');
    const contentDiv = document.getElementById('comparison-content');
    
    if (comparison.result && !comparison.result.error) {
        contentDiv.innerHTML = `
            <div class="comparison-result">
                <h3>Comparación: ${comparison.component1} vs ${comparison.component2}</h3>
                <div class="result-section">
                    <h4>Resumen</h4>
                    <p>${comparison.result.recommendation || 'Comparación generada por IA'}</p>
                </div>
                <div class="result-section">
                    <h4>Detalles Técnicos</h4>
                    <div class="technical-details">
                        <div class="component-specs">
                            <h5>${comparison.component1}</h5>
                            <pre>${JSON.stringify(comparison.result.component1_specs || {}, null, 2)}</pre>
                        </div>
                        <div class="component-specs">
                            <h5>${comparison.component2}</h5>
                            <pre>${JSON.stringify(comparison.result.component2_specs || {}, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        contentDiv.innerHTML = `
            <div class="comparison-result">
                <h3>Comparación: ${comparison.component1} vs ${comparison.component2}</h3>
                <p>Resultados generados por IA:</p>
                <pre>${JSON.stringify(comparison.result, null, 2)}</pre>
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
            '<p>Error al cargar las preguntas. Por favor recarga la página.</p>';
    }
}

// Mostrar preguntas de encuesta
function displaySurveyQuestions(questions) {
    const questionsDiv = document.getElementById('survey-questions');
    let html = '';
    
    questions.forEach((question, index) => {
        html += `
            <div class="question-card slide-up" style="animation-delay: ${index * 0.1}s">
                <h3>${question.question}</h3>
                <div class="question-options">
                    <button class="btn btn-secondary" onclick="submitSurveyResponse('${question.id}', true)">Sí</button>
                    <button class="btn btn-secondary" onclick="submitSurveyResponse('${question.id}', false)">No</button>
                </div>
            </div>
        `;
    });
    
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
            const button = event.target;
            button.style.background = response ? '#4CAF50' : '#f44336';
            button.textContent = response ? 'Sí ✓' : 'No ✓';
            
            // Deshabilitar botones
            button.parentElement.querySelectorAll('button').forEach(btn => {
                btn.disabled = true;
            });
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar respuesta');
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
            '<p>Error al cargar los posts. Por favor recarga la página.</p>';
    }
}

// Mostrar posts de blog
function displayBlogPosts(posts) {
    const postsDiv = document.getElementById('blog-posts');
    let html = '';
    
    posts.forEach((post, index) => {
        html += `
            <article class="blog-post slide-up" style="animation-delay: ${index * 0.1}s">
                <h2><a href="/blog/${post.slug}">${post.title}</a></h2>
                <div class="post-meta">
                    <span class="author">Por ${post.author}</span>
                    <span class="category">${post.category}</span>
                    <span class="date">${new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <p>${post.content.substring(0, 200)}...</p>
                <div class="post-tags">
                    ${post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <a href="/blog/${post.slug}" class="btn btn-primary">Leer más</a>
            </article>
        `;
    });
    
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
    button.innerHTML = 'Comparando...';
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

// Manejar login/registro
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
            window.location.href = '/'; // Redirigir a página principal
        } else {
            alert('Credenciales inválidas');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    }
}

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
            const error = await response.json();
            alert(error.detail || 'Error en el registro');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro');
    }
}
