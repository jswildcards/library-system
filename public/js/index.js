if(!localStorage[`user`])
    localStorage[`user`] = JSON.stringify(user)
    
if(!localStorage[`resource`])
    localStorage[`resource`] = JSON.stringify(resource)

let users = JSON.parse(localStorage[`user`])
let user_in = users.find(function(u) {return u.email == localStorage[`sign_in_username`]})

if(!localStorage[`sign_in_username`])
    location.replace(`sign_in.html`)
else if(users.find(function(u) {return u.email == localStorage[`sign_in_username`]}).first_time)
    location.replace(`reset_password.html`)

let roles = ['teaching staff', `non teaching staff`, `student`, `alumni`]

let tags = {
    hot: `bg-danger`,
    recommanded: `bg-success`,
    beginner: `bg-info`
}

let resource_template = $(`#resource_template`)
let resource_content = resource_template.contents().filter(function() {
    return this.nodeType == 1
})

resource_content = resource_content.toArray()[0]

resource = JSON.parse(localStorage[`resource`])

for(let i in resource) {
    let resource_node = document.importNode(resource_content, true)
    resource_node.setAttribute(`id`, `resource_${i}`)
    resource_node.querySelector(`img`).setAttribute(`src`, `${resource_node.querySelector(`img`).getAttribute(`src`)}&sig=${i}`)
    resource_node.querySelector(`.card-title`).innerHTML = resource[i][`name`]
    resource_node.querySelector(`.book-title`).innerHTML = `${resource[i][`name`]} - ${resource[i][`author`]}`
    resource_node.querySelector(`.author`).innerHTML = `by ${resource[i][`author`]}`
    resource_node.querySelector(`.category`).innerHTML = `<i class="fas fa-th"></i> ${resource[i][`category`]}`
    resource_node.querySelector(`.type`).innerHTML = `<i class="fas fa-swatchbook"></i> ${resource[i][`type`]}`
    resource_node.querySelector(`.year`).innerHTML = `<i class="fas fa-calendar-alt"></i> ${resource[i][`year`]}`
    resource_node.querySelector(`.desc`).innerHTML = resource[i][`description`]
    for(let j in resource[i][`tags`])
        resource_node.querySelector(`.tags`).innerHTML += `<button class="btn badge p-2 ${tags[resource[i][`tags`][j]]} text-light">${resource[i][`tags`][j]}</button> `
    resource_template.parent().append(resource_node)
}

$(`.container-fluid > div > :not(h1):not(h4):not(h5):not(template)`).each(function(i, el) {
    if(i != roles.indexOf(user_in.role))
        $(this).addClass(`d-none`)
})

$(function() {
    $(`h1`).html(`Welcome, ${user_in[`username`]}`)
    $(`h4`).html(`${user_in[`role`]}`)

    $(`#sign_out`).click(function(e) {
        localStorage.removeItem(`sign_in_username`)
        location.reload()
    })

    $(`.container-fluid > *`).fadeIn()
})