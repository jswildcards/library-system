if(!localStorage[`user`])
    localStorage[`user`] = JSON.stringify(user)
    
if(!localStorage[`resource`])
    localStorage[`resource`] = JSON.stringify(resource)

let username = ``
let users = JSON.parse(localStorage[`user`])

if(!localStorage[`sign_in_username`])
    location.replace(`sign_in.html`)
else if(users.find(function(u) {return u.email == localStorage[`sign_in_username`]}).first_time)
    location.replace(`reset_password.html`)

let tags = {
    hot: `bg-danger`,
    recommanded: `bg-success`,
    beginner: `bg-info`
}

let showing_list = []
let tags_included = []

$(function() {
    $( "#slider-range" ).slider({
        range: true,
        min: 1965,
        max: 2018,
        values: [ 1965, 2018 ],
        slide: function( event, ui ) {
            $( "#year" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] )
            $(`#search`).trigger(`input`)
        }
    })
    
    $( "#year" ).val($( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ))

    $(`#year`).click(function() {
        $(`#slider-range`).parent().effect(`highlight`)
    })

    let init = function() {
        if(!localStorage[`user`])
            localStorage[`user`] = JSON.stringify(user)
            
        if(!localStorage[`resource`])
            localStorage[`resource`] = JSON.stringify(resource)

        let resource_template = $(`#resource_template`)
        let resource_content = resource_template.contents().filter(function() {
            return this.nodeType == 1
        })
        
        resource_content = resource_content.toArray()[0]

        let resource = JSON.parse(localStorage[`resource`])

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

        $(`#resources > :not(template):not(nav):not(#recycle_list)`).each(function(i, el) {
            if(i > 4)
                $(this).addClass(`d-none`)
            showing_list.push($(el))
        })

        // $(`.pagination`).html(`
        //     <li class="page-item" data-page="-">
        //         <a class="page-link" aria-label="Previous">
        //             <span aria-hidden="true">&laquo;</span>
        //             <span class="sr-only">Previous</span>
        //         </a>
        //     </li>
        // `)

        let pages = Math.ceil($(`#resources > :not(template):not(nav):not(#recycle_list)`).length / 5)

        $(`.pagination`).html(``)

        for(let i = 0; i < 3 ; i ++)
            $(`.pagination`).append(`<li class="page-item" data-page="${i+1}"><a class="page-link">${i+1}</a></li>`)

        $(`.pagination`).append(`<li class="page-item" data-page="..."><a class="page-link">...</a></li>`)

        for(let i = 3; i < pages - 1 ; i ++)
            $(`.pagination`).append(`<li class="page-item d-none" data-page="${i+1}"><a class="page-link">${i+1}</a></li>`)

        $(`.pagination`).append(`<li class="page-item" data-page="${pages}"><a class="page-link">${pages}</a></li>`)
        
        // $(`.pagination`).append(`
        //     <li class="page-item" data-page="+">
        //         <a class="page-link" aria-label="Next">
        //             <span aria-hidden="true">&raquo;</span>
        //             <span class="sr-only">Next</span>
        //         </a>
        //     </li>
        // `)

        $(`[data-page="1"]`).addClass(`active`)

        // $(`#resources`).append($(`#resources > nav`).clone().removeClass(`d-none`))
    }

    init()

    $(`#sign_out`).click(function(e) {
        localStorage.removeItem(`sign_in_username`)
        location.reload()
    })

    $(`#search_clear`).click(function(e) {
        $(`#search`).val(``)
        $(`#search`).trigger(`input`)
    })

    $(`[data-toggle="button"]`).click(function(e) {
        let tag = $(this).text()
        if(tags_included.includes(tag))
            tags_included.pop(tag)
        else
            tags_included.push(tag)
        search()
    })

    $(`[data-page]`).click(function(e) {
        if($.grep($(this).attr(`class`).split(` `),function(n, i) { return n == "active" }).length <= 0) {
            let page_num = $(this).attr(`data-page`)

            if(!isNaN(parseInt(page_num))) {
                $.each(showing_list, function(i, el) {
                    if(i < (page_num - 1) * 5 || i > page_num * 5 - 1)
                        $(this).addClass(`d-none`)
                    else {
                        $(this).removeClass(`d-none`)
                        $(this).css({display: `none`})
                        $(this).fadeIn()
                    }
                })

                $(`.pagination > .active`).removeClass(`active`)
                $(this).addClass(`active`)

                $(`#searched_result`).html(`Searched: ${showing_list.length}, Showing: ${(page_num - 1) * 5 + 1 > showing_list.length ? 0 : (page_num - 1) * 5 + 1} - ${(page_num - 1) * 5 + 1 > showing_list.length ? 0 : (page_num * 5 < showing_list.length ? page_num * 5 : showing_list.length)}`)

                // $(`.pagination`).html(`
                //     <li class="page-item" data-page="-">
                //         <a class="page-link" aria-label="Previous">
                //             <span aria-hidden="true">&laquo;</span>
                //             <span class="sr-only">Previous</span>
                //         </a>
                //     </li>
                // `)
        
                // let pages = Math.ceil(showing_list.length / 5)
        
                // $(`.pagination`).append(`<li class="page-item" data-page="1"><a class="page-link">1</a></li>`)

                // for(let i = page_num - 1; i < page_num + 2; i ++) {
                //     console.log(i)
                //     $(`.pagination`).append(`<li class="page-item ${i == page_num ? 'active' : ''}" data-page="${i}"><a class="page-link">${i}</a></li>`)
                // }
        
                // if(page_num != pages.length) {
                //     $(`.pagination`).append(`<li class="page-item"><a class="page-link"">...</a></li>`)
                //     $(`.pagination`).append(`<li class="page-item" data-page="${pages}"><a class="page-link">${pages}</a></li>`)
                // }
                
                // $(`.pagination`).append(`
                //     <li class="page-item" data-page="+">
                //         <a class="page-link" aria-label="Next">
                //             <span aria-hidden="true">&raquo;</span>
                //             <span class="sr-only">Next</span>
                //         </a>
                //     </li>
                // `)
            } else if(page_num == `...`) {
                // let msg = ``
                
                // for(let i = parseInt($(this).prev().attr(`data-page`)) + 1; i < parseInt($(this).next().attr(`data-page`)); i ++)
                //     msg += `<li class="page-item" data-page="${i}"><a class="page-link">${i}</a></li>`

                // $(this).parent().html($(this).parent().html().replace($(this).prop(`outerHTML`), msg))
                $(this).parent().children().each(function(i, el) {
                    $(el).removeClass(`d-none`)
                })

                $(this).addClass(`d-none`)
                $(this).appendTo(`#recycle_list`)
            }
        }
    })

    $(`#search`).on(`input`, function() {
        search()
    })

    $(`#category`).on(`change`, function() {
        search()
    })

    $(`#type`).on(`change`, function() {
        search()
    })

    let search = function() {
        showing_list = []
        let keyword = new RegExp($(`#search`).val(), `i`)
        let length = $(`#search`).val().length

        $("#resources > :not(template):not(nav):not(#recycle_list)").each(function(i, el) {
            let title = $(el).find(`.book-title`).text()
            // let target = $(el).find(`.card-title`)
            // target.html(title)
            $(el).addClass(`d-none`)

            let index = title.search(keyword)
            // console.log(index)
            // console.log(index + length)
            if(index > -1) {
                if((tags_included.length <= 0 || tags_included.some(r =>resource[$(el).attr(`id`).replace(`resource_`, ``)][`tags`].indexOf(r) >= 0))
                    && ($(`#category`).val() == `all` || $(`#category`).val() == resource[$(el).attr(`id`).replace(`resource_`, ``)][`category`])
                    && (resource[$(el).attr(`id`).replace(`resource_`, ``)][`year`] >= $(`#year`).val().split(` - `)[0] && resource[$(el).attr(`id`).replace(`resource_`, ``)][`year`] <= $(`#year`).val().split(` - `)[1])
                    && ($(`#type`).val() == `all` || $(`#type`).val() == resource[$(el).attr(`id`).replace(`resource_`, ``)][`type`])) {
                    showing_list.push($(el))
                    // $(el).removeClass(`d-none`)
                    let paras = [title.substring(0, index), title.substring(index, index + length), title.substring(index + length, title.length)]

                    paras[1] = `<span style='color: red;'>${paras[1]}</span>`

                    $(el).find(`.card-title`).html(paras.join(``).split(` - `)[0])
                    $(el).find(`.author`).html(`by ${paras.join(``).split(` - `)[1]}`)
                }
            }

        // let keywords = $(this).val().trim().split(` `)
            // $.each(keywords, function(key, value) {
            //     let keyword = new RegExp(value, `ig`)
            //     // let index = target.html().search(keyword)
                
            //     // TODO: o should be between re1 and re2, not exactly the same position
            //     let array = []
            //     let re1 = new RegExp(`<span style='color: red;'>`, `ig`)
            //     let re2 = new RegExp(`</span>`, `ig`)
            //     while((ex = re1.exec(target.html())) != null)
            //         array.push(ex.index)
            //     while((ex = re2.exec(target.html())) != null)
            //         array.push(ex.index)
                

            //     while ((match = keyword.exec(target.html())) != null) {
            //         if(array.includes(match.index))
            //             continue

            //         $(el).removeClass(`d-none`)
            //         let paras = [target.html().substring(0, match.index), target.html().substring(match.index, match.index + value.length), target.html().substring(match.index + value.length, target.html().length)]

            //         paras[1] = `<span style='color: red;'>${paras[1]}</span>`

            //         console.log(paras)
            //         console.log(paras.join(``))
            //         target.html(paras.join(``))

            //         // target.html(target.html().replace(keyword, `<span style='color: red;'>${value}</span>`))

            //         // TODO: o should be between re1 and re2, not exactly the same position
            //         array = []
            //         while((ex = re1.exec(target.html())) != null)
            //             array.push([ex.index])
            //         while((ex = re2.exec(target.html())) != null)
            //             array.push(ex.index)
                    
            //         console.log(array)
            //     }
            // })
        })

        showing_list.slice(0, 5).forEach(function(el) {
            el.removeClass(`d-none`)
            el.css({display: `none`})
            el.fadeIn()
            // el.animate({marginLeft: `0`}, {queue: false})
        })

        let page_num = Math.ceil(showing_list.length / 5)
        let last_page = $(`.pagination > *`)[$(`.pagination > *`).length - 1]

        console.log(page_num + ` ` + $(last_page).attr(`data-page`))
        // console.log($(last_page).attr(`data-page`))
        // console.log( $(`.pagination > [data-page="8"]`))

        if(parseInt($(last_page).attr(`data-page`)) > page_num) {
            for(let i = page_num + 1; i <= parseInt($(last_page).attr(`data-page`)); i ++) {
                console.log(`hu` + i)
                $(`.pagination > [data-page="${i}"]`).appendTo(`#recycle_list`)
            }
        } else {
            for(let i = parseInt($(last_page).attr(`data-page`)) + 1; i <= page_num; i ++) {
                console.log(i)
                $(`#recycle_list > [data-page="${i}"]`).appendTo(`.pagination`)
            }
        }
        
        $(`.pagination > li`).each(function(i, el) {
            $(el).removeClass(`active`)
        })

        $(`[data-page="1"]`).addClass(`active`)

        $(`#searched_result`).html(`Searched: ${showing_list.length}, Showing: ${showing_list.length ? 1 : 0} - ${showing_list.length >= 5 ? "5" : showing_list.length}`)
    }
})