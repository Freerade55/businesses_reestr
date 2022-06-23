
export const trUse = []


const leftClickMenu = document.querySelector('.left-click-menu')
leftClickMenu.children[5].addEventListener("click", callMenu => {
    leftClickMenu.classList.remove("active")


})

const orgTypeMenu = document.querySelector('.org-type-menu')



orgTypeMenu.children[12].addEventListener("click", callMenu => {
    orgTypeMenu.classList.remove("active")


})









const radioMenu = document.querySelectorAll('[id = "flexCheckDefault"]')
const selectAll = document.querySelector('.selectAll')


const cancelAll = document.querySelector('.cancelAll')

selectAll.addEventListener( "click", event => {
    for (let i = 0; i < radioMenu.length; i ++) {
        
        radioMenu[i].checked = true
    }
    

})

cancelAll.addEventListener( "click", event => {
    for (let i = 0; i < radioMenu.length; i ++) {
        
        radioMenu[i].checked = false
    }
    

})





leftClickMenu.children[4].addEventListener("click", callMenu => {


    const date = leftClickMenu.children[0].innerHTML.split(' ').slice(-1)[0]
    const inputData = leftClickMenu.children[2].children[0].value

    

    if(inputData.length < 3) {
        alert('Введите не менее трех цифр')
    }else{
        localStorage.removeItem('date')
        localStorage.removeItem('inn')
        localStorage.setItem('date', date)
        localStorage.setItem('inn', inputData)
        window.open('./innTable.html', '_blank')

    }

   
   

})




orgTypeMenu.children[11].addEventListener("click", callMenu => {
  
    const paramsObject = {
        date: [],
        types: [],
        inn: [],
        okved: [],
        rayon: [],
        vnovSozd: []

        
    }
    paramsObject.date.push(orgTypeMenu.children[2].innerText.split(' ').slice(-1).join())
    if (orgTypeMenu.children[5].children[0].value !== '') {
        paramsObject.inn.push(orgTypeMenu.children[5].children[0].value)

    }
    if (orgTypeMenu.children[8].children[0].value !== '') {
        paramsObject.okved.push(orgTypeMenu.children[8].children[0].value)
    }
  

    const flexCheckDefault = document.querySelectorAll('[id = "form-checkDefault"]')
    const flexCheck = document.querySelectorAll('[id = "flexCheck"]')
    


    flexCheckDefault.forEach(x=>{
        if (x.children[0].checked !== false) {
            
            paramsObject.types.push(x.children[1].innerText)

        }
      
    })
    

    flexCheck.forEach(x=>{

        if (x.children[0].checked !== false) {
            if (x.children[1].innerText === 'Вновь созданные') {
                paramsObject.vnovSozd.push(x.children[1].innerText)

            }else{
                paramsObject.rayon.push(x.children[1].innerText)
            }
            

        }
    })
 
 
  

    localStorage.removeItem('paramsObject')
    localStorage.setItem('paramsObject', JSON.stringify(paramsObject))
    window.open('./mainSearch.html', '_blank')
})







export const listenerToTags = (date) => {
   
    
   
    const getTbody = document.querySelectorAll("tbody");
    
    const menuArea = getTbody[0].childNodes
    
    const menu = document.querySelector(".right-click-menu");
    const textArea1 = 'Список организаций по'
    const textArea2 = 'Статистика по МСП'

    const addListenerToRightClickMenu = document.getElementById("l2");

    const addListenerToRightClickMenuSpOrg = document.getElementById("l1");

    const leftClickMenu = document.querySelector('.left-click-menu')

    const orgTypeMenu = document.querySelector('.org-type-menu')

    


    const tableGet = document.querySelector('div.table-div')
    menuArea.forEach(x=> {

        x.addEventListener( "contextmenu", event => {

            
            menu.children[0].innerHTML = textArea1
            menu.children[2].innerHTML = textArea2
            
            menu.children[0].innerHTML = `${menu.children[0].innerHTML} ${event.path[1].children[0].innerHTML}`

            menu.children[2].innerHTML = `${menu.children[2].innerHTML} (${event.path[1].children[0].innerHTML})`


            event.preventDefault();
            
            menu.style.top = `${event.clientY}px`;
            menu.style.left = `${event.clientX}px`;
            menu.classList.add("activeRight");
        });



    
        x.addEventListener( "click", event => {

           
            const checkTr = document.getElementsByClassName('tr-background')
          
            if (checkTr.length === 0) {
                x.classList.add('tr-background')
                trUse.push(x.children[0].innerHTML)
                
            }else{
                checkTr[0].classList.remove('tr-background')
                x.classList.add('tr-background')
                trUse.push(x.children[0].innerHTML)
            }
                

        })



     




       
       

    })


    
    tableGet.addEventListener("contextmenu", event => {
        if (!!document.querySelector('.active')) {
            menu.classList.remove("activeRight");

        }
      

    })

    tableGet.addEventListener("click", event => {
        
        if (!!document.querySelector('.activeRight') && !document.querySelector('.active')) {
            menu.classList.remove("activeRight");
            
            
        }

     


    });





  
    addListenerToRightClickMenu.addEventListener("click", callMenu => {
        const defaultDataName = 'Дата:'
        leftClickMenu.children[0].innerHTML = defaultDataName
        
        leftClickMenu.children[0].innerHTML = `${leftClickMenu.children[0].innerHTML} ${date}`
        
        // leftClickMenu.style.top = `${callMenu.clientY}px`;
        // leftClickMenu.style.left = `${callMenu.clientX}px`;
        leftClickMenu.classList.add("active");
        

        if (!!document.querySelector('.active')) {
            
            menu.classList.remove("activeRight")
          
           
        }

        

    })



    addListenerToRightClickMenuSpOrg.addEventListener("click", callMenu => {
     
        const splitEvent = callMenu.path[0].innerHTML.split(' ')
        const concat = []
        splitEvent.forEach(x=>{
            let counter = 0
            for(let value in x) {
                if(x[value] !== x[value].toUpperCase()) {
                counter ++
                }

            }
            if (counter === 0) [
                concat.push(x)
            ]
        })
        const stringConcat = concat.join(' ')
        // orgTypeMenu.style.top = `${callMenu.clientY}px`;
        // orgTypeMenu.style.left = `${callMenu.clientX}px`;
        const defaultDataName = 'Дата:'
        
        orgTypeMenu.children[2].innerHTML = defaultDataName
        orgTypeMenu.children[2].innerHTML = `${orgTypeMenu.children[2].innerHTML} ${date}`
        orgTypeMenu.children[9].children[1].innerHTML = stringConcat
        
        orgTypeMenu.classList.add("active");
        
        if (!!document.querySelector('.active')) {
            
            menu.classList.remove("activeRight")
          
           
        }
    


    })


    


}
































