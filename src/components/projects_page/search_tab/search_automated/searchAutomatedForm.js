import React, {useContext} from "react";
import Textarea from 'react-textarea-autosize';

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject} from 'utils/index';
import SearchButton from "components/svg/searchButton";

/**
 * automated search form component (unused, we don't allow the user to insert a custom query)
 */
const SearchAutomatedForm = function ({keywords, setKeyWords, history, queryData, description}){

    //get data from global context
    const appConsumer = useContext(AppContext);

    /*handles the submission of a search */
    function handleSendSearch(event) {
        
        event.preventDefault();

        //if query input is empty
        if (keywords === "") {
            appConsumer.setNotificationMessage("Search query is empty")
        }
        else {
            //synchronize the query data from react state hooks
            queryData.query = keywords;
            //set query url
            let queryString = createQueryStringFromObject(queryData);
            //update url
            history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router

        }


    }

    return (
        <>
            <form className='search-automated-form'
                    onSubmit={handleSendSearch}>
            <Textarea
                useCacheForDOMMeasurements
                maxRows={6}
                placeholder="search"
                name="query"
                value={keywords}
                onChange={(e) => {setKeyWords(e.target.value)}}
            />
            <button type="submit" disabled={(keywords === description && !queryData.query)}><SearchButton/></button>
            </form>
        </>
    );

};


export default SearchAutomatedForm;