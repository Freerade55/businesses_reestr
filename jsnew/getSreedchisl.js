

export const getSreedchisl = async (url) => {

    const res = await fetch(url)
    const json = await res.json()

    return parseSrednie(json)
}






const parseSrednie = json => {

    const NameType = ["Дата", "Район", "Всего", "Из них"]

    const LicoType = ["ЮЛ", "ИП"]

    const array = []
    json.forEach(x=> {
        array.push([x.data, x.rayon, x.vsego, x.ur, x.ip])

    })




    getHeader(NameType, LicoType)
    //
    getTableSrednie(array)

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

                if (index === 3) {
                    th.colSpan = 2

                }else{

                    th.rowSpan = 2

                }



                fragment.appendChild(th)

            })





        }else{

            org_type.forEach(x => {
                const th = document.createElement("th")
                th.innerText = x

                if (x === 'ЮЛ') {
                        th.style.cssText = `
                background:rgb(132,152,250)
                `
                    }else if (x === 'ИП') {

                    th.style.cssText = `
                background:rgb(199,4,4)
                `
                }


                fragment.appendChild(th)


            })


        }

        tr.appendChild(fragment)
        thead.appendChild(tr)
        table.appendChild(thead)

    }





}




const getTableSrednie = data => {
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






}





