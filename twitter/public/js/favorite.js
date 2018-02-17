const html = `<div class="ui styled accordion name-list">${window.favoriteList.map((name) => {
  return `<div class="title" data-name="${name}">
    <i class="dropdown icon"></i>
    <span>${name}</span>
  </div>
  <div class="content"></div>`;
}).join('')}</div>`;

$('body').append(html);

$('.name-list')
  .accordion({
    selector: {
      trigger: '.title'
    }
  });


function format (date) {
  const d = new Date(date);
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}
let loading = false;
$('.name-list').on('click', '.title', function (e) {
  const target = $(e.target).closest('.title');
  if (!target.data('loaded')) {
    if (loading) {
      return
    }
    loading = true;
    $.ajax({
      url: '/favoriteList',
      data: {name: target.data('name')}
    }).done(function (res) {
      if (res.success) {
        const userList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            item.urls = item.urls || [];
            item.urls.forEach((it) => {
              const replace = `<a href="${it.expand}" target="_blank">${it.expand.match(/https?:\/\/([^\/]+)/)[1]}</a>`;
              item.text = item.text.replace(it.url, replace);
            });
            return `<div class="item">
            <img width="48" height="48" src="/public/img/${item.owner}" />
            <div class="content">
              <div class="header"> 
                <a href="/friend/${item.owner}" target="_blank">${item.owner}</a>
                <span style="font-size: 12px;">${format(item.created_at)}</span>
              </div>
              <div class="description">
              ${item.text}
              </div>
            </div>
          </div>`
          }).join('')}
        </div>`;

        target.next('.content').html(userList);
      }
      target.data('loaded', true);
      loading = false;
    });
  }
});