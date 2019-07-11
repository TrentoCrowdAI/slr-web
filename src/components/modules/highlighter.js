import React, {useState, useEffect, useContext, useRef} from "react";
import {withRouter} from 'react-router-dom';
import ClampLines from 'react-clamp-lines';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import {paperDao} from 'dao/paper.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'

import {createQueryData} from 'utils/index';


import FiltersAccordion from "components/modules/filtersAccordion";
import Tags from 'components/modules/paperTags';

const queryParams = [
    {label: "question_id", default: ""}
]

/**
 * this is component form to search for the paper in project page
 * */

const HighLighter = function ({data, setHighlightedData, className}) {

    const startingBlock = useRef(0);
    const endingBlock = useRef(0);
    const selectingInterval = useRef();
    const [localData, setLocalData] = useState([{data: data, start: 0, end: data.length-1, type:"not_highlighted"}]);
    useEffect(() => {setHighlightedData(localData)}, [localData]);
    function selectingFunction(){
        selectingInterval.current = setTimeout(() => {
            const selection = document.getSelection();
            console.log(selection);
            if(selection.anchorNode.nodeName === "#text"){
                //data of the node
                //var selectionData = selection.anchorNode.data;
                //start of the selection
                var selectionStart = selection.anchorOffset;
                //end of the selection
                var selectionEnd = selection.focusOffset;


                if(startingBlock.current == endingBlock.current && selectionStart > selectionEnd){
                    let tmp = selectionStart;
                    selectionStart = selectionEnd;
                    selectionEnd = tmp;
                }
                if(startingBlock.current > endingBlock.current){
                    let tmp = startingBlock.current;
                    startingBlock.current = endingBlock.current;
                    endingBlock.current = tmp;
                    tmp = selectionStart;
                    selectionStart = selectionEnd;
                    selectionEnd = tmp;
                }

                
                console.log("startingBlock   > " + startingBlock.current + " | " + localData[startingBlock.current].type);
                console.log("selection start   > " + selectionStart);
                console.log("endingBlock     > " + endingBlock.current + " | " + localData[endingBlock.current].type);
                console.log("selection end     > " + selectionEnd);
                
                if(startingBlock.current === endingBlock.current && localData[startingBlock.current].type === "not_highlighted"){
                    var firstSubBlock = {
                        data: localData[startingBlock.current].data.substring(0, selectionStart),
                        start: localData[startingBlock.current].start,
                        end: localData[startingBlock.current].start + selectionStart-1,
                        type: "not_highlighted"
                    }
                    var midSubBlock = {
                        data: localData[startingBlock.current].data.substring(selectionStart, selectionEnd),
                        start: localData[startingBlock.current].start + selectionStart,
                        end: localData[startingBlock.current].start + selectionEnd-1,
                        type: "highlighted"
                    }
                    var lastSubBlock = {
                        data: localData[startingBlock.current].data.substring(selectionEnd, localData[startingBlock.current].end+1),
                        start: localData[startingBlock.current].start + selectionEnd,
                        end: localData[startingBlock.current].end,
                        type: "not_highlighted"
                    }
                    var newLocalData = localData;
                    newLocalData.splice(startingBlock.current, 1, firstSubBlock, midSubBlock, lastSubBlock);

                }else{
                    var newLocalData = localData;
                    var firstSubBlock = {
                        data: localData[startingBlock.current].data.substring(0, selectionStart),
                        start: localData[startingBlock.current].start,
                        end: localData[startingBlock.current].start + selectionStart-1,
                        type: localData[startingBlock.current].type
                    }
                    var midSubBlock = {
                        data: localData[startingBlock.current].data.substring(selectionStart, localData[startingBlock.current].data.length),
                        start: localData[startingBlock.current].start + selectionStart,
                        end: localData[startingBlock.current].end,
                        type: "highlighted"
                    }
                    newLocalData.splice(startingBlock.current, 1, firstSubBlock, midSubBlock);


                    for (let i = startingBlock.current+2; i<=endingBlock.current; i++){
                        newLocalData[i].type="highlighted";
                    }

                    var firstSubBlockx = {
                        data: localData[endingBlock.current+1].data.substring(0, selectionEnd),
                        start: localData[endingBlock.current+1].start,
                        end: localData[endingBlock.current+1].start + selectionEnd-1,
                        type: "highlighted"
                    }
                    var midSubBlockx = {
                        data: localData[endingBlock.current+1].data.substring(selectionEnd, localData[endingBlock.current+1].data.length),
                        start: localData[endingBlock.current+1].start + selectionEnd,
                        end: localData[endingBlock.current+1].end,
                        type: localData[endingBlock.current+1].type
                    }
                    newLocalData.splice(endingBlock.current+1, 1, firstSubBlockx, midSubBlockx);
                }

                newLocalData = newLocalData.filter((x) => x.start <= x.end);
                    let i = 0;
                    while(i<newLocalData.length){
                        if(newLocalData[i+1] && newLocalData[i].type === newLocalData[i+1].type){
                            let newBlock = {data: newLocalData[i].data + newLocalData[i+1].data, 
                                            start: newLocalData[i].start,
                                            end: newLocalData[i+1].end,
                                            type: newLocalData[i].type
                                            }
                            newLocalData.splice(i,2,newBlock);
                        }else{
                            i++;
                        }
                    }
                    document.getSelection().empty();
                    setLocalData([...newLocalData]);
                /*
                var newData = localData.slice(0, selectionStart) + "<i>" + localData.slice(selectionStart);
                newData = newData.slice(0, selectionEnd) + "</i>" + newData.slice(selectionEnd)
                setLocalData(newData);
                */
            }else{
                console.log("everything was selected")
            }
        },10);
    }

    //useEffect(() => {console.log("local data change"); console.log(localData)}, [localData])
    let output = (
        <div className={className}>
            <div className={className+"-head"}>
                <button className="clear-highlight" onClick={()=>{
                        setLocalData([{data: data, start: 0, end: data.length-1, type:"not_highlighted"}]);
                    }}
                    style={{opacity: (localData.length === 1 && localData[0].type === "not_highlighted") ? "0.0" : "1.0",
                            pointerEvents: (localData.length === 1 && localData[0].type === "not_highlighted") ? "none" : ""}}
                >
                    clear selection 
                </button>
            </div>
            {localData.map((dataChunk, index) => {
                return (
                    <span className={dataChunk.type} key={index}
                        onMouseDown={() => {startingBlock.current = index;clearTimeout(selectingInterval.current)}}
                        onDoubleClick={(e) => {console.log("double");clearTimeout(selectingInterval.current);document.getSelection().empty();}}
                        onMouseUp={() => {
                            endingBlock.current=index; selectingFunction();
                        }}
                    >{dataChunk.data}</span>
                );
            })}
        </div>
    );

    return output;
};


export default HighLighter;
