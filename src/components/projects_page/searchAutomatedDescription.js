import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import LoadIcon from "components/svg/loadIcon";

const SearchAutomatedDescription = function ({project_id}) {

    //filters
    const [filtersList, setFiltersList] = useState([
        {id: "1", predicate: "Tapping the main stream of geothermal energy?", should: "this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be this is what the answer should be", shouldNot: "this is what the answer should not be"},
        {id: "2", predicate: "Luminescence kinetic in the blood ROS generation assay?", should: "this is what the answer should be", shouldNot: "this is what the answer should not be"},
        {id: "3", predicate: "Fundamentals of chemical looping combustion and introduction to CLC reactordesign?", should: "this is what the answer should be", shouldNot: "this is what the answer should not be"}
    ])


    //shows the number of results
    const [totalResults, setTotalResults] = useState(0);

    //filters fetch flag
    const [filtersFetch, setFiltersFetch] = useState(false)

    useEffect(() => {

        //flag that represents the state of component
        let  mounted = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {
            

        };
        fetchData();

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mounted = false;
        };
    }, []);

    let output = "";
    if(filtersFetch){
        output = <LoadIcon/>
    }else{
        output = (
            <>
            {filtersList.map((element) =>
                <p key={element.id} className="filter-predicate">{element.predicate}</p>
            )}
            <Link to={"/projects/"+project_id+"/filters"}>Go to filters details</Link>
            </>
        );
    }

    return (
        <div className="right-side-wrapper search-automated-right-wrapper">
            <div className="search-automated-description">
                <p>This searching mode leverages NLP models to find relevant papers based on the topic and focus of your project and also considers the inclusion and exclusion criteria you defined.</p>
                <Link to={"/projects/"+project_id+"/search"}>(Go back to a normal search)</Link>
            </div>
            <div className="filters-holder">
                <h2>Filters:</h2>
                {output}
            </div>
        </div>
    );


};

export default SearchAutomatedDescription;