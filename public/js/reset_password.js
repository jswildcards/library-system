if(!localStorage[`user`])
    localStorage[`user`] = JSON.stringify(user)
    
if(!localStorage[`resource`])
    localStorage[`resource`] = JSON.stringify(resource)

let username = ``
let users = JSON.parse(localStorage[`user`])

if(!localStorage[`sign_in_username`])
    location.replace(`sign_in.html`)
else if(!users.find(function(u) {return u.email == localStorage[`sign_in_username`]}).first_time)
    location.replace(`index.html`)

let password_length = [1, 6, 10, 14]
let strength_class = [`bg-danger`, `bg-warning`, `bg-info`, `bg-success`, `w-25`, `w-50`, `w-75`, `w-100`]

$(function() {
    $(`#username`).val(localStorage[`sign_in_username`])

    $(`#alert_head`).css({display: `none`})
    $(`#alert_head`).slideDown()

    $(`#password`).on(`input`, function() {
        let strength = $(`#password_strength`)
        let len = $(this).val().length

        for(let i in strength_class)
            strength.removeClass(strength_class[i])

        if(len >= password_length[3]) {
            strength.addClass(`w-100`)
            strength.addClass(`bg-success`)
            $(`#strength_word`).html(`<i class="fas fa-dumbbell"></i>: Very Strong`)
        } else if(len >= password_length[2] && len < password_length[3]) {
            strength.addClass(`w-75`)
            strength.addClass(`bg-info`)
            $(this).parent().find(`.fa-unlock`).toggleClass(`fa-unlock fa-lock`)
            $(`#strength_word`).html(`<i class="fas fa-dumbbell"></i>: Strong`)
        } else if(len >= password_length[1] && len < password_length[2]) {
            strength.addClass(`w-50`)
            strength.addClass(`bg-warning`)
            $(this).parent().find(`.fa-lock`).toggleClass(`fa-unlock fa-lock`)
            $(`#strength_word`).html(`<i class="fas fa-dumbbell"></i>: Weak`)
        } else if(len >= password_length[0] && len < password_length[1]) {
            strength.addClass(`w-25`)
            strength.addClass(`bg-danger`)
            $(`#strength_word`).html(`<i class="fas fa-dumbbell"></i>: Very Weak`)
        } else {
            $(`#strength_word`).html(`<i class="fas fa-dumbbell"></i>: Missing`)
        }
    })

    $(`#reset_password_form`).submit(function(e) {
        e.preventDefault()
        $(this).addClass('was-validated')

        let password = $(`#password`).val()
        let password_confirm = $(`#password_confirm`).val()

        if(!password)
            $(`#password`).parent().effect(`shake`, { distance: 10, times: 2})
        if(!password_confirm)
            $(`#password_confirm`).parent().effect(`shake`, { distance: 10, times: 2})

        if(password && password_confirm) {
            if(password == password_confirm) {
                if($(`#password_strength`).attr(`class`).split(` `).find(function(el) {return el.search(`w-`) > -1}).replace(`w-`, ``) > 50) {
                    let user = users.find(function(u) {return u.email == localStorage[`sign_in_username`]})
                    user.password = password
                    user.first_time = false
                    localStorage[`user`] = JSON.stringify(users)
                    location.reload()
                } else {
                    $('#weak_password_modal').modal()
                    $(`#password`).addClass(`border-danger`)
                    $(`#password`).parent().effect(`shake`, { distance: 10, times: 2})
                }
            } else {
                $('#wrong_password_confirm_modal').modal()
                $(`#password_confirm`).addClass(`border-danger`)
                $(`#password_confirm`).parent().effect(`shake`, { distance: 10, times: 2})
            }
        }
    })

    $('#wrong_password_confirm_modal').on(`hidden.bs.modal`, function(e) {
        $(`#password_confirm`).removeClass(`border-danger`)
        $(`#password_confirm`).val(``)
    })

    $('#weak_password_modal').on(`hidden.bs.modal`, function(e) {
        $(`#password`).removeClass(`border-danger`)
        $(`#password`).val(``)
        $(`#password`).trigger(`input`)
    })

    $(`#sign_out`).click(function(e) {
        e.preventDefault()
        localStorage.removeItem(`sign_in_username`)
        location.reload()
    })

    $(`.secret`).click(function(e) {
        $(this).toggleClass(`secret-false btn-outline-secondary btn-danger`)
        $(this).html(`<i class="fas fa-eye${$(this).hasClass(`secret-false`) ? `-slash` : ``}"></i>`)
        $(this).parent().parent().find(`input`).attr(`type`, $(this).parent().parent().find(`input`).attr(`type`) == `text` ? `password` : `text`)
    })
})