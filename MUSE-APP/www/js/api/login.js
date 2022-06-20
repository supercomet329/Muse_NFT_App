$(function () {
    // ログインボタン押下時のイベント
    $('#login-btn').on('click', function(event) {
        // サブミットイベントを無効化
        event.preventDefault();
        // ログイン情報を取得
        let email = $('#loginEmail').val();
        let password = $('#loginPassword').val();
        const apiType = "login";
        // ログインを実行
        login(email, password, apiType);
    })

    // Twitterでログインするボタン押下時のイベント
    $('#twitter_btn').on('click', function() {
        // ログイン情報を取得
        const apiType = "twitter_login";
        // ログインを実行
        twitterLogin(apiType);
    })

    // Googleアカウントでログインするボタン押下時のイベント
    $('#google_btn').on('click', function() {
        // ログイン情報を取得
        const apiType = "google_login";
        // ログインを実行
        googleLogin(apiType);
    })


    // ログインAPIのエンドポイントにAjaxする
    function login (email, password, apiType) {
        $.ajax({
            url: endpoint,
            type: "POST",
            data:{
                "mail_address": email,
                "password": password,
                "api_type": apiType,
            },
        }).done(function(data) {
            // ログインに失敗した場合
            if (!data.result){
                console.log(data.error_message);
                // エラーメッセージをモーダルで表示
                $('#alert_modal').modal('show')
                data.error_message.forEach(e => {
                    let error_message = $(`<p class="text-danger">${e}</p>`);
                    $('#modal_body').append(error_message);
                });
            }
            // Ajaxで取得した値をローカルストレージに保存
            localStorage.setItem('token', data.token);
            console.log(data.result);
            return data.result;
        }).fail(function(data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    // TwitterでログインAPIのエンドポイントにAjaxする
    function twitterLogin (apiType) {
        $.ajax({
            url: endpoint,
            type: "POST",
            data:{
                "api_type": apiType,
            },
        }).done(function(data) {
            // Ajaxで取得した値をローカルストレージに保存
            localStorage.setItem('token', data.token);
            console.log(data.result);
            return data.result;
        }).fail(function(data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

    // GoogleでログインAPIのエンドポイントにAjaxする
    function googleLogin (apiType) {
        $.ajax({
            url: endpoint,
            type: "POST",
            data:{
                "api_type": apiType,
            },
        }).done(function(data) {
            // Ajaxで取得した値をローカルストレージに保存
            localStorage.setItem('token', data.token);
            console.log(data.result);
            return data.result;
        }).fail(function(data) {
            console.log('Ajax fail (communication error)');
            return false;
        });
    }

});
