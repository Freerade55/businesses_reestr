
const data = () => {

    const date = localStorage.getItem('date')
    const inn = localStorage.getItem('inn')
    
    getDataByInn('http://127.0.0.1:5020/innSearch', inn, date)
        .then(data => data)
        .catch(error => error.message)


    
  


    
    
}



const getDataByInn = async (url, inn, date) => {
    const res = await fetch(url, {
        method:'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({inn:inn, date: date})

    })
    
    const json = await res.json()
    table(json, inn)

    

}



const table = (json, inn) => {





const searchOn = document.createElement('h1')
searchOn.classList.add('inn-search')
searchOn.innerText = `ПОИСК ПО ИНН: ${inn}`
document.body.append(searchOn)




json.forEach((element, index) => {


    




    let counterAll = 0
    const createTable = document.createElement('div')
    createTable.classList.add('table-div-inn')

    
    const create = document.createElement('table')
    create.classList.add('table', 'table-bordered')

    const thead = document.createElement("thead")

    const tr = document.createElement("tr")
    const fragment = document.createDocumentFragment()

    const th = document.createElement("th")
   
    if (index === 0) {
        th.innerText = 'Юридическое лицо'
        th.colSpan = 6

    }else{
        th.innerText = 'Индивидуальный предприниматель'
        th.colSpan = 6
    }

    



    const tbody = document.createElement("tbody")
    

    for (const key in element) { 
        

        const tr = document.createElement("tr")
        const fragment = document.createDocumentFragment()

        const th = document.createElement("th")
        th.innerText = key
        th.colSpan = 6

        fragment.appendChild(th)
        tr.appendChild(fragment)
        tbody.appendChild(tr)

        let counter = 1
        element[key].forEach(x=> {
            

            

            const tr = document.createElement("tr")
            const fragment = document.createDocumentFragment()

            const id = document.createElement("td")
            id.classList.add('id')
            id.innerText = counter
            counter ++
           
            const orgName = document.createElement("td")
            orgName.innerText = x['Unnamed: 1']

            const inn = document.createElement("td")
            inn.innerText = x['Unnamed: 5']
            
            const rayon = document.createElement("td")
            rayon.innerText = x['Unnamed: 8']

            const city = document.createElement("td")
            city.innerText = x['Unnamed: 9']

            const nasPunkt = document.createElement("td")
            nasPunkt.innerText = x['Unnamed: 10']

            

            fragment.appendChild(id)
            fragment.appendChild(orgName)
            fragment.appendChild(inn)
            fragment.appendChild(rayon)
            fragment.appendChild(city)
            fragment.appendChild(nasPunkt)



            tr.appendChild(fragment)

            // const testTd = document.createElement("td") если надо будет прям один в один
            // testTd.innerText = 'Test'
            // testTd.colSpan = 6

            // const testTr = document.createElement("tr")
            // testTr.appendChild(testTd)


            tbody.appendChild(tr)
            // tbody.appendChild(testTr)

            

        })


      const orgCount = document.createElement("tr")
      const orgTh = document.createElement("th")

      orgTh.innerText = `Итого по ${key}: ${element[key].length}`
      counterAll += element[key].length
      orgTh.colSpan = 6

      orgCount.appendChild(orgTh)
      tbody.appendChild(orgCount)



    }
    
    const alltr = document.createElement("tr")
    const allth = document.createElement("th")
 
    allth.innerText = `Всего по ${th.innerText}: ${counterAll}`
    allth.colSpan = 6
    alltr.appendChild(allth)
    tbody.appendChild(alltr)

    fragment.appendChild(th)
    tr.appendChild(fragment)
    thead.appendChild(tr)
    create.appendChild(thead)
    create.appendChild(tbody)
    
   


    createTable.appendChild(create)
    document.body.append(createTable)
   
});

}


data()





