import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';
import LoadIcon from "components/svg/loadIcon";

import {projectFiltersDao} from 'dao/projectFilters.dao';

import {AppContext} from 'components/providers/appProvider'

const SearchAutomatedDescription = function ({project_id, filtersList, setFiltersList}) {

    //shows the number of results
    const [totalResults, setTotalResults] = useState(0);

    //filters fetch flag
    const [filtersFetch, setFiltersFetch] = useState(false)

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {

        //flag that represents the state of component
        let  mnt = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {
            setFiltersFetch(true);
            //call the dao
            let res = await projectFiltersDao.getFiltersList({"project_id" : project_id});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setFiltersList([]);
                setTotalResults(0);
                //show the page
                setFiltersFetch(false);
            }
            //if the component is still mounted and  there are some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mnt && res) {
                //update state
                setFiltersList(res.results);
                setTotalResults(res.totalResults);
                //show the page
                setFiltersFetch(false);
            }

        };

        fetchData();

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mnt = false;
        };
    }, []);

    let output = "";
    if(filtersFetch){
        output = <LoadIcon class={'small'}/>
    }else{
        if(totalResults !== 0){
            output = (
                <>
                {filtersList.map((element) =>
                    <p key={element.id} className="filter-predicate">{element.data.predicate}</p>
                )}
                <Link to={"/projects/"+project_id+"/filters"}>Go to filters details</Link>
                </>
            );
        }else{
            output = (
                <>
                    <p className="filter-predicate"><i>No filters yet in this project</i></p>
                    <Link to={"/projects/"+project_id+"/filters"}>Add a new filter from filters tab</Link>
                </>
            );
        }
    }

    return (
        <div className="right-side-wrapper search-automated-right-wrapper">
            <div className="search-automated-description">
                <p>This searching mode leverages NLP models to find relevant papers based on the topic and focus of your project and also considers the inclusion and exclusion criteria you defined.</p>
                <Link to={"/projects/"+project_id+"/search"}>(Go back to a normal search)</Link>
            </div>
            <div className="filters-holder">
                <h2>Filters:</h2>
                <div className="side-filters-wrapper">
                    {output}
                </div>
            </div>
        </div>
    );


};

export default SearchAutomatedDescription;