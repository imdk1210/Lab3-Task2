let posts = [];

async function getPosts() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        posts = response.data.slice(0, 10);
        displayPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function displayPosts() {
    const tableBody = document.querySelector('#post-table-body');
    if (!tableBody) {
        console.error('Error: #post-table-body element not found.');
        return;
    }
    tableBody.innerHTML = '';
    posts.forEach((post) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${post.id}</td>
            <td>${post.userId}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
            <td>
                <button class="edit-btn" style="background-color: #ff9800; color: white; border: none; padding: 5px 10px; border-radius: 5px;" data-id="${post.id}">Edit</button>
                <button class="delete-btn" style="background-color: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 5px;" data-id="${post.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


async function addPost() {
    const title = prompt("Enter the title for the new post:");
    const body = prompt("Enter the description for the new post:");

    if (title && body) {
        const newPost = {
            userId: 1,
            title: title,
            body: body,
            id: posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1
        };

        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
            posts.unshift(newPost);
            displayPosts();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    } else {
        alert("Post creation canceled. Please enter both a title and description.");
    }
}

async function editPost(postId) {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        const newTitle = prompt('Edit title:', post.title);
        const newBody = prompt('Edit body:', post.body);

        if (newTitle !== null) post.title = newTitle;
        if (newBody !== null) post.body = newBody;

        try {
            await axios.put(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                id: postId,
                title: post.title,
                body: post.body,
                userId: post.userId
            });
            posts[postIndex] = post;
            displayPosts();
        } catch (error) {
            console.error('Error editing post:', error);
        }
    }
}

async function deletePost(postId) {
    try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        posts = posts.filter(p => p.id !== postId);
        displayPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.id === 'addPostBtn') {
        addPost();
    } else if (event.target.classList.contains('edit-btn')) {
        const postId = parseInt(event.target.getAttribute('data-id'));
        editPost(postId);
    } else if (event.target.classList.contains('delete-btn')) {
        const postId = parseInt(event.target.getAttribute('data-id'));
        deletePost(postId);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    getPosts();
});
