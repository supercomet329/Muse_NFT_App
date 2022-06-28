$(function () {
    let token = localStorage.getItem("token");
    const apiType = "list_message";
    getTopImage(token, apiType)
    // トップページ画像取得APIのエンドポイントにAjaxする
    function getTopImage(accessToken, apiType) {
        $.ajax({
            url: endpoint,
            type: "POST",
            data: JSON.stringify({
                "access_token": accessToken,
                "api_type": apiType,
            }),
            dataType: "json",  // レスポンスをJSONとしてパースする
        }).done(function (data) {
            // トップページ画像の取得に失敗した場合
            if (!data.result) {
                // エラーメッセージをモーダルで表示
                console.log(data);
                $('#alert_modal').modal('show')
                data.error_message.forEach(e => {
                    let error_message = $(`<p class="text-danger">${e}</p>`);
                    $('#modal_body').append(error_message);
                });
                history.back();
                return false;
            }

            // Ajaxで取得したデータを表示
            let $oneMessage = $('#one_message');
            $.each(data.content, function (index, value) {
                let $oneMessageClone = $oneMessage.clone();
                appendMessage($oneMessageClone, value);
            })
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    function appendMessage(e, value) {
        e.attr('href', '../../../MUSE-APP/MUSE-APP/www/message_show.html' + `?user_id=${value.user_id}`);
        e.find('#author_image').attr('src', value.author_image);
        e.find('#display_name').text(value.display_name);
        e.find('#message').text(value.message);
        e.find('#send_day').text(value.send_day);
        e.find('#send_tile').text(value.send_tile);
        e.removeClass('d-none');
        e.appendTo('#list_area');
    }
});
