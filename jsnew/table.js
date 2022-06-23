import {listenerToTags} from "./addListener.js";
import { trUse } from "./addListener.js";

export const getData = async (url, date, button) => {
    const res = await fetch(url, {
        method:'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({data:date[0], button: button[0]}),

    })
    const json = await res.json()
    return data(json, date)
}





const data = (json, date) => {

    const name_type = ["Район","ЮЛ", "ИП"]

    const org_type = ["Микро", "Малые", "Средние", "Всего"]
    const array = []
    json.forEach(x=> {
        delete x.Id
        array.push([x.rayon, x.micro_ur, x.malye_ur, x.srednie_ur, x.vsego_ur,
            x.micro_ip, x.malye_ip, x.srednie_ip, x.vsego_ip])


    })




    getHeader(name_type, org_type)

    getTableData(array, date)

}








const getHeader = (name_type, org_type) => {

    const createTable = document.createElement('div')
    createTable.classList.add('table-div')




    const create = document.createElement('table')
    create.classList.add('table', 'table-bordered')

    createTable.append(create)
    document.body.append(createTable)


    const table = document.querySelector(".table, .table-bordered")
    const thead = document.createElement("thead")

    for (let i = 0; i <= 1; i ++) {

        const tr = document.createElement("tr")
        const fragment = document.createDocumentFragment()

        if (i === 0 ) {

            name_type.forEach((x, index) => {
                const th = document.createElement("th")
                th.innerText = x

                if (x !== 'Район') {
                    if (x === 'ЮЛ') {
                        th.style.cssText = `
                background:rgb(132,152,250)
                `
                    }else{
                        th.style.cssText = `
                background:rgb(199,4,4)
                `
                    }

                }


                if (index === 0) {
                    th.rowSpan = 2

                }else{
                    th.colSpan = 4
                }

                fragment.appendChild(th)
            })

        } else {
            for (let p = 0; p <= 1; p ++) {
                org_type.forEach(x => {
                    const th = document.createElement("th")
                    th.innerText = x
                    fragment.appendChild(th)
                })

            }

        }

        tr.appendChild(fragment)
        thead.appendChild(tr)
        table.appendChild(thead)

    }


}




const getTableData = (data, date) => {
    const table = document.querySelector(".table, .table-bordered")
    const tbody = document.createElement("tbody")

    data.forEach(x=> {

        const tr = document.createElement("tr")
        const fragment = document.createDocumentFragment()

        x.forEach(y=> {
            const td = document.createElement("td")

            td.innerText = y

            fragment.appendChild(td)



        })
        
        tr.appendChild(fragment)
        tbody.appendChild(tr)
        table.appendChild(tbody)


    })

    
   
    listenerToTags(date)

    if (trUse.length !== 0) {
        const getTr = document.querySelectorAll("tr");

        getTr.forEach(x=>{
            if (trUse.slice(-1)[0] === x.children[0].innerHTML) {
                x.classList.add('tr-background')
        }
        })
    


    }
    
    

}








