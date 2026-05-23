// ブログの機能を実装

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupFormListener();
});

// フォームのリスナー設定
function setupFormListener() {
    const form = document.getElementById('postForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addPost();
    });
}

// 記事を追加
function addPost() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const author = document.getElementById('author').value.trim();

    // バリデーション
    if (!title || !content || !author) {
        alert('すべてのフィールドを入力してください');
        return;
    }

    // 新しい記事を作成
    const post = {
        id: Date.now(),
        title: sanitizeHTML(title),
        content: sanitizeHTML(content),
        author: sanitizeHTML(author),
        date: new Date().toLocaleString('ja-JP')
    };

    // ローカルストレージに保存
    let posts = getPosts();
    posts.unshift(post); // 最初に追加
    localStorage.setItem('blogPosts', JSON.stringify(posts));

    // フォームをリセット
    document.getElementById('postForm').reset();

    // 画面を更新
    loadPosts();

    // 成功メッセージ
    alert('記事を投稿しました！');
}

// 記事を削除
function deletePost(id) {
    if (confirm('この記事を削除してもよろしいですか？')) {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        loadPosts();
    }
}

// すべての記事を取得
function getPosts() {
    const data = localStorage.getItem('blogPosts');
    return data ? JSON.parse(data) : [];
}

// 記事を表示
function loadPosts() {
    const posts = getPosts();
    const container = document.getElementById('postsContainer');

    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-message">まだ記事がありません。新しい記事を投稿してみましょう！</div>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3>${post.title}</h3>
            <div class="post-content">${post.content}</div>
            <div class="post-meta">
                <span class="post-author">著者: ${post.author}</span>
                <span class="post-date">📅 ${post.date}</span>
            </div>
            <button class="btn-delete" onclick="deletePost(${post.id})">削除</button>
        </div>
    `).join('');
}

// XSS対策: HTMLをエスケープ
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
