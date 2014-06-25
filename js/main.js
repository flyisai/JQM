/**
 * Created by Thinkpad on 2014/6/25.
 */
console.log((!(~+[])+{})[--[~+""][+[]]*[~+[]] + ~~!+[]]+({}+[])[[~!+[]]*~+[]])
$.ajaxPrefilter(function(options){
    options.url = 'https://api.douban.com' + options.url;
    options.crossDomain = true;
});

$('#home').on('pagecreate',function(){
    $.getJSON('/v2/book/search?callback=?', {tag:'推理'}, function(data){
        var result = '';
        for(var i=0; i<data.books.length; i++) {
            result += template(data , i)
        }
        $('#home-list')[0].innerHTML += result;
    });
});

var data = null;
function searchBook(){
    if($('#q')[0].value == '' && $('#tag')[0].value == '') {
        alert('name or tag');
        window.history.back();
        return
    }
    data = $('#bookSearch').serialize();
    $.getJSON('/v2/book/search?callback=?', data).done(function (data) {
        console.log(data)
        var result = '';
        for (var i = 0; i < data.books.length; i++) {
            result += template(data, i);
        }
        $('#book-list').html(result);
        if (data.total > data.count) {
            $('.page-style').remove();
            var list = '<li class="current">1</li>';
            for (var j = 1; j < parseInt(data.total / data.count); j++) {
                list += '<li>' + (j + 1) + '</li>';
            }
            list = '<ul class="page-style"><li>&lt;</li>' + list + '<li>&gt;</li></ul>';
            $('#result').prepend(list);
        }
        $('body').pagecontainer('change', '#searchList', {
            transition: 'slideup'
        });
    });
}

function template(data, i) {
    return '<li class="ui-btn ui-icon-carat-r ui-btn-icon-right" data-id=' + data.books[i].id + '><div class="description clear">' +
        '<div class="left"><img src="' + data.books[i].image + '" width=\"90px\" /></div>' +
        '<div class="right"><p>' + data.books[i].title + '</p>' +
        '<p>' + data.books[i].author[0] + '/' + data.books[i].translator + '/' + data.books[i].pubdate + '/' + data.books[i].price +'</p>' +
        '<p class="rating">' + data.books[i].rating.average + ' (' + data.books[i].rating.numRaters + '人评价)</p>' +
        '</div>' +
        '</div></li>';
}

$(document).on('tap', '.books li', function(e){
    var id = e.currentTarget.getAttribute('data-id');
    $.getJSON('/v2/book/' + id + '?callback=?', function(data){
        console.log(data);
        $('#book [data-role="content"] img').attr('src', data.images.medium);
        $('.book-detail').html('<p>' +
            '<span>作者：</span>' + data.author + '<br />' +
            '<span>出版社：</span>' + data.publisher + '<br />' +
            '<span>出版年：</span>' + data.pubdate + '<br />' +
            '<span>页数：</span>' + data.pages + '<br />' +
            '<span>定价：</span>' + data.price + '<br />' +
            '<span>装帧：</span>' + data.binding + '<br />' +
            '<span>ISBN：</span>' + data.isbn10 +
            '</p>');
        $('#book .book-content').html('<h3>内容简介</h3><p>' + data.summary + '</p><h3>作者简介</h3><p>' + data.author_intro + '</p>')
    }).done(function(){
        $("body").pagecontainer('change', '#book',{
            transition: 'slideup'
        })
    })
});

$(document).on('tap', 'a[role="button"]', function(){
    $('#bookSearch')[0].reset()
});

$(document).on('tap', '.page-style li', function(e){
    if(e.currentTarget.className != 'current') {
        var index = e.currentTarget.innerHTML;
        $(e.currentTarget).siblings().removeClass('current').end().addClass('current');
        switchPage(index, data);
    }
});

$(document).on('swipeleft','#book-list',function(e){
    e.preventDefault();
    var index = parseInt($('.current')[0].innerHTML) + 1;
    if(index<11) {
        $('.current').next().addClass('current').siblings().removeClass('current');
        switchPage(index, data);
    }
});

$(document).on('swiperight','#book-list',function(e){
    e.preventDefault();
    var index = parseInt($('.current')[0].innerHTML) - 1;
    if(index>0) {
        $('.current').prev().addClass('current').siblings().removeClass('current');
        switchPage(index, data);
    }
});

function switchPage(index, data) {
    $('#book-list').empty();
    showLoader();
    var parameter = data + '&start=' + index;
    $.getJSON('/v2/book/search?callback=?', parameter).done(function (data) {
        var result = '';
        for (var i = 0; i < data.books.length; i++) {
            result += template(data, i);
        }
        hideLoader();
        $('#book-list').html(result);
    });
}

function showLoader() {
    $.mobile.loading('show',{
        text: '加载中...',
        textVisible: true,
        textonly: false,
        theme: 'c'
    });
}

function hideLoader() {
    $.mobile.loading('hide');
}