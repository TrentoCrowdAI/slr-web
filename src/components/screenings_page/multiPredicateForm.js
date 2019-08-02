import React, {useState, useEffect, useRef, useContext} from "react";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import InfoTooltip from "components/modules/infoTooltip";

import {projectScreeningDao} from 'dao/projectScreening.dao';

import {AppContext} from 'components/providers/appProvider';

import PositiveAnswer from 'components/svg/positiveAnswer';
import NegativeAnswer from 'components/svg/negativeAnswer';
import UndecidedAnswer from 'components/svg/undecidedAnswer';

/**
 * form for the multi-predicate screening submission
 */
const MultiPredicateForm = function ({paperData, tagsData, filtersList, nextPaper, setNextPaper,
                                      clearHighlights, highlightedData, setHighlightedData, display, mountRef}) {

    //filter to display
    const [displayedFilter, setDisplayedFilter] = useState(filtersList[0]);
    
    //array of votes per filter
    const [filterVotes, setFilterVotes] = useState(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));

    //array of highlghts per filter
    const [filterHighlights, setFilterHighlights] = useState(undefined);

    //hooks for the underline animation (on the filters mini navbar)
    const [underlineOffset, setUnderlineOffset] = useState(0);
    const [underlineWidth, setUnderlineWidth] = useState(26);

    //bool for vote submission
    const [voteSubmission, setVoteSubmission] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //everytime display changes it means I'm fetching a new paper so I reset the highlights
    useEffect(() => {
        setFilterHighlights(filtersList.map(() => []));
    }, [display])
    
    //everytime time the votes changes I search for the next filter which needs a vote
    useEffect(() => {
        
        //index of the filter with no outcome yet
        let index = filterVotes.findIndex((vote) => (vote.outcome === ""));

        //if filter with no outcome exists
        if(index >= 0){
            //I wait a short timeout(this way the user can see its vote after casting it) and then I set the filter to display
            setTimeout(() => {
                if(mountRef.current){
                    setDisplayedFilter(filtersList[index]);
                }
            }, 400);
            
        }
        //otherwise
        else{
            //I go to the summary tab
            setTimeout(() => {
                if(mountRef.current){
                    setDisplayedFilter("summary");
                }
            }, 400);
        }
    },[filterVotes]);

    //effect for updating the mini-navbar slider and setting the filter highlights
    useEffect(() => {

        //I get the index of the display filter(the highlights of the filter will have this same index)
        let index = filtersList.findIndex((filter) => (filter.id === displayedFilter.id));

        //slider width and offset
        let btnWidth = undefined;
        let btnOffset = 0;

        //if the navbar is rendered
        if(document.getElementsByClassName("filters-nav")[0]) {
            //I calculate offset and width
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
            setUnderlineWidth(btnWidth-4);
        }

        //if there's a displayed filter
        if(index >= 0){

            //if there are already highlights for the filter
            if(filterHighlights && filterHighlights[index].length !== 0){
                //I set them in the hook
                setHighlightedData(filterHighlights[index]);
            }
            //otherwise I simply clear the highlights of the previous filter
            else{
                clearHighlights();
            }

            setUnderlineOffset(btnOffset + 2);
        }
        //otherwise I'm into the summary tab and I disable the highlighter
        else{
            clearHighlights("disabled");
            setUnderlineOffset(btnOffset + 2);
        }
    }, [displayedFilter])

    //function to submit filter votes and highlights
    async function sendResults(){

        //I create a basic array of highlights to send
        let dataToSend = filterVotes.map((filterVote, index) => {
            if(filterHighlights[index].length === 1 && filterHighlights[index][0].type === "not_highlighted"){
                return {...filterVote, filterHighlights: []};
            }else{
                return {...filterVote, filterHighlights: filterHighlights[index]};
            }
        });

        //I create the object to send
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

        //I check if all filter have been screened
        if(filterVotes.findIndex((vote) => (vote.outcome === "")) === -1){
            //I set the vote submission to true so this way the form will be disabled while it sends data
            setVoteSubmission(true);

            //call the dao
            let resx = await projectScreeningDao.submitVote(screeningData);
            
            //error checking
            if (mountRef.current && resx && resx.message) {
                //pass error object to global context
                appConsumer.setError(resx);  
            }
            //if successfull submission
            else if(mountRef.current && resx.data){
                //I trigger the effect to get a new paper
                setNextPaper(!nextPaper);
                //I reset all votes so they're ready for the new paper
                setFilterVotes(filtersList.map((filter) => ({filter_id: filter.id, filter_predicate: filter.data.predicate, outcome: ""})));
                setVoteSubmission(false);
            }   
        }
    }

    let output = <></>;

    //if there's a paper to display
    if(paperData && paperData.data && paperData.data.title!=="Finished!"){
        
        //I create the form
        output = (
            <form className="light-modal m-p-form" onSubmit={sendResults}>

                <InfoTooltip className={"s-p-form"}>
                    You can cast your vote by using the keyboard:<br/>
                    <b>A : </b> <i>yes</i><br/>
                    <b>S : </b> <i>no</i><br/>
                    <b>D : </b> <i>undecided</i><br/>
                </InfoTooltip>

                {/*mini navbar for the filter*/}
                <div className="filters-nav">
                {filtersList.map((element) =>
                    <button key={element.id} type="button" className="filter-btn" onClick={() => {setDisplayedFilter(element)}}>
                        {element.data.name || "[!]"}
                    </button>
                )}
                <button className="filter-btn summary" type="button" onClick={() => {setDisplayedFilter("summary")}}>
                    Summary
                </button>
                {/*underline for selected filter tab*/}
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

/**
 * actual form part displaying the vote button
 */
const FilterScreen = function({ filter, display, 
                                filterHighlights, setFilterHighlights,
                                filterVotes, setFilterVotes, 
                                highlightedData, voteSubmission}) {

    //current filter vote
    const [currentOutcome, setCurrentOutcome] = useState("");

    //index of the displayed filter
    const currentIndex = useRef(filterVotes.findIndex((filterx) => (filterx.filter_id === filter.id)));

    //every time the filter change I update the currentOutcome in order to display the current filter vote
    useEffect(() => {
        if(filter.id){
            currentIndex.current = filterVotes.findIndex((filterx) => (filterx.filter_id === filter.id));
            setCurrentOutcome(filterVotes[currentIndex.current].outcome);
        }
    }, [filter])

    //I update the filter highlights when I detect a change in the currently highlighted text
    useEffect(() => {
        if(filter.id && filterHighlights && highlightedData !== filterHighlights[currentIndex.current]){
            let localHighlight = filterHighlights;
            localHighlight[currentIndex.current] = highlightedData;
            setFilterHighlights([...localHighlight]);
        }
    }, [highlightedData])

    //function for casting the filter vote in the filterVotes array
    async function arraySubmission(key){

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

        //I update the array of filter votes
        setFilterVotes(
            filterVotes.map((vote) => ((vote.filter_id === filter.id) ? {...vote, outcome : localOutcome} : vote))
        );
    }

    //wrapper function for the vote submission in order to stop submission if necessary
    function handleKey(key){
        //I send the submission only if I'm not on an input text and there's a displayed paper and I'm not already submitting
        if(document.activeElement.type !== "text" && display && !voteSubmission){
            arraySubmission(key);
        }
    }

    let output = <></>;

    //if I'm displaying a filter
    if(filter.id){

        //I create output asking for vote
        output = (
            <>
                {/*add keyboard handler to deal with keayboard commands */}
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
    }
    //otherwise
    else{
        //I show the summary tab
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