import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';
import { Range } from 'react-range';

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

    //state for year slider (not currently used)
    const [values, setValues] = useState([1900, endYear]);

    //I update the state every time the query data changes
    useEffect(() => {
        console.log("query data change effect");
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
    }, [queryData])

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
                //switch between true and false
                queryData.scopus = true;
                queryData.googleScholar = false;
                queryData.arXiv = false;
                break;

            case "googleScholar":
                //switch between true and false
                queryData.scopus = false;
                queryData.googleScholar = true;
                queryData.arXiv = false;
                break;
            case "arXiv":
                //switch between true and false
                queryData.scopus = false;
                queryData.googleScholar = false;
                queryData.arXiv = true;
                break;
            case "searchBy":
                queryData.searchBy = event.target.value;
                break;
            case "year":
                queryData.year = event.target.value;
                break;
            default:
                break;
        }
        
        if(queryData.query){
            history.push(createQueryStringFromObject(queryData));
        }else{
            setSource({"scopus": queryData.scopus, "googleScholar": queryData.googleScholar, "arXiv": queryData.arXiv});
            setSearchBy(queryData.searchBy);
            setYear(queryData.year);
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
                    {/* (year slider, not currently used)
                    <div className="year-slider-holder">
                        <Range
                            step={1}
                            min={1900}
                            max={endYear}
                            values={values}
                            onChange={values => setValues(values)}
                            renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                className={"range-slider"}
                                style={{
                                ...props.style
                                }}
                            >
                                {children}
                            </div>
                            )}
                            renderThumb={({ props }) => (
                            <div
                                {...props}
                                className={"range-thumb"}
                                style={{
                                ...props.style,
                                height: '20px',
                                width: '20px',
                                backgroundColor: 'white'
                                }}
                            />
                            )}
                        />
                        <p className="year-range">{values[0]} to {values[1]}</p>
                    </div>
                    */}
                </div>

            </form>
        </>
    );

};


export default SearchStandardForm;