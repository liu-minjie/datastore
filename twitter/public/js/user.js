function format (date) {
  const d = new Date(date);
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}



function render (data) {
  const userList = `<div class="ui relaxed divided list main">
    ${data.map((item) => {
      item.urls = item.urls || [];
      item.urls.forEach((it) => {
        const replace = `<a href="${it.expand}" target="_blank">${it.expand.match(/https?:\/\/([^\/]+)/)[1]}</a>`;
        item.text = item.text.replace(it.url, replace);
        
      });
      item.text = item.text.replace(/@(\w+)/g, function ($0, $1) {
        return `<a href="https://twitter.com/${$1}" target="_blank">${$0}</a>`;
      });
      
      return `<div class="item ${item.status === 1 ? ' read' : ''}">
      <div class="content">
        <div class="header"> 
          <span style="font-size: 12px;">${format(item.created_at)}</span>
        </div>
        <div class="description">
          ${item.text}
          <a class="get-reply operate" data-reply="${item.hasReply}" href="javascript:void(0);" data-tid="${item.id_str}">reply</a>
          <a class="read-reply operate" href="javascript:void(0);" data-tid="${item.id_str}">read</a>
          <a class="rm-reply operate" href="javascript:void(0);" data-tid="${item.id_str}">remove</a>
          <a class="like-reply operate" href="javascript:void(0);" data-tid="${item.id_str}">like</a>
        </div>
      </div>
    </div>`
    }).join('')}
  </div>`;
  $('#wrap').append(userList);
}

render(window.pageConfig.userList);




var page = 1;
var name = location.href.match(/\/friend\/(\w+)/)[1];
$('#more').on('click', function () {
  page++;

  $.ajax({
    url: `/api/user/${name}/?page=${page}`
  }).done(function (res) {
    if (!res.data || res.data.length < 50) {
      $('#more').hide();
      return;
    }
    render(res.data);
  });
})
$('.main.list').on('click', '.get-reply', function (e) {
  e.preventDefault();
  var target = $(e.target);
  var tid = target.data('tid');
  if (!target.data('reply')){
    window.open(`https://twitter.com/${name}/status/${tid}`)
    return
  }

  $.ajax({
    url: '/reply?id=' + tid
  }).done(function (res) {
    console.log(res);
    if (res.data && res.data.length) {
      var html = '';
      res.data.forEach((item) => {
        item.reply.forEach((group) => {
          group.forEach((it) => {
            html += `<div class="item">
              <div class="content">
                <div class="header"> 
                  ${it.name}
                </div>
                <div class="description">
                  ${it.content}
                </div>
              </div>
            </div>`;
          });
        });
      });
      target.closest('.description').append(`<div class="ui relaxed divided list "> ${html}</div>`)
    } else {
      
      window.open(`https://twitter.com/${name}/status/${tid}`)
    }
  })
});

$('.main.list').on('click', '.read-reply', function (e) {
  e.preventDefault();
  var target = $(e.target);
  var tid = target.data('tid');

  $.ajax({
    type: 'POST',
    url: `/timeline/read/${name}?id=${tid}`
  }).done(function (res) {
    console.log(res);
  })
});