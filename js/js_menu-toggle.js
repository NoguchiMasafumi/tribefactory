// menu-toggle.js
// - ページのクエリパラメータに ?menu=close があれば body に .menu-closed を付与します（初期状態）
// - また .content-left 内にハンバーガーのトグルボタンを注入して、クリックで開閉を切り替えられるようにします
// 注意: このスクリプトを <body> の閉じタグ直前に読み込むか、DOMContentLoaded を待つようにしてください。

(function () {
  function hasMenuParamClose() {
    try {
      var params = new URLSearchParams(window.location.search);
      var v = params.get('menu');
      return v === 'close';
    } catch (e) {
      return false;
    }
  }

  function ensureToggleButton() {
    var left = document.querySelector('.content-left');
    if (!left) return;

    // すでにある場合は再利用
    if (left.querySelector('.menu-toggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.setAttribute('aria-expanded', String(!document.body.classList.contains('menu-closed')));

    var icon = document.createElement('span');
    icon.className = 'icon';
    // 中央の線（span）を入れて CSS 側で表示をコントロール
    var middle = document.createElement('span');
    middle.setAttribute('aria-hidden', 'true');
    icon.appendChild(middle);

    btn.appendChild(icon);

    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      var closed = document.body.classList.toggle('menu-closed');
      btn.setAttribute('aria-expanded', String(!closed));
      // update URL query param without reloading: reflect state (optional)
      try {
        var url = new URL(window.location.href);
        if (closed) {
          url.searchParams.set('menu', 'close');
        } else {
          url.searchParams.delete('menu');
        }
        // history に残す（ページ移動せずにクエリだけ書き換え）
        window.history.replaceState({}, '', url.toString());
      } catch (e) {
        // ignore
      }
    }, false);

    // メニューの右端（content-left の外側）に出すために append ではなく先頭に入れておく
    left.insertBefore(btn, left.firstChild);
  }

  function init() {
    if (hasMenuParamClose()) {
      document.body.classList.add('menu-closed');
    } else {
      document.body.classList.remove('menu-closed');
    }
    ensureToggleButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();