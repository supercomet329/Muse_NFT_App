$(function () {
    let token = localStorage.getItem("token");
    let apiType = "get_follow";
    getFollow(token, apiType)
    // トップページ画像取得APIのエンドポイントにAjaxする
    function getFollow(accessToken, apiType) {
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
                return false;
            }

            // Ajaxで取得したデータを表示
            appendToFollowsList(data.content);
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    $(document).on('click', '#follow-off, #follow-on', function() {
        let apiType = "follow";
        let targetUserId = $(this).data('id');
        follow(token, targetUserId, apiType)
    });

    function appendToFollowsList(follows) {
        follows.forEach(follow => {
            console.log(follow);
            let el =
            $(`
                <hr class="list-area-border my-0">
                <div class="row my-2">
                    <div class="col-2 d-block pr-0">
                        <img src="${follow.profile_image}" class="rounded-circle profile-icon">
                    </div>
                    <div class="col-6 d-block">
                        <p class="name font-weight-bold mb-1">${follow.author_name}</p>
                        <p class="profile-detail mb-1">${follow.description}</p>
                    </div>
                    <div class="col-4 d-block btn-area text-right pl-0 my-auto">
                        <button type="button" class="btn btn-primary rounded-pill btn-sm text-white btn-lg main-color follow-btn follow-on" id="follow-on" data-id="${follow.target_user_id}">フォロー中</button>
                    </div>
                </div>
            `);
            el.appendTo('#follows_list_area');
        });
    }

    function follow(accessToken, targetUserId, apiType) {
        $.ajax({
            url: endpoint,
            type: "POST",
            data: JSON.stringify({
                "access_token": accessToken,
                "target_user_id": targetUserId,
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
                return false;
            }
            // Ajaxで取得したデータを表示
            console.log(data)
            return data.result;
        }).fail(function (data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

});
