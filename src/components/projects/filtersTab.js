import React, {useState, useEffect} from "react";

import queryString from "query-string";

import InsertFilterForm from "components/forms/insertFilterForm";
import PrintFiltersList from "./printFiltersList";
import Pagination from "components/modules/pagination";

const FiltersTab = function (props) {

    //filters
    const [filtersList, setFiltersList] = useState([
        {id: "1", predicate: "Tapping the main stream of geothermal energy?", should: "this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be", shouldNot: "this is what the answer should not be"},
        {id: "2", predicate: "Luminescence kinetic in the blood ROS generation assay?", should: "this is what the answer should be", shouldNot: "this is what the answer should not be"},
        {id: "3", predicate: "Fundamentals of chemical looping combustion and introduction to CLC reactordesign?", should: "this is what the answer should be", shouldNot: "this is what the answer should not be"}
    ])

    //filters fetch flag
    const [filtersFetch, setFiltersFetch] = useState(true);

    //shows the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //set query params from url
    const queryData = createQueryData(props.location.search);

    useEffect(() => {

        //flag that represents the state of component
        let  mounted = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {
            //hide the page
            setFiltersFetch(true);

            /*
            //call the dao
            //let res = await projectPapersDao.getPapersList({project_id, ...queryData});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mounted && res && res.message === "Not Found") {
                setFiltersList([]);
                setTotalResults(0);
                //show the page
                setFiltersFetch(false);
            }
            //if the component is still mounted and  there are some other errors
            else if (mounted && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mounted && res) {

                //update state
                setFiltersList(res.results);
                setTotalResults(res.totalResults);
                //show the page
                setFiltersFetch(false);
            }
            */

        };
        fetchData();

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mounted = false;
        };
    }, [queryData.start, queryData.count, queryData.sort, queryData.orderBy]); //re-execute when these variables change

    useEffect(() => {
        console.log(filtersList);
    }, [filtersList])

    return (
        <>
            <InsertFilterForm project_id={props.project_id} start={queryData.start} filtersList={filtersList} setFiltersList={setFiltersList}/>
            <div className="left-side-wrapper filters-wrapper">
                <PrintFiltersList filtersList={filtersList}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={props.match.url}/>
            </div>
        </>
    );
}


/**
 * internal function to prepare a object of queryData
 * @param query
 * @return object of queryData for the fetch
 */
function createQueryData(query){

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

export default FiltersTab;