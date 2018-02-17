const html = `<div class="ui styled accordion name-list">${window.timelineList.map((name) => {
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
      url: '/timelineList',
      data: {name: target.data('name')}
    }).done(function (res) {
      if (res.success) {
        const userList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            const url = item.url ? `<div><a href=""></a></div>` : '';
            return `<div class="item">
            <i class="large github middle aligned icon"></i>
            <div class="content">
              <a class="header">${item.owner}</a>
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