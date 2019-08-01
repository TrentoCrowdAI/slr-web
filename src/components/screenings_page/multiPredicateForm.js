import React, {useState, useEffect, useRef, useContext} from "react";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import InfoTooltip from "components/modules/infoTooltip";

import {projectScreeningDao} from 'dao/projectScreening.dao';

import {AppContext} from 'components/providers/appProvider';

import PositiveAnswer from 'components/svg/positiveAnswer';
import NegativeAnswer from 'components/svg/negativeAnswer';
import UndecidedAnswer from 'components/svg/undecidedAnswer';

const MultiPredicateForm = function ({paperData, tagsData, filtersList, nextPaper, setNextPaper,
                                      clearHighlights, highlightedData, setHighlightedData, display, mountRef}) {

    const [displayedFilter, setDisplayedFilter] = useState(filtersList[0]);
    
    const [filterVotes, setFilterVotes] = useState(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));

    const [filterHighlights, setFilterHighlights] = useState(undefined);

    const [underlineOffset, setUnderlineOffset] = useState(0);
    const [underlineWidth, setUnderlineWidth] = useState(26);

    //bool for vote submission
    const [voteSubmission, setVoteSubmission] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {
        setFilterHighlights(filtersList.map(() => []));
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
        let btnWidth = undefined;
        let btnOffset = 0;
        if(document.getElementsByClassName("filters-nav")[0]) {
            if(index >= 0){
                btnWidth =  document.getElementsByClassName("filters-nav")[0].childNodes[index];
                for(let i = 0; i < index; i++){
                    btnOffset = btnOffset + document.getElementsByClassName("filters-nav")[0].childNodes[i].getBoundingClientRect().width;
                }
            }else{
                btnWidth =  document.getElementsByClassName("filters-nav")[0].childNodes[filterVotes.length];
                for(let i = 0; i < filterVotes.length; i++){
                    btnOffset = btnOffset + document.getElementsByClassName("filters-nav")[0].childNodes[i].getBoundingClientRect().width;
                }
            }
            btnWidth = btnWidth.getBoundingClientRect().width;
            console.log("width -> " + btnWidth);
            setUnderlineWidth(btnWidth-4);
        }
        if(index >= 0){
            console.log("GOING NEXT FILTER");
            setUnderlineOffset(btnOffset + 2);
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
            setUnderlineOffset(btnOffset + 2);
        }
    }, [displayedFilter])

    async function sendResults(){
        let dataToSend = filterVotes.map((filterVote, index) => {
            if(filterHighlights[index].length === 1 && filterHighlights[index][0].type === "not_highlighted"){
                return {...filterVote, filterHighlights: []};
            }else{
                return {...filterVote, filterHighlights: filterHighlights[index]};
            }
        });
        let screeningData = {
            project_paper_id: paperData.id,
            vote:{
                answer: 
                    (filterVotes.filter(v => v.outcome === "1").length >= filterVotes.filter(v => v.outcome === "0").length) ?
                        "1"
                    :
                        "0"
                    ,
                metadata: {type: "multi-predicate", highlights: dataToSend, tags: tagsData}
            }
        };
        console.log("data to send _>")
        console.log(screeningData);
        if(filterVotes.findIndex((vote) => (vote.outcome === "")) === -1){
            setVoteSubmission(true);
            console.log("sening")
            //call the dao
            let resx = await projectScreeningDao.submitVote(screeningData);
            
            //error checking
            if (mountRef.current && resx && resx.message) {
                //pass error object to global context
                appConsumer.setError(resx);  
            }

            else if(mountRef.current && resx.data){
                //I trigger the effect to get a new paper
                setNextPaper(!nextPaper);
                setFilterVotes(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));
                setVoteSubmission(false);
            }   
        }
    }

    let output = <></>;
    if(paperData && paperData.data && paperData.data.title!=="Finished!"){
        output = (
            <form className="light-modal m-p-form" onSubmit={sendResults}>
                <InfoTooltip className={"s-p-form"}>
                    You can cast your vote by using the keyboard:<br/>
                    <b>A : </b> <i>yes</i><br/>
                    <b>S : </b> <i>no</i><br/>
                    <b>D : </b> <i>undecided</i><br/>
                </InfoTooltip>
                <div className="filters-nav">
                {filtersList.map((element) =>
                    <button key={element.id} type="button" className="filter-btn" onClick={() => {setDisplayedFilter(element)}}>
                        {element.data.name || "[!]"}
                    </button>
                )}
                <button className="filter-btn summary" type="button" onClick={() => {setDisplayedFilter("summary")}}>
                    Summary
                </button>
                <div className="underline" style={{left: underlineOffset + "px", width: underlineWidth+"px"}}></div>
                </div>
                <FilterScreen filter={displayedFilter} display={display} 
                    filterHighlights={filterHighlights} setFilterHighlights={setFilterHighlights}
                    filterVotes={filterVotes} setFilterVotes={setFilterVotes} 
                    highlightedData={highlightedData} voteSubmission={voteSubmission}/>
            </form>
        );
    }

    return output;


};

