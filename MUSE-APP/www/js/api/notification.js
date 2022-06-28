$(function () {
    let token = localStorage.getItem("token");
    const apiType = "list_notification";
    getNotifications(token, apiType);
    // トップページ画像取得APIのエンドポイントにAjaxする
    function getNotifications(accessToken, apiType) {
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
            let $oneNotification = $('#one_notification');
            $.each(data.content, function (index, value) {
                let $oneNotificationClone = $oneNotification.clone();
                appendNotification($oneNotificationClone, value);
            })
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    function appendNotification(e, value) {
        e.find('#profile_image').attr('src', value.profile_image);
        e.find('#message').text(value.message);
        e.removeClass('d-none');
        e.appendTo('#list_area');
    }
});