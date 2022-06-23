
import {tableValues} from "./main.js";
import {tableSrednie} from "./main.js";



export const getDates = async (url) => {
    const res = await fetch(url)
    const json = await res.json()
    return parseDates(json)
}






const parseDates = datesJson => {
    const getDates = document.querySelector('select')
    const fragment = document.createDocumentFragment()

    const x = []
    x.push('Дата Импорта')

    Object.values(datesJson).forEach((value, index) => {
        x.push(value.data)
    })

    for (let i = 0; i < 1; i++) {
        x.forEach(i=>{

            if (i === 'Дата Импорта') {
                const option = document.createElement('option')
                option.innerHTML = i
                option.setAttribute('disabled', '')



                fragment.append(option)


            }else{
                const option = document.createElement('option')
                option.classList.add('test')
                option.innerHTML = i

                fragment.append(option)


            }


        })

    }

    getDates.append(fragment)

    dataButtonChoice()



}


const dataButtonChoice = () => {
    

    const a = document.getElementsByTagName('option')
    const b = document.getElementsByTagName('label')
 
    const convertedDates = []


    for (let i of a) {
        
        if (i.innerHTML !== 'Дата Импорта') {

            const changeString = i.innerHTML.split('.')
            changeString.splice(0,3, changeString[2], changeString[1], changeString[0])
            const changeDataToString = changeString.join('-')
        
            convertedDates.push(changeDataToString)   
        }

        

    }
  
 
    let res = convertedDates.sort(function(a,b){
        return new Date(a).valueOf() - new Date(b).valueOf()
       }).slice(-1)[0].replace(/-/g, '.').split('.')

    res.splice(0,3, res[2], res[1], res[0])
    res = res.join('.')
    
    



    let arrayDates = []
    let arrayButtons = []


    for (let i=0; i<a.length; i++){

        a[i].onclick =  function() {

            arrayDates.push(this.outerText)
            if (arrayDates.length !== 0 && arrayButtons.length !== 0) {
                const element = document.querySelector('.table-div')
                if (element !== null) {
                    element.remove()
                   
                }
                arrayDates = arrayDates.slice(-1)
                arrayButtons = arrayButtons.slice(-1)
                tableValues(arrayDates, arrayButtons)

            }

        }

    }

    for (let i=0; i<b.length; i++){

        if (b[i].innerText === 'Среднесписочная численность по региону') {
            b[i].onclick =  function() {
                const element = document.querySelector('.table-div')
                if (element !== null) {
                    element.remove()
                    
                }
                tableSrednie()

            }
        }else{

            b[i].onclick =  function() {

                arrayButtons.push(this.outerText)
                if (arrayDates.length !== 0 && arrayButtons.length !== 0) {
                    const element = document.querySelector('.table-div')
                    if (element !== null) {
                        element.remove()
                       
                    }
                 
                    arrayDates = arrayDates.slice(-1)
                    arrayButtons = arrayButtons.slice(-1)
                  
                    tableValues(arrayDates, arrayButtons)
                }

            }

        }



    }




    for (let i of a) {
        if (i.innerHTML === res) {
            i.click()
            b[0].click()

        }

    }
    


    
}











