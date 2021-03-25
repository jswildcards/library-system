if(!localStorage[`user`])
    localStorage[`user`] = JSON.stringify(user)
    
if(!localStorage[`resource`])
    localStorage[`resource`] = JSON.stringify(resource)

let username = ``
let users = JSON.parse(localStorage[`user`])

let countdown = 0

if(localStorage[`sign_in_username`]) {
    if(users.find(function(u) {return u.email == localStorage[`sign_in_username`]}).first_time) {
        location.replace(`reset_password.html`)
    } else {
        location.replace(`index.html`)
    }
}

$(function() {
    $(`[data-toggle="tooltip"]`).tooltip()
    
    $(`#forget_password_form`).addClass(`d-none`)

    $(`#forget_password`).click(function() {
        $(`#sign_in_form`).addClass(`d-none`)
        $(`#forget_password_form`).addClass(`d-block`)
    })

    $(`#sign_in`).click(function() {
        $(`#sign_in_form`).removeClass(`d-none`)
        $(`#forget_password_form`).removeClass(`d-block`)
    })

    $(`#username`).on(`blur`, function() {
        username = ``
        $(this).removeClass(`border-success`)
        $(this).addClass(`border-danger`)
        $(`#username_msg`).addClass(`text-danger`)
        $(`#username_msg`).removeClass(`text-success`)
        $(`#username_msg`).text(`Oops, the username seems wrong!`)

        for(let i in users) {
            if(users[i].email == $(this).val() + $(`#email-tail`).text()) {
                $(this).addClass(`border-success`)
                $(this).removeClass(`border-danger`)
                $(`#username_msg`).removeClass(`text-danger`)
                $(`#username_msg`).addClass(`text-success`)
                $(`#username_msg`).text(`Welcome back! ${users[i].username}`)
                username = $(this).val() + $(`#email-tail`).text()
                break
            }
        }
    })

    $(`#forget_password_username`).on(`blur`, function() {
        username = ``
        $(this).removeClass(`border-success`)
        $(this).addClass(`border-danger`)
        $(`#forget_password_username_msg`).text(`Oops, the username seems wrong!`)

        for(let i in users) {
            if(users[i].email == $(this).val() + $(`#email-tail`).text()) {
                $(this).addClass(`border-success`)
                $(this).removeClass(`border-danger`)
                $(`#forget_password_username_msg`).text(``)
                username = $(this).val() + $(`#email-tail`).text()
                $(`#btn_code`).removeClass(`disabled`)
                $(`#btn_code`).removeAttr(`disabled`)
                $(`#btn_code`).css({cursor: `default`})
                break
            }
        }
    })

    $(`#forget_password_username`).on(`focus`, function() {
        $(this).tooltip(`hide`)
    })

    $(`#sign_in_form`).submit(function(e) {
        e.preventDefault()
        $(this).addClass('was-validated')

        if(!$(`#username`).val())
            $(`#username`).parent().effect(`shake`, { distance: 10, times: 2})
        if(!$(`#password`).val())
            $(`#password`).parent().effect(`shake`, { distance: 10, times: 2})

        let password = $(`#password`).val()
        if(username && password) {
            if(password == users.find(function(u) {return u.email == username}).password) {
                localStorage[`sign_in_username`] = username
                location.reload()
            } else {
                $(`#password`).addClass(`border-danger`)
                $(`#password_msg`).addClass(`text-danger`)
                $(`#password_msg`).html(`Oops! Your password is wrong!`)
            }
        }
    })

    $(`#forget_password_form`).submit(function(e) {
        e.preventDefault()
        $(this).addClass(`was-validated`)
        let forget_user = $(`#forget_password_username`).val() + $(`#email-tail2`).text()
        
        if(forget_user) {
            users.find(function(u) {return u.email == forget_user}).password = default_password
            localStorage[`user`] = JSON.stringify(users)
            $(this).removeClass(`was-validated`)
            $(`#forget_password_username`).val(``)
            $(`#ver_code`).val(``)
            $(`#forget_password_modal`).modal()
        } else {
            $(`#forget_password_username`).parent().effect(`shake`, { distance: 10, times: 2})
        }
    })

    $(`.secret`).click(function(e) {
        $(this).toggleClass(`secret-false btn-outline-secondary btn-danger`)
        $(this).html(`<i class="fas fa-eye${$(this).hasClass(`secret-false`) ? `-slash` : ``}"></i>`)
        $(this).parent().parent().find(`input`).attr(`type`, $(this).parent().parent().find(`input`).attr(`type`) == `text` ? `password` : `text`)
    })

    $(`#btn_code`).click(function(e) {
        countdown = 5
        $(this).addClass(`disabled`)
        $(`#btn_code`).text(`Get Code(${countdown})`)
        $(this).css({cursor: `no-drop`})
        $(this).attr(`disabled`, `disabled`)
        $(`#code_modal`).modal()
        let x = setInterval(function() {
            $(`#btn_code`).text(`Get Code(${--countdown})`)
            if(countdown <= 0) {
                $(`#btn_code`).removeClass(`disabled`)
                $(`#btn_code`).text(`Get Code`)
                $(`#btn_code`).css({cursor: `default`})
                $(`#btn_code`).removeAttr(`disabled`)
                clearInterval(x)
            }
        }, 1000)
    })
})