import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom'

import RadioBox from "components/forms_elements/radiobox";

import SearchButton from 'components/svg/searchButton';
import SearchSimilarButton from 'components/svg/searchSimilarButton';

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject} from 'utils/index';


// Load the lodash build
const _ = require('lodash');

//search by  options
const searchByOptions = [
    {label: 'all', value: 'all'},
    {label: 'author', value: 'author'},
    {label: 'content', value: 'content'},
    {label: 'adv. query', value: 'advanced'}
];

//year options
const startYear = 2017;
const endYear = new Date().getFullYear() + 2;
//create a int array from startYear to endYear, then convert it to string array, after this concatenate with "all"
const yearOptions = ["all", ...(_.range(startYear, endYear).map(String))];

/**
 * standard search form component
 */
const SearchStandardForm = function ({history, queryData, project_id}){

    //state for search form
    const [keywords, setKeyWords] = useState(queryData.query);
    const [source, setSource] = useState({"scopus": queryData.scopus, "googleScholar": queryData.googleScholar, "arXiv": queryData.arXiv});
    const [searchBy, setSearchBy] = useState(queryData.searchBy);
    const [year, setYear] = useState(queryData.year);

    //I update the state every time the query data changes
    useEffect(() => {
        setKeyWords(queryData.query);
        //we can't allow multiple sources yet
        if((queryData.scopus && queryData.arXiv && queryData.googleScholar) || !(queryData.scopus ^ queryData.arXiv ^ queryData.googleScholar)){
            queryData.arXiv = false;
            queryData.scopus = true;
            queryData.googleScholar = false;
        }
        setSource({"scopus": queryData.scopus, "googleScholar": queryData.googleScholar, "arXiv": queryData.arXiv});
        setSearchBy(queryData.searchBy);
        setYear(queryData.year);
    }, [queryData.query, queryData.orderBy, queryData.searchBy, queryData.sort, queryData.year, queryData.start, queryData.count, queryData.scopus, queryData.googleScholar, queryData.arXiv])

    //get data from global context
    const appConsumer = useContext(AppContext);

    /**
     *handle to update hook state by input change
     */
    function handleOnInputChange(event) {

        let newSource;

        switch (event.target.name) {
            case "query":
                setKeyWords(event.target.value);
                break;
            case "scopus":
                //copy the old source
                newSource = {...source};
                //switch between true and false
                newSource.scopus = true;
                newSource.googleScholar = false;
                newSource.arXiv = false;
                setSource(newSource);
                break;

            case "googleScholar":
                //copy the old source
                newSource = {...source};
                //switch between true and false
                newSource.scopus = false;
                newSource.googleScholar = true;
                newSource.arXiv = false;
                setSource(newSource);
                break;
            case "arXiv":
                //copy the old source
                newSource = {...source};
                //switch between true and false
                newSource.scopus = false;
                newSource.googleScholar = false;
                newSource.arXiv = true;
                setSource(newSource);
                break;
            case "searchBy":
                setSearchBy(event.target.value);
                break;
            case "year":
                setYear(event.target.value);
                break;
            default:
                break;
        }

    }

    /*function to send the query*/
    async function handleSendSearch(event) {

        event.preventDefault();

        //if query input is empty
        if (keywords === "") {
            appConsumer.setNotificationMessage("Search string is empty")
        }
        else {
            //synchronize the query data from react state hooks
            queryData.query = keywords;
            queryData.scopus = source.scopus;
            queryData.googleScholar = source.googleScholar;
            queryData.arXiv = source.arXiv;
            queryData.searchBy = searchBy;
            queryData.year = year;

            //send query url
            let queryString = createQueryStringFromObject(queryData);
            //launch to search
            history.push(queryString);

        }

    }

    return (
        <>
            <form className={(queryData.query === "") ? 'search-form' : 'search-form small'}
                  onSubmit={handleSendSearch}>
                {/*search form*/}
                <div style={{position: 'relative'}}>
                    <input
                        type="text"
                        placeholder="search"
                        name="query"
                        value={keywords}
                        onChange={handleOnInputChange}
                    />
                    <Link to={"/projects/" + project_id + "/searchsimilar"}>
                        <button className="go-similar" type="button">
                            <SearchSimilarButton/>
                        </button>
                    </Link>
                    <button className="go-search" type="submit" value="Submit">
                        <SearchButton/>
                    </button>
                </div>

                <div className="option-holder">
                    <label>Source:</label><br/>

                    <div className="checkboxes-holder">
                        <RadioBox label="Scopus" name="scopus" val="" isChecked={source.scopus}
                                  handler={handleOnInputChange}/>
                        <RadioBox label="Google Scholar" name="googleScholar" val="" isChecked={source.googleScholar}
                                  handler={handleOnInputChange}/>
                        <RadioBox label="arXiv" name="arXiv" val="" isChecked={source.arXiv}
                                  handler={handleOnInputChange}/>
                    </div>

                    <label>Search by:</label><br/>

                    <div className="checkboxes-holder">
                        <RadioBox label={searchByOptions[0].label} name="searchBy" val={searchByOptions[0].value}
                                  isChecked={searchBy === searchByOptions[0].value} handler={handleOnInputChange}/>
                        <RadioBox label={searchByOptions[1].label} name="searchBy" val={searchByOptions[1].value}
                                  isChecked={searchBy === searchByOptions[1].value} handler={handleOnInputChange}/>
                        <RadioBox label={searchByOptions[2].label} name="searchBy" val={searchByOptions[2].value}
                                  isChecked={searchBy === searchByOptions[2].value} handler={handleOnInputChange}/>
                        <RadioBox label={searchByOptions[3].label} name="searchBy" val={searchByOptions[3].value}
                                  isChecked={searchBy === searchByOptions[3].value} handler={handleOnInputChange}/>
                    </div>

                    <label>Year:</label><br/>
                    <div className="checkboxes-holder">
                        {
                            yearOptions.map((singleYear, index) =>
                                <RadioBox key={index} label={singleYear} name="year" val={singleYear}
                                          isChecked={year === singleYear} handler={handleOnInputChange}/>
                            )
                        }
                    </div>
                </div>

            </form>
        </>
    );

};


export default SearchStandardForm;