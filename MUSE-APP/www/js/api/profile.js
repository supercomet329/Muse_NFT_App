$(function () {

    let token  = localStorage.getItem("token");
    let userId = getParam('user_id');

    getProfile(token, userId);
    getProfileImage(token, userId);

    // プロフィールデータ取得APIのエンドポイントにAjaxする
    function getProfile(accessToken, user_id) {
        let apiType = "profile";
        $.ajax({
            url: endpoint,
            type: "POST",
            data: JSON.stringify({
                "access_token": accessToken,
                "api_type": apiType,
                "user_id": user_id,
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
                return false;
            }
            // Ajaxで取得したデータを表示
            console.log(data);
            writeUserInfo(data);
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    // ユーザーの投稿画像 いいね投稿の情報を取得するAPIのエンドポイントにAjaxする
    function getProfileImage(accessToken, user_id) {
        let apiType = "profile_image";
        $.ajax({
            url: endpoint,
            type: "POST",
            data: JSON.stringify({
                "access_token": accessToken,
                "api_type": apiType,
                "user_id": user_id,
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
                return false;
            }
            // Ajaxで取得したデータを表示
            console.log(data.post_image);
            let $postContent = $('#post_content');
            $.each(data.post_image, function (index, value) {
                let $postContentClone = $postContent.clone();
                appendPostImage($postContentClone, value);
            })

            let $likeContent = $('#like_content');
            $.each(data.like_image, function (index, value) {
                let $likeContentClone = $likeContent.clone();
                appendLikeImage($likeContentClone, value);
            })

            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    function writeUserInfo(data) {
        $('#cover_image').attr('src', data.banner_iamge);
        $('#profile_icon').attr('src', data.author_iamge);
        $('#display_name').text(data.display_name);
        $('#follow_count').text(data.follow_count);
        $('#follower_count').text(data.follower_count);
        $('#web_site').text(data.web_site);
    }

    function appendPostImage(e, value) {
        $.each(value, function (index, contentItem) {
            let $postItem = $('#post_item');
            let $postItemClone = $postItem.clone();
            $postItemClone.find('#post_image').attr('src', contentItem.main_image);
            $postItemClone.removeClass('d-none');
            $postItemClone.addClass('d-flex');
            e.appendTo('#mypost_list');
            $postItemClone.appendTo(e);
        })
    }

    function appendLikeImage(e, value) {
        console.log(value);
        $.each(value, function (index, contentItem) {
            let $likeItem = $('#like_item');
            let $likeItemClone = $likeItem.clone();
            $likeItemClone.find('#like_image').attr('src', contentItem.meta_value);
            $likeItemClone.removeClass('d-none');
            $likeItemClone.addClass('d-flex');
            e.appendTo('#favorite_list');
            $likeItemClone.appendTo(e);
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
