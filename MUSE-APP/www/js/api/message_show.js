$(function () {
    let token = localStorage.getItem("token");
    let target_user_id = getParam('user_id');
    var apiType = "list_detail_message";

    getDatailMessages(token, apiType);

    $('#chat_button').on('click', function(e) {
        e.preventDefault()
        var apiType = "insert_message";
        let message = $('#chat_input').val();
        $('#chat_input').val('')
        $.ajax({
            url: endpoint,
            type: "POST",
            data: JSON.stringify({
                "access_token": token,
                "target_user_id": target_user_id,
                "api_type": apiType,
                "message": message,
            }),
            dataType: "json",  // レスポンスをJSONとしてパースする
        }).done(function (data) {
            // トップページ画像の取得に失敗した場合
            if (!data.result) {
                エラーメッセージをモーダルで表示
                $('#alert_modal').modal('show')
                data.error_message.forEach(e => {
                    let error_message = $(`<p class="text-danger">${e}</p>`);
                    $('#modal_body').append(error_message);
                });
                return false;
            }
            console.log(data);
            // Ajaxで取得したデータを表示
            $.each(data.content, function (index, value) {
                appendDetailMessage(value);
            })
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    });

    $('#post_image_btn').on('click', function(e) {
        e.preventDefault();
        var apiType = "insert_message";
        let $upfile = $('input[name="upfile"]');
        let file = $upfile.prop('files')[0];
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onloadend = function() {
            let base64data = fr.result;
            $.ajax({
                url: endpoint,
                type: "POST",
                processData: false,
                contentType: false,
                cache: false,
                data: JSON.stringify({
                    "access_token": token,
                    "target_user_id": target_user_id,
                    "api_type": apiType,
                    "image": base64data,
                }),
                dataType: "json",  // レスポンスをJSONとしてパースする
            }).done(function (data) {
                // トップページ画像の取得に失敗した場合
                console.log(data);
                if (!data.result) {
                    // エラーメッセージをモーダルで表示
                    $('#alert_modal').modal('show')
                    data.error_message.forEach(e => {
                        let error_message = $(`<p class="text-danger">${e}</p>`);
                        $('#modal_body').append(error_message);
                    });
                    return false;
                }
                console.log(data);
                // Ajaxで取得したデータを表示
                $.each(data.content, function (index, value) {
                    appendDetailMessage(value);
                })
                return data.result;
            }).fail(function (data) {
                console.log('Ajax fail (communication error)');
                return false;
            });

        }
    });

    // トップページ画像取得APIのエンドポイントにAjaxする
    function getDatailMessages(accessToken, apiType) {
        $.ajax({
            url: endpoint,
            type: "POST",
            data: JSON.stringify({
                "access_token": accessToken,
                "target_user_id": target_user_id,
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
            $.each(data.content, function (index, value) {
                appendDetailMessage(value);
            })
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    function appendDetailMessage(value) {
        let $balloonL = $('#balloon_l');
        let $balloonR = $('#balloon_r');
        let $dataArea = $('#date_area');
        let $display_name = $('#display_name').text().trim();

        $.each(value, function (key, v) {
            var $balloonClone = '';
            var $dataAreaClone = '';
            var before_send_day = '';

            if (v.user_id == target_user_id) {
                var $balloonClone = $balloonL.clone();
            } else {
                var $balloonClone = $balloonR.clone();
            }

            if (! $display_name) {
                $('#display_name').text(v.display_name);
            }

            if (before_send_day != Object.keys(value)[0]) {
                let $dataAreaClone = $dataArea.clone();
                let date = Object.keys(value)[0];
                $dataAreaClone.find('#date').text(date);
                $dataAreaClone.removeClass('d-none');
                $dataAreaClone.addClass('d-flex');
                $dataAreaClone.appendTo('#detail_message_list');
            }

            if (v.message) {
                $balloonClone.find('#message').text(v.message);
                $balloonClone.find('#message').removeClass('d-none');
            }

            if (v.image) {
                $balloonClone.find('#image').attr('src', v.image);
                $balloonClone.find('#image').removeClass('d-none');
            }

            $balloonClone.find('#profile_image').attr('src', v.profile_image);
            $balloonClone.find('#send_time').text(v.send_time);
            $balloonClone.removeClass('d-none');
            $balloonClone.appendTo('#detail_message_list');
            var before_send_day = Object.keys(value)[0];
        })
    }

    function getParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});