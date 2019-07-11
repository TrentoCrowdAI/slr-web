import React, {useState, useEffect, useRef} from "react";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import InfoTooltip from "components/modules/infoTooltip";

const MultiPredicateForm = function ({filtersList, clearHighlights, highlightedData, setHighlightedData, display, mountRef}) {

    const [displayedFilter, setDisplayedFilter] = useState(filtersList[0]);
    
    const [filterVotes, setFilterVotes] = useState(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));

    const [filterHighlights, setFilterHighlights] = useState(undefined);

    const [underlineOffset, setUnderlineOffset] = useState(0);

    useEffect(() => {
        if(display){
            setDisplayedFilter(filtersList[0]);
            setFilterVotes(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));
            setFilterHighlights(filtersList.map(() => []));
        }
    }, [display])
    
    useEffect(() => {
        let index = filterVotes.findIndex((vote) => (vote.outcome === ""));
        if(index >= 0){
            setTimeout(() => {
                if(mountRef.current){
                    setDisplayedFilter(filtersList[index]);
                }
            }, 400);
            
        }else{
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
            console.log("GOING NEXT FILTER");
            setUnderlineOffset(index * 30 + 2);
            if(filterHighlights && filterHighlights[index].length !== 0){
                console.log("__settting highligerhe data");
                console.log(filterHighlights[index]);
                setHighlightedData(filterHighlights[index]);
            }else{
                console.log("__clearing highligerhe data")
                clearHighlights();
            }
        }else{
            console.log("___summary tab")
            clearHighlights("disabled");
            setUnderlineOffset(filterVotes.length * 30 + 2);
        }
    }, [displayedFilter])

    async function sendResults(){
        let dataToSend = filterVotes.map((filterVote, index) => {
            if(filterHighlights[index].length === 1 && filterHighlights[index][0].type === "not_highlighted"){
                return {...filterVote, highlights: []};
            }else{
                return {...filterVote, highlights: filterHighlights[index]};
            }
        });
        console.log(dataToSend);
        if(filterVotes.findIndex((vote) => (vote.outcome === "")) === -1){
            console.log("sening")
        }
    }

    let output = (
        <form className="light-modal m-p-form" onSubmit={sendResults}>
            <InfoTooltip className={"s-p-form"}>
                You can cast your vote by using the keyboard:<br/>
                <b>A : </b> <i>no</i><br/>
                <b>S : </b> <i>yes</i><br/>
                <b>D : </b> <i>undecided</i><br/>
            </InfoTooltip>
            <div className="filters-nav">
            {filtersList.map((element) =>
                <button key={element.id} type="button" className="filter-btn" onClick={() => {setDisplayedFilter(element)}}>
                    {element.data.name || "[!]"}
                </button>
            )}
            <button className="filter-btn summary" type="button" onClick={() => {setDisplayedFilter("summary")}}>
                {"[V]"}
            </button>
            <div className="underline" style={{left: underlineOffset + "px"}}></div>
            </div>
            <FilterScreen filter={displayedFilter} display={display} 
                filterHighlights={filterHighlights} setFilterHighlights={setFilterHighlights}
                filterVotes={filterVotes} setFilterVotes={setFilterVotes} 
                highlightedData={highlightedData} setHighlightedData={setHighlightedData}
            mountRef={mountRef}/>
        </form>
    );

    return output;


};

const FilterScreen = function({ filter, display, 
                                filterHighlights, setFilterHighlights,
                                filterVotes, setFilterVotes, 
                                highlightedData, setHighlightedData, mountRef}) {


    const [currentOutcome, setCurrentOutcome] = useState("");
    const currentIndex = useRef(filterVotes.findIndex((filterx) => (filterx.filter_id === filter.id)));

    useEffect(() => {
        if(filter.id){
            currentIndex.current = filterVotes.findIndex((filterx) => (filterx.filter_id === filter.id));
            setCurrentOutcome(filterVotes[currentIndex.current].outcome);
        }
    }, [filter])

    useEffect(() => {
        if(filter.id && filterHighlights && highlightedData !== filterHighlights[currentIndex.current]){
            console.log("updating highlight of tab : " + currentIndex.current);
            let localHighlight = filterHighlights;
            localHighlight[currentIndex.current] = highlightedData;
            setFilterHighlights([...localHighlight]);
        }
    }, [highlightedData])

    async function sendSubmission(key){

        let localOutcome = "";
        
        switch (key) {
            case "a":
                setCurrentOutcome("no");
                localOutcome = "no";
                break;
            case "s":
                setCurrentOutcome("yes");
                localOutcome = "yes";
                break;
            case "d":
                setCurrentOutcome("und");
                localOutcome = "und";
                break;
            default:
                break;
        }
        setFilterVotes(
            filterVotes.map((vote) => ((vote.filter_id === filter.id) ? {...vote, outcome : localOutcome} : vote))
        );
    }
    function handleKey(key){
        if(document.activeElement.type !== "text" && display){
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
                    
                    <div className="yes-no-und">
                        <button className="no" type="button" style={{backgroundColor: (currentOutcome === "no") ? "grey" : ""}}
                            onClick={() => {handleKey("a")}}
                        >

                        </button>
                        <button className="yes" type="button" style={{backgroundColor: (currentOutcome === "yes") ? "grey" : ""}}
                            onClick={() => {handleKey("s")}}
                        >
                            
                        </button>
                        <button className="und" type="button" style={{backgroundColor: (currentOutcome=== "und") ? "grey" : ""}}
                            onClick={() => {handleKey("d")}}
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
                    <div key={index} className="filter-vote-summary"><p>{vote.filter_predicate}</p> <div className="outcome-result">
                        {(vote.outcome === "und") ? "undecided" : vote.outcome}
                    </div></div>
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