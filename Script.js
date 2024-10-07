const uploads = []; // Array para armazenar uploads

// Função para alternar entre páginas
function showPage(page) {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('uploadPage').style.display = 'none';
    document.getElementById(page).style.display = 'block';
}

// Mostrar página inicial ao carregar
window.onload = function() {
    showPage('homePage');
    displayUploads(); // Exibe os uploads na carga da página
}

// Navegação entre páginas
document.getElementById('uploadPageBtn').addEventListener('click', function() {
    showPage('uploadPage');
});

document.getElementById('backBtn').addEventListener('click', function() {
    showPage('homePage');
});

// Função para validar conteúdo
function validateUpload(description, magnetLink, imageFile) {
    const inappropriateKeywords = ['adulto', 'violência', 'sexo', 'droga'];
    const isInappropriate = inappropriateKeywords.some(keyword => 
        description.toLowerCase().includes(keyword) ||
        magnetLink.toLowerCase().includes(keyword)
    );

    const validImageTypes = ['image/jpeg', 'image/png']; // Tipos de imagem válidos
    const isValidImage = validImageTypes.includes(imageFile.type); // Verifica se a imagem tem um tipo válido
    const isTooLarge = imageFile.size > 2 * 1024 * 1024; // Tamanho máximo de 2MB

    // Retorna falso se for inapropriado, se não for uma imagem válida ou se a imagem for muito grande
    return !isInappropriate && isValidImage && !isTooLarge;
}

// Enviar formulário de upload
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const magnetLink = document.getElementById('magnetLink').value;
    const fileImage = document.getElementById('fileImage').files[0];
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    // Validar upload
    if (!validateUpload(description, magnetLink, fileImage)) {
        alert('Upload inválido. Verifique a descrição, o link magnet e a imagem.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploads.push({
            magnetLink: magnetLink,
            image: e.target.result,
            description: description,
            category: category
        });
        displayUploads();
        showPage('homePage');
        document.getElementById('uploadForm').reset(); // Limpa o formulário
    };
    reader.readAsDataURL(fileImage); // Lê a imagem como URL
});

// Exibir uploads
function displayUploads() {
    const uploadsList = document.getElementById('uploadsList');
    uploadsList.innerHTML = ''; // Limpa a lista antes de adicionar novos uploads

    const selectedCategory = document.getElementById('categoryFilter').value;
    const searchQuery = document.getElementById('search').value.toLowerCase();

    uploads.forEach(upload => {
        const matchesCategory = selectedCategory === "" || upload.category === selectedCategory;
        const matchesSearch = upload.description.toLowerCase().includes(searchQuery);

        // Exibe apenas uploads que correspondem à categoria e à pesquisa
        if (matchesCategory && matchesSearch) {
            const uploadItem = document.createElement('div');
            uploadItem.classList.add('upload-item');
            uploadItem.innerHTML = `
                <img src="${upload.image}" alt="Imagem do filme" class="upload-image">
                <h3>${upload.description} (${upload.category})</h3>
                <a href="${upload.magnetLink}" target="_blank" class="download-btn">Baixar</a>
            `;
            uploadsList.appendChild(uploadItem);
        }
    });
}

// Filtrar uploads por categoria
document.getElementById('categoryFilter').addEventListener('change', displayUploads);

// Pesquisar uploads
document.getElementById('searchBtn').addEventListener('click', displayUploads);