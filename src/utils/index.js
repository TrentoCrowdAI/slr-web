//need to parse query string of url
import queryString from 'query-string';

//here are the common support function

/**
 * compares two arrays of objects
 */
function arrayOfObjectsEquals(a, b) {

    if (a === null || b === null) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }

    a.sort();
    b.sort();


    for (var i = 0; i < a.length; ++i) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
            return false;
        }
    }

    return true;
}

/**
 * checks if B is contained in A, using a key to check the inclusion
 * @param {array} a
 * @param {array} b
 * @param {string} key (object field)
 */
function arrayOfObjectsContains(a, b, key) {

    if (a === null || b === null) {
        return false;
    }
    if (a.length === 0 || b.length === 0) {
        return false;
    }

    //iterate over all elements of B and check if A contains it 
    //by checking wether and element in A has the same key as the selected B element(b[i])
    for (let i = 0; i < b.length; ++i) {
        //if doesn't contain the given element then it meand that the vector A doesn't include the vector B
        if (!a.some(e => e[key] === b[i][key])) {
            return false;
        }
    }

    return true;
}

/**
 * converts the checkboxes object of the search form into parameters for the url
 */
function searchCheckboxesToParams(checkboxes) {
    var params = "";
    Object.keys(checkboxes).forEach(key => {//I iterate over each field of the object
        if (key !== "years") {//if it's not an year
            if (checkboxes[key]) {//if it's a true flag
                console.log(key)
                params += "&" + key + "=" + checkboxes[key];
            }
        }
        else {//if it's a year
            if (checkboxes.years.length !== 0) {//if there are some years selected
                params += "&" + queryString.stringify({"years": checkboxes.years}, {arrayFormat: 'comma'});
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
function join(base, path) {
    let newPath;
    //if the last element is "/"
    if (base.charAt(base.length - 1) === '/') {
        newPath = base.slice(0, -1) + path;
    }
    else {
        newPath = base + path;
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
function createQueryStringFromObject(queryData) {

    let queryString = "?";
    //create a array of keys
    let keys = Object.keys(queryData);
    //concatenate the object.property
    for (let i = 0; i < keys.length; i++) {
        //I don't need to sort for the recently added sorting
        if (queryData["orderBy"] !== "date_created" || keys[i] !== "sort") {
            queryString += keys[i] + "=" + encodeURIComponent(queryData[keys[i]]);
            //if it isn't the last element, add symbol "&"
            if (i !== (keys.length - 1)) {
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
function getIndexOfObjectArrayByKeyAndValue(array, key, value) {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * function to prepare a object of queryData
 * @param query
 * @return object of queryData for the fetch
 */
function createQueryDataForFiltersTab(query){

    //set query params from queryString of url
    let params = queryString.parse(query);
    let count = params.count || 10;
    let start = params.start || 0;
    let orderBy = params.orderBy || "date_created";
    let sort = params.sort || "ASC";

    if(orderBy === "date_created"){
        sort = "DESC";
    }

    let queryData = {orderBy, sort, start, count};
    return queryData;

}

/**
 * function to prepare a object of queryData
 * @param queryUrl
 * @return object of queryData for the fetch
 */
function createQueryDataForAutomatedSearch(queryUrl) {


    //set query params from queryString of url
    let params = queryString.parse(queryUrl);
    let query = params.query || undefined;

    let start = params.start || 0;
    let count = params.count || 10;

    let queryData = {query, start, count};

    return queryData;

}


/**
 * function to prepare a object of queryData
 * @param queryUrl
 * @return object of queryData for the fetch
 */
function createQueryDataForStandardSearch(queryUrl) {


    //set query params from queryString of url
    let params = queryString.parse(queryUrl);
    let query = params.query || "";

    let searchBy = params.searchBy || "all";
    let orderBy = params.orderBy || "title";
    let sort = params.sort || "ASC";
    let start = params.start || 0;
    let count = params.count || 10;


    let scopus;
    if (params.scopus === undefined) {
        scopus = true;
    }
    else {
        scopus = (params.scopus === "true");
    }

    let googleScholar = (params.googleScholar === "true" && !scopus);
    let arXiv = (params.arXiv === "true" && !scopus && !googleScholar);

    if(!scopus && !googleScholar && !arXiv){
        scopus = true;
    }

    let year = params.year || "all";

    let queryData = {query, searchBy, orderBy, sort, scopus, googleScholar, arXiv, year, start, count};

    return queryData;

}

export {
    arrayOfObjectsEquals,
    arrayOfObjectsContains,
    searchCheckboxesToParams,
    join,
    createQueryStringFromObject,
    getIndexOfObjectArrayByKeyAndValue,
    createQueryDataForFiltersTab,
    createQueryDataForAutomatedSearch,
    createQueryDataForStandardSearch

};