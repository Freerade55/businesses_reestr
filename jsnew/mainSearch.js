

const data = () => {

    const stringParamsObject = localStorage.getItem('paramsObject')
    getDataByInn('http://127.0.0.1:5020/mainSearch', stringParamsObject)
        .then(data => data)
        .catch(error => error.message)


    
  


    
    
}



const getDataByInn = async (url, stringParamsObject) => {

    const test = JSON.parse(stringParamsObject)

    const res = await fetch(url, {
        method:'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({stringParamsObject:test})

    })
    
    const json = await res.json()
    table(json)

    

}







const table = (json, inn) => {





    const searchOn = document.createElement('h1')
    searchOn.classList.add('inn-search')
    searchOn.innerText = `Test`
    document.body.append(searchOn)
    
    console.log(json)
    const h1 = document.getElementsByTagName('h1')
    let keyChecker = 0
    h1[0].addEventListener('click', callMenu => {


    let count = 20
    
    
    for (let i = 0; i < json.length; i ++) { 
        let counterAll = 0
        
        const tryToFoundurlico = document.getElementById('urlico')
        const tryToFoundIp = document.getElementById('ip')

        if (!tryToFoundurlico && i === 0) {
        const createTable = document.createElement('div')
        createTable.classList.add('table-div-inn')


    
        const create = document.createElement('table')
        create.classList.add('table', 'table-bordered')
    
        const thead = document.createElement("thead")
    
        const tr = document.createElement("tr")
        const fragment = document.createDocumentFragment()
    
        const th = document.createElement("th")
        th.setAttribute('id', 'urlico')
       
        if (i === 0) {
            th.innerText = 'Юридическое лицо'
            th.colSpan = 6
    
        }else{
            th.innerText = 'Индивидуальный предприниматель'
            th.colSpan = 6
        }
    
        
        
        fragment.appendChild(th)
        tr.appendChild(fragment)
        thead.appendChild(tr)
        create.appendChild(thead)
        const tbody = document.createElement("tbody")
        tbody.setAttribute('id', '0')
        create.appendChild(tbody)
    
        createTable.appendChild(create)
        document.body.append(createTable)

        }else if(!tryToFoundIp && i === 1) {

        const createTable = document.createElement('div')
        createTable.classList.add('table-div-inn')


    
        const create = document.createElement('table')
        create.classList.add('table', 'table-bordered')
    
        const thead = document.createElement("thead")
    
        const tr = document.createElement("tr")
        const fragment = document.createDocumentFragment()
    
        const th = document.createElement("th")
        th.setAttribute('id', 'ip')
        
       
        if (i === 0) {
            th.innerText = 'Юридическое лицо'
            th.colSpan = 6
    
        }else{
            th.innerText = 'Индивидуальный предприниматель'
            th.colSpan = 6
        }
    
        
        
        fragment.appendChild(th)
        tr.appendChild(fragment)
        thead.appendChild(tr)
        create.appendChild(thead)
        const tbody = document.createElement("tbody")
        tbody.setAttribute('id', '1')
        create.appendChild(tbody)
    
        createTable.appendChild(create)
        document.body.append(createTable)


        }
       
        
     
        
    
        for (const key in json[i]) { 
            
            const tbody0 = document.getElementById('0')
            const tbody1 = document.getElementById('1')
       
            if (i=== 0) {
                console.log(keyChecker)
                if (keyChecker === 0) {
    
                    const tr = document.createElement("tr")
                    const fragment = document.createDocumentFragment()
            
                    const th = document.createElement("th")
                    th.innerText = key
                    th.colSpan = 6
                   
                
                    fragment.appendChild(th)
                    tr.appendChild(fragment)
                    tbody0.appendChild(tr)
                    keyChecker += 1
                }



                  // let counter = 1

            json[i][key].slice(count, 10).forEach(x=> {
                
                
    
                // const tr = document.createElement("tr")
                // const fragment = document.createDocumentFragment()
    
                // const id = document.createElement("td")
                // id.classList.add('id')
                // id.innerText = counter
                // counter ++
               
                // const orgName = document.createElement("td")
                // orgName.innerText = x['Unnamed: 1']
    
                // const inn = document.createElement("td")
                // inn.innerText = x['Unnamed: 5']
                
                // const rayon = document.createElement("td")
                // rayon.innerText = x['Unnamed: 8']
    
                // const city = document.createElement("td")
                // city.innerText = x['Unnamed: 9']
    
                // const nasPunkt = document.createElement("td")
                // nasPunkt.innerText = x['Unnamed: 10']
    
                
    
                // fragment.appendChild(id)
                // fragment.appendChild(orgName)
                // fragment.appendChild(inn)
                // fragment.appendChild(rayon)
                // fragment.appendChild(city)
                // fragment.appendChild(nasPunkt)
    
    
    
                // tr.appendChild(fragment)
    
                // // const testTd = document.createElement("td") если надо будет прям один в один
                // // testTd.innerText = 'Test'
                // // testTd.colSpan = 6
    
                // // const testTr = document.createElement("tr")
                // // testTr.appendChild(testTd)
    
    
                // tbody.appendChild(tr)
                // // tbody.appendChild(testTr)
    
                
    
            })
    
    
        //   const orgCount = document.createElement("tr")
        //   const orgTh = document.createElement("th")
    
        //   orgTh.innerText = `Итого по ${key}: ${element[key].length}`
        //   counterAll += element[key].length
        //   orgTh.colSpan = 6
    
        //   orgCount.appendChild(orgTh)
        //   tbody.appendChild(orgCount)
    
           
          
            json[i][key].splice(0, count)
            console.log(json[i][key])
            console.log(key)
            if (json[i][key].length === 0) {
                
                delete json[i][key]
                keyChecker = 0
                
                continue
            }else{
                break
            }


             // const alltr = document.createElement("tr")
        // const allth = document.createElement("th")
     
        // allth.innerText = `Всего по ${th.innerText}: ${counterAll}`
        // allth.colSpan = 6
        // alltr.appendChild(allth)
        // tbody.appendChild(alltr)
    
        // create.appendChild(tbody)
        
       
    
    
      
       

        }else if (i === 1) {


            console.log(keyChecker)
            if (keyChecker === 0) {

                const tr = document.createElement("tr")
                const fragment = document.createDocumentFragment()
        
                const th = document.createElement("th")
                th.innerText = key
                th.colSpan = 6
               
            
                fragment.appendChild(th)
                tr.appendChild(fragment)
                tbody1.appendChild(tr)
                keyChecker += 1
            }



              // let counter = 1

        json[i][key].slice(count, 10).forEach(x=> {
            
            

            // const tr = document.createElement("tr")
            // const fragment = document.createDocumentFragment()

            // const id = document.createElement("td")
            // id.classList.add('id')
            // id.innerText = counter
            // counter ++
           
            // const orgName = document.createElement("td")
            // orgName.innerText = x['Unnamed: 1']

            // const inn = document.createElement("td")
            // inn.innerText = x['Unnamed: 5']
            
            // const rayon = document.createElement("td")
            // rayon.innerText = x['Unnamed: 8']

            // const city = document.createElement("td")
            // city.innerText = x['Unnamed: 9']

            // const nasPunkt = document.createElement("td")
            // nasPunkt.innerText = x['Unnamed: 10']

            

            // fragment.appendChild(id)
            // fragment.appendChild(orgName)
            // fragment.appendChild(inn)
            // fragment.appendChild(rayon)
            // fragment.appendChild(city)
            // fragment.appendChild(nasPunkt)



            // tr.appendChild(fragment)

            // // const testTd = document.createElement("td") если надо будет прям один в один
            // // testTd.innerText = 'Test'
            // // testTd.colSpan = 6

            // // const testTr = document.createElement("tr")
            // // testTr.appendChild(testTd)


            // tbody.appendChild(tr)
            // // tbody.appendChild(testTr)

            

        })


    //   const orgCount = document.createElement("tr")
    //   const orgTh = document.createElement("th")

    //   orgTh.innerText = `Итого по ${key}: ${element[key].length}`
    //   counterAll += element[key].length
    //   orgTh.colSpan = 6

    //   orgCount.appendChild(orgTh)
    //   tbody.appendChild(orgCount)

       
      
        json[i][key].splice(0, count)
        console.log(json[i][key])
        console.log(key)
        if (json[i][key].length === 0) {
            
            delete json[i][key]
            keyChecker = 0
            
            continue
        }else{
            break
        }


         // const alltr = document.createElement("tr")
    // const allth = document.createElement("th")
 
    // allth.innerText = `Всего по ${th.innerText}: ${counterAll}`
    // allth.colSpan = 6
    // alltr.appendChild(allth)
    // tbody.appendChild(alltr)

    // create.appendChild(tbody)
    
   



        }
        
     

     }
     console.log(Object.keys(json[i]))
     if (Object.keys(json[i]).length !== 0) {break}
              
            }
           
           });
    
    }
    
















data()