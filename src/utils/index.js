//need to parse query string of url
import queryString from 'query-string';

//here are the common support function


/**
 * converts the checkboxes object of the search form into parameters for the url
 */
function searchCheckboxesToParams(checkboxes){
    var params = "";
    Object.keys(checkboxes).forEach(key => {//I iterate over each field of the object
        if(key !== "years"){//if it's not an year
            if(checkboxes[key]){//if it's a true flag
                console.log(key)
                params += "&" + key + "=" + checkboxes[key];
            }
        }else{//if it's a year
            if(checkboxes.years.length !== 0){//if there are some years selected
                params += "&" + queryString.stringify({"years" : checkboxes.years} , {arrayFormat: 'comma'});
            }
        }
      });
      return params;
}

/**
 * this is  function to manipolate 2 url string
 * if first string ends with "/", removes "/".
 * then concate wite second string and return new string
 */
function join(base, path){
    let newPath;
    //if the last element is "/"
    if(base.charAt(base.length-1) === '/'){
        newPath = base.slice(0,-1) + path;
    }
    else{
        newPath =base + path;
    }

    return newPath;

  }

/**
 *
 *
 * function to create string of query by queryObject
 * @param queryData query object
 * @return {string} query string
 */
function createQueryStringFromObject(queryData){

    let queryString ="?";
    //create a array of keys
    let keys = Object.keys(queryData);
    //concatenate the object.property
    for(let i =0; i< keys.length; i++){
        //I don't need to sort for the recently added sorting
        if(queryData["orderBy"] !== "date_created" || keys[i] !== "sort"){
            queryString += keys[i]+"="+encodeURIComponent(queryData[keys[i]]);
            //if it isn't the last element, add symbol "&"
            if(i !== (keys.length-1)){
                queryString += "&";
            }
        }
    }
    return queryString;

}


/**
 * get element index of a object array by [key, value]
 * @param array to find
 * @param key to find
 * @param value to find
 * @return {number} index of element, -1 if didn't find
 */
function getIndexOfObjectArrayByKeyAndValue(array ,key, value){
    let index=-1;
    for(let i=0; i<array.length; i++){
        if(array[i][key] === value){
            index = i;
            break;
        }
    }
    return index;
}



export  {
    searchCheckboxesToParams,
    join,
    createQueryStringFromObject,
    getIndexOfObjectArrayByKeyAndValue,

};