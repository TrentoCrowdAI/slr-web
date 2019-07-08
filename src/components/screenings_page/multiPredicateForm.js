import React, {useState, useEffect} from "react";
import KeyboardEventHandler from 'react-keyboard-event-handler';

const MultiPredicateForm = function ({filtersList, mountRef}) {

    const [displayedFilter, setDisplayedFilter] = useState(filtersList[0]);
    
    const [filterVotes, setFilterVotes] = useState(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));

    const [underlineOffset, setUnderlineOffset] = useState(0);

    useEffect(() => {
        console.log("going nex predicate");
        let index = filterVotes.findIndex((vote) => (vote.outcome === ""));
        console.log(index);
        if(index >= 0){
            setTimeout(() => {
                if(mountRef.current){
                    setDisplayedFilter(filtersList[index]);
                }
            }, 400);
            
        }else{
            console.log("we're done here");
            setTimeout(() => {
                if(mountRef.current){
                    setDisplayedFilter("summary");
                }
            }, 400);
        }
    },[filterVotes]);

    useEffect(() => {
        let index = filtersList.findIndex((filter) => (filter.id === displayedFilter.id));
        if(index >= 0){
            setUnderlineOffset(index * 30 + 2);
        }else{
            setUnderlineOffset(filterVotes.length * 30 + 2);
        }
    }, [displayedFilter])

    async function sendResults(){
        if(filterVotes.findIndex((vote) => (vote.outcome === "")) !== -1){
            console.log(filterVotes);
        }
    }

    let output = (
        <form className="light-modal m-p-form" onSubmit={sendResults}>
            <div className="filters-nav">
            {filtersList.map((element) =>
                <button key={element.id} className="filter-btn" onClick={() => {setDisplayedFilter(element)}}>
                    {element.data.name || "[!]"}
                </button>
            )}
            <button className="filter-btn summary" onClick={() => {setDisplayedFilter("summary")}}>
                {"[V]"}
            </button>
            <div className="underline" style={{left: underlineOffset + "px"}}></div>
            </div>
            <FilterScreen filter={displayedFilter} filterVotes={filterVotes} setFilterVotes={setFilterVotes} mountRef={mountRef}/>
        </form>
    );

    return output;


};

const FilterScreen = function({filter, filterVotes, setFilterVotes, mountRef}) {

    let currentOutcome = "";
    if(filter.id){
        currentOutcome = filterVotes.filter((filterx) => (filterx.filter_id === filter.id))[0].outcome;
    }

    async function sendSubmission(key){

        switch (key) {
            case "a":
                console.log("NO");
                setFilterVotes(
                    filterVotes.map((vote) => ((vote.filter_id === filter.id) ? {...vote, outcome : "no"} : vote))
                )
                break;
            case "d":
                console.log("YES");
                setFilterVotes(
                    filterVotes.map((vote) => ((vote.filter_id === filter.id) ? {...vote, outcome : "yes"} : vote))
                )
                break;
            case "s":
                console.log("UND");
                setFilterVotes(
                    filterVotes.map((vote) => ((vote.filter_id === filter.id) ? {...vote, outcome : "und"} : vote))
                )
                break;
            default:
                break;
        }
        /*
        //call the dao
        let res = await projectsDao.deleteProject(id);

        //empty string is the response from the dao layer in case of success(rember that empty string is a falsy value)
        if(mountRef.current && res === ""){
            //create a new array without the project deleted
            let newProjectsList = projectsList.filter((project)=>project.id !== id);
            //update project list state
            setProjectsList(newProjectsList);

            appConsumer.setNotificationMessage("Successfully deleted");
        }
        //error checking
        //if is other error
        else if (mountRef.current && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);  
        }
        */
    }
    function handleKey(key){
        if(document.activeElement.type !== "text"){
            sendSubmission(key);
        }
    }

    let output = ""

    if(filter.id){
        output = (
            <>
                <KeyboardEventHandler handleKeys={['a', 's', 'd']}  handleFocusableElements onKeyEvent={(key) => handleKey(key)} />
                <div className="filter-data">
                    <h2 className="filter-title">
                        {filter.data.predicate}
                    </h2>
                    <p className="criteria-type">
                        inclusion criteria:
                    </p>
                    <p className="criteria-description">
                        {filter.data.inclusion_description}
                    </p>
                    <p className="criteria-type">
                        exclusion criteria:
                    </p>
                    <p className="criteria-description">
                        {filter.data.exclusion_description}
                    </p>
                </div>
                <div className="screening-choice multi-predicate">
                    <h3 className="filter-question">Is the paper relevant for this eligibility criterion?</h3>
                    <p className="hl-tip">Please highlight in the text the evidence that supports your answer</p>
                    <div className="yes-no">
                        <button className="no" style={{backgroundColor: (currentOutcome === "no") ? "grey" : ""}}
                            onClick={() => {handleKey("a")}}
                        >

                        </button>
                        <button className="yes" style={{backgroundColor: (currentOutcome === "yes") ? "grey" : ""}}
                            onClick={() => {handleKey("d")}}
                        >
                            
                        </button>
                    </div>
                    <div className="und">
                        <button className="und" style={{backgroundColor: (currentOutcome === "und") ? "grey" : ""}}
                            onClick={() => {handleKey("s")}}
                        >

                        </button>
                    </div>
                </div>
            </>
        );
    }else{
        output = (
            <div className="m-p-screening-summary">
                {filterVotes.map((vote, index)=>(
                    <div key={index} className="filter-vote-summary"><p>{vote.filter_predicate}</p> <div className="outcome-result">{vote.outcome}</div></div>
                ))}
                <button type="sumbit" className="outcomes-submission" disabled={(filterVotes.findIndex((vote) => (vote.outcome === "")) !== -1)}>
                    Submit your outcomes
                </button>
            </div>
        );
    }

    return output;
};

export default MultiPredicateForm;