const FilterScreen = function({ filter, display, 
                                filterHighlights, setFilterHighlights,
                                filterVotes, setFilterVotes, 
                                highlightedData, voteSubmission}) {


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
            case "s":
                setCurrentOutcome("0");
                localOutcome = "0";
                break;
            case "a":
                setCurrentOutcome("1");
                localOutcome = "1";
                break;
            case "d":
                setCurrentOutcome("2");
                localOutcome = "2";
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
                        {filter.data.inclusion_description || <i>empty criterion</i>}
                    </p>
                    <p className="criteria-type">
                        exclusion criteria:
                    </p>
                    <p className="criteria-description">
                        {filter.data.exclusion_description || <i>empty criterion</i>}
                    </p>
                </div>
                <div className="screening-choice multi-predicate">
                    <h3 className="filter-question">Is the paper relevant for this eligibility criterion?</h3>
                    <p className="hl-tip">Please highlight in the text the evidence that supports your answer</p>
                    
                    <div className="yes-no-und">
                        <div className="btn-decision-holder">
                            <button className="yes" type="button" style={{backgroundColor: (currentOutcome === "1") ? "#0b8a42" : ""}}
                                onClick={() => {handleKey("a")}}
                            >
                                <PositiveAnswer color={(currentOutcome === "1") ? "white" : "#696969"}/>
                            </button>
                            <div className="decision-tooltip">yes</div>
                        </div>
                        <div className="btn-decision-holder">
                            <button className="no" type="button" style={{backgroundColor: (currentOutcome === "0") ? "#c31f1f" : ""}}
                                onClick={() => {handleKey("s")}}
                            >
                                <NegativeAnswer color={(currentOutcome === "0") ? "white" : "#696969"}/>
                            </button>
                            <div className="decision-tooltip">no</div>
                        </div>
                        <div className="btn-decision-holder">
                            <button className="und" type="button" style={{backgroundColor: (currentOutcome=== "2") ? "#4242e1" : ""}}
                                onClick={() => {handleKey("d")}}
                            >
                                <UndecidedAnswer color={(currentOutcome === "2") ? "white" : "#696969"}/>
                            </button>
                            <div className="decision-tooltip">undecided</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }else{
        output = (
            <div className="m-p-screening-summary">
                {filterVotes.map((vote, index)=>(
                    <div key={index} className="filter-vote-summary"><p>{vote.filter_predicate}</p> <div className="outcome-result">
                        {(vote.outcome === "2") ? "undecided" : 
                         ((vote.outcome === "1") ? "yes" : "no")}
                    </div></div>
                ))}
                <button type="sumbit" className="outcomes-submission" disabled={((filterVotes.findIndex((vote) => (vote.outcome === "")) !== -1) || voteSubmission)}>
                    Submit your outcomes
                </button>
            </div>
        );
    }

    return output;
};

export default MultiPredicateForm;