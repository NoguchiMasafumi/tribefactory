const currentYear = new Date().getFullYear();
const footerHtml = `
const footerHtml = `
これはいいってこと？  <-- ✅ 日本語の全角文字（文字列データ）
<p>&copy; ${currentYear} All Rights Reserved.</p>
`;
document.getElementById('footer-container')?.innerHTML = footerHtml;

