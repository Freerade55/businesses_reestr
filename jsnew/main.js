
import {getDates} from "./getValues.js";
import {getData} from "./table.js";
import {getSreedchisl} from "./getSreedchisl.js";


(() => {
    getDates('http://127.0.0.1:5020/getDate')
        .then(data => data)
        .catch(error => error.message)
})()








export const tableValues = (date, button) => {
    getData('http://127.0.0.1:5020/getDatas', date, button)
        .then(data => data)
        .catch(error => error.message)
}






export const tableSrednie = () => {
    getSreedchisl('http://127.0.0.1:5020/getsredChisl')
        .then(data => data)
        .catch(error => error.message)
}

















