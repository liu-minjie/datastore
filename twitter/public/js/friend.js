const html = `<div class="ui styled accordion name-list">${window.friendList.map((name) => {
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

let loading = false;
$('.name-list').on('click', '.title', function (e) {
  const target = $(e.target).closest('.title');
  if (!target.data('loaded')) {
    if (loading) {
      return
    }
    loading = true;
    $.ajax({
      url: '/friendList',
      data: {name: target.data('name')}
    }).done(function (res) {
      if (res.success) {
        const userList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            let site = '';
            if (item.url) {
              item.urls.some((it) => {
                if (it.url === item.url) {
                  site = `<a href="${it.expand}" target="_blank" style="display: block;">${it.expand}</a>`;
                  return true;
                }
              });
            }
            const url = item.url ? `<div><a href=""></a></div>` : '';
            return `<div class="item">
            <img width="48" height="48" src="/public/img/${item.screen_name}" />
            <div class="content">
              <a class="header" href="/friend/${item.screen_name}" target="_blank">${item.screen_name}</a>
              <div class="description">
                <div class="desc-txt">${item.description}</div>
                ${site}
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