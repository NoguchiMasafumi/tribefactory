const currentYear = new Date().getFullYear();
const footerHtml = `
これはいいってこと？
<p>&copy; ${currentYear} All Rights Reserved.</p>
`;
document.getElementById('footer-container')?.innerHTML = footerHtml;



