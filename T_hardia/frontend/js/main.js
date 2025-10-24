// Variables globales
const API_BASE_URL = '/api/v1';

// Cargar preguntas de encuesta
async function loadSurveyQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/surveys/questions/random?count=5`);
        if (!response.ok) {
            throw new Error('Error al cargar preguntas');
        }
        
        const questions = await response.json();
        displaySurveyQuestions(questions);
        updateSurveyProgress(0, questions.length);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('survey-questions').innerHTML = 
            '<div class="loading-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar las preguntas. Por favor recarga la página.</p></div>';
    }
}

// Mostrar preguntas de encuesta
function displaySurveyQuestions(questions) {
    const questionsDiv = document.getElementById('survey-questions');
    const progressDiv = document.getElementById('survey-progress');
    
    if (questions && questions.length > 0) {
        let html = '';
        questions.forEach((question, index) => {
            html += `
                <div class="question-card" data-question-id="${question.id}" data-index="${index}">
                    <h3>${question.question}</h3>
                    <div class="question-options">
                        <button class="btn btn-yes" onclick="submitSurveyResponse('${question.id}', true, ${index})">
                            <i class="fas fa-thumbs-up"></i> Sí
                        </button>
                        <button class="btn btn-no" onclick="submitSurveyResponse('${question.id}', false, ${index})">
                            <i class="fas fa-thumbs-down"></i> No
                        </button>
                    </div>
                </div>
            `;
        });
        
        questionsDiv.innerHTML = html;
        progressDiv.style.display = 'block';
        updateSurveyProgress(0, questions.length);
    } else {
        questionsDiv.innerHTML = '<div class="no-questions">No hay preguntas disponibles en este momento.</div>';
        progressDiv.style.display = 'none';
    }
}

// Enviar respuesta de encuesta
async function submitSurveyResponse(questionId, response, index) {
    try {
        const responseObj = await fetch(`${API_BASE_URL}/surveys/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question_id: questionId,
                user_id: 'anonymous',
                response: response
            })
        });
        
        if (responseObj.ok) {
            // Mostrar feedback visual
            const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
            const optionsDiv = questionCard.querySelector('.question-options');
            optionsDiv.innerHTML = `
                <span class="response-success">
                    <i class="fas fa-check-circle"></i>
                    ${response ? 'Respondido: Sí' : 'Respondido: No'}
                </span>
            `;
            
            // Actualizar progreso
            const totalQuestions = document.querySelectorAll('.question-card').length;
            updateSurveyProgress(index + 1, totalQuestions);
            
            // Verificar si es la última pregunta
            if (index === totalQuestions - 1) {
                setTimeout(() => {
                    showSurveyCompleted();
                }, 1000);
            }
        } else {
            throw new Error('Error al enviar respuesta');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar respuesta. Por favor intenta de nuevo.');
    }
}

// Actualizar progreso de encuesta
function updateSurveyProgress(current, total) {
    const progressFill = document.getElementById('progress-fill');
    const currentText = document.getElementById('current-question');
    const totalText = document.getElementById('total-questions');
    
    if (progressFill && currentText && totalText) {
        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;
        currentText.textContent = current;
        totalText.textContent = total;
    }
}

// Mostrar encuesta completada
function showSurveyCompleted() {
    document.getElementById('survey-questions').style.display = 'none';
    document.getElementById('survey-progress').style.display = 'none';
    document.getElementById('survey-completed').style.display = 'block';
}

// Manejar comparación de hardware
async function handleComparisonSubmit(event) {
    event.preventDefault();
    
    const component1 = document.getElementById('component1').value;
    const component2 = document.getElementById('component2').value;
    const category = document.getElementById('category').value;
    
    if (!component1 || !component2) {
        alert('Por favor ingresa ambos componentes');
        return;
    }
    
    try {
        // Mostrar loading
        showComparisonLoading();
        
        const response = await fetch(`${API_BASE_URL}/comparisons/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                component1: component1,
                component2: component2,
                user_id: 'anonymous',
                category: category
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
        displayComparisonError(error.message);
    } finally {
        hideComparisonLoading();
    }
}

// Mostrar resultados de comparación
function displayComparisonResult(comparison) {
    const resultsDiv = document.getElementById('comparison-results');
    const contentDiv = document.getElementById('comparison-content');
    
    if (comparison.result && !comparison.result.error) {
        let html = `
            <div class="comparison-content">
                <div class="comparison-result">
                    <h3>Comparación: ${comparison.component1} vs ${comparison.component2}</h3>
        `;
        
        if (comparison.result.recommendation) {
            html += `
                <div class="result-section">
                    <h4><i class="fas fa-star"></i> Recomendación Principal</h4>
                    <div class="summary-content">
                        ${comparison.result.recommendation}
                    </div>
                </div>
            `;
        }
        
        if (comparison.result.performance_comparison) {
            html += `
                <div class="result-section">
                    <h4><i class="fas fa-tachometer-alt"></i> Comparación de Rendimiento</h4>
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
                    <h4><i class="fas fa-dollar-sign"></i> Relación Precio-Rendimiento</h4>
                    <div class="price-content">
                        ${typeof comparison.result.price_performance === 'string' 
                          ? comparison.result.price_performance 
                          : JSON.stringify(comparison.result.price_performance, null, 2)}
                    </div>
                </div>
            `;
        }
        
        html += `</div></div>`;
        contentDiv.innerHTML = html;
    } else {
        contentDiv.innerHTML = `
            <div class="comparison-content">
                <div class="comparison-result">
                    <h3>Comparación: ${comparison.component1} vs ${comparison.component2}</h3>
                    <div class="error-content">
                        <p>No se pudieron obtener resultados detallados de la comparación.</p>
                        <p>${comparison.result ? JSON.stringify(comparison.result, null, 2) : 'Sin datos disponibles'}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar error de comparación
function displayComparisonError(message) {
    const resultsDiv = document.getElementById('comparison-results');
    const contentDiv = document.getElementById('comparison-content');
    
    contentDiv.innerHTML = `
        <div class="comparison-content">
            <div class="comparison-result">
                <h3><i class="fas fa-exclamation-triangle"></i> Error en Comparación</h3>
                <div class="error-content">
                    <p>${message}</p>
                    <p>Por favor intenta con otros componentes o verifica la conexión.</p>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar/Ocultar loading de comparación
function showComparisonLoading() {
    const button = document.querySelector('#comparison-form button');
    const textSpan = button.querySelector('.btn-text');
    const loadingSpan = button.querySelector('.btn-loading');
    
    textSpan.style.display = 'none';
    loadingSpan.style.display = 'inline';
    button.disabled = true;
}

function hideComparisonLoading() {
    const button = document.querySelector('#comparison-form button');
    const textSpan = button.querySelector('.btn-text');
    const loadingSpan = button.querySelector('.btn-loading');
    
    textSpan.style.display = 'inline';
    loadingSpan.style.display = 'none';
    button.disabled = false;
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

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Manejar formularios de comparación
    const comparisonForm = document.getElementById('comparison-form');
    if (comparisonForm) {
        comparisonForm.addEventListener('submit', handleComparisonSubmit);
    }
    
    // Manejar formularios de login/registro
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
