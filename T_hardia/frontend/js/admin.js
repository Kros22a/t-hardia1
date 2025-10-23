// Panel administrativo
const API_BASE_URL = '/api/v1';

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
});

async function loadAdminData() {
    try {
        // Cargar estadísticas
        await loadStats();
        
        // Cargar usuarios
        await loadUsers();
        
        // Cargar comparaciones
        await loadComparisons();
        
        // Cargar respuestas de encuestas
        await loadSurveyResponses();
        
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

async function loadStats() {
    try {
        // Cargar usuarios
        const usersResponse = await fetch(`${API_BASE_URL}/users/`);
        const users = await usersResponse.json();
        document.getElementById('users-count').textContent = users.length;
        
        // Cargar comparaciones
        const comparisonsResponse = await fetch(`${API_BASE_URL}/comparisons/`);
        const comparisons = await comparisonsResponse.json();
        document.getElementById('comparisons-count').textContent = comparisons.length;
        
        // Cargar respuestas de encuestas
        const surveysResponse = await fetch(`${API_BASE_URL}/surveys/responses`);
        const surveys = await surveysResponse.json();
        document.getElementById('surveys-count').textContent = surveys.length;
        
        // Cargar posts de blog
        const blogResponse = await fetch(`${API_BASE_URL}/blog/`);
        const blogPosts = await blogResponse.json();
        document.getElementById('blog-count').textContent = blogPosts.length;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`);
        const users = await response.json();
        
        const usersList = document.getElementById('users-list');
        let html = '<div class="users-grid">';
        
        users.forEach(user => {
            html += `
                <div class="user-card">
                    <h4>${user.username}</h4>
                    <p>Email: ${user.email}</p>
                    <p>Registrado: ${new Date(user.created_at).toLocaleDateString()}</p>
                    <p>Último login: ${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}</p>
                    <p>Admin: ${user.is_admin ? 'Sí' : 'No'}</p>
                </div>
            `;
        });
        
        html += '</div>';
        usersList.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-list').innerHTML = '<p>Error al cargar usuarios</p>';
    }
}

async function loadComparisons() {
    try {
        const response = await fetch(`${API_BASE_URL}/comparisons/`);
        const comparisons = await response.json();
        
        const comparisonsList = document.getElementById('comparisons-list');
        let html = '<div class="comparisons-list">';
        
        comparisons.slice(0, 10).forEach(comp => {
            html += `
                <div class="comparison-item">
                    <h4>${comp.component1} vs ${comp.component2}</h4>
                    <p>Usuario: ${comp.user_id}</p>
                    <p>Fecha: ${new Date(comp.created_at).toLocaleDateString()}</p>
                    <p>Generado por IA: ${comp.ai_generated ? 'Sí' : 'No'}</p>
                </div>
            `;
        });
        
        html += '</div>';
        comparisonsList.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading comparisons:', error);
        document.getElementById('comparisons-list').innerHTML = '<p>Error al cargar comparaciones</p>';
    }
}

async function loadSurveyResponses() {
    try {
        const response = await fetch(`${API_BASE_URL}/surveys/responses`);
        const responses = await response.json();
        
        const responsesList = document.getElementById('survey-responses');
        let html = '<div class="responses-list">';
        
        responses.slice(0, 10).forEach(resp => {
            html += `
                <div class="response-item">
                    <p>Pregunta ID: ${resp.question_id}</p>
                    <p>Usuario: ${resp.user_id}</p>
                    <p>Respuesta: ${resp.response ? 'Sí' : 'No'}</p>
                    <p>Fecha: ${new Date(resp.created_at).toLocaleDateString()}</p>
                </div>
            `;
        });
        
        html += '</div>';
        responsesList.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading survey responses:', error);
        document.getElementById('survey-responses').innerHTML = '<p>Error al cargar respuestas</p>';
    }
}
