import React, {useState, useEffect, useContext, useRef} from "react";

/**
 * this is component form to search for the paper in project page
 * */

const HighLighter = function ({data, highlightedData, setHighlightedData, className}) {

    const startingBlock = useRef(0);
    const endingBlock = useRef(0);
    const selectingInterval = useRef();

    function selectingFunction(){
        selectingInterval.current = setTimeout(() => {
            const selection = document.getSelection();
            //console.log(selection);
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

                
                //console.log("startingBlock   > " + startingBlock.current + " | " + localData[startingBlock.current].type);
                //console.log("selection start   > " + selectionStart);
                //console.log("endingBlock     > " + endingBlock.current + " | " + localData[endingBlock.current].type);
                //console.log("selection end     > " + selectionEnd);
                
                if(startingBlock.current === endingBlock.current && highlightedData[startingBlock.current].type === "not_highlighted"){
                    var firstSubBlock = {
                        data: highlightedData[startingBlock.current].data.substring(0, selectionStart),
                        start: highlightedData[startingBlock.current].start,
                        end: highlightedData[startingBlock.current].start + selectionStart-1,
                        type: "not_highlighted"
                    }
                    var midSubBlock = {
                        data: highlightedData[startingBlock.current].data.substring(selectionStart, selectionEnd),
                        start: highlightedData[startingBlock.current].start + selectionStart,
                        end: highlightedData[startingBlock.current].start + selectionEnd-1,
                        type: "highlighted"
                    }
                    var lastSubBlock = {
                        data: highlightedData[startingBlock.current].data.substring(selectionEnd, highlightedData[startingBlock.current].end+1),
                        start: highlightedData[startingBlock.current].start + selectionEnd,
                        end: highlightedData[startingBlock.current].end,
                        type: "not_highlighted"
                    }
                    var newLocalData = highlightedData;
                    newLocalData.splice(startingBlock.current, 1, firstSubBlock, midSubBlock, lastSubBlock);

                }else{
                    var newLocalData = highlightedData;
                    var firstSubBlock = {
                        data: highlightedData[startingBlock.current].data.substring(0, selectionStart),
                        start: highlightedData[startingBlock.current].start,
                        end: highlightedData[startingBlock.current].start + selectionStart-1,
                        type: highlightedData[startingBlock.current].type
                    }
                    var midSubBlock = {
                        data: highlightedData[startingBlock.current].data.substring(selectionStart, highlightedData[startingBlock.current].data.length),
                        start: highlightedData[startingBlock.current].start + selectionStart,
                        end: highlightedData[startingBlock.current].end,
                        type: "highlighted"
                    }
                    newLocalData.splice(startingBlock.current, 1, firstSubBlock, midSubBlock);


                    for (let i = startingBlock.current+2; i<=endingBlock.current; i++){
                        newLocalData[i].type="highlighted";
                    }

                    var firstSubBlockx = {
                        data: highlightedData[endingBlock.current+1].data.substring(0, selectionEnd),
                        start: highlightedData[endingBlock.current+1].start,
                        end: highlightedData[endingBlock.current+1].start + selectionEnd-1,
                        type: "highlighted"
                    }
                    var midSubBlockx = {
                        data: highlightedData[endingBlock.current+1].data.substring(selectionEnd, highlightedData[endingBlock.current+1].data.length),
                        start: highlightedData[endingBlock.current+1].start + selectionEnd,
                        end: highlightedData[endingBlock.current+1].end,
                        type: highlightedData[endingBlock.current+1].type
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
                    setHighlightedData([...newLocalData]);
                /*
                var newData = localData.slice(0, selectionStart) + "<i>" + localData.slice(selectionStart);
                newData = newData.slice(0, selectionEnd) + "</i>" + newData.slice(selectionEnd)
                setLocalData(newData);
                */
            }else{
                //console.log("everything was selected")
            }
        },10);
    }

    //useEffect(() => {console.log("local data change"); console.log(localData)}, [localData])
    let output = (
        <div className={className}>
            <div className={className+"-head"}>
                <button className="clear-highlight" onClick={()=>{
                        setHighlightedData([{data: data, start: 0, end: data.length-1, type:"not_highlighted"}]);
                    }}
                    style={{opacity: (highlightedData.length === 1 && (highlightedData[0].type === "not_highlighted" || highlightedData[0].type === "disabled")) ? "0.0" : "1.0",
                            pointerEvents: (highlightedData.length === 1 && highlightedData[0].type === "not_highlighted") ? "none" : ""}}
                >
                    clear selection 
                </button>
            </div>
            {highlightedData.map((dataChunk, index) => {
                if(dataChunk.type === "disabled"){
                    return (
                        <span className="not_highlighted disa" key={index}>{dataChunk.data}</span>
                    );
                }else{
                    return (
                        <span className={dataChunk.type} key={index}
                            onMouseDown={() => {startingBlock.current = index;clearTimeout(selectingInterval.current)}}
                            onDoubleClick={(e) => {
                                //console.log("double");
                                clearTimeout(selectingInterval.current);
                                document.getSelection().empty();}
                            }
                            onMouseUp={() => {
                                endingBlock.current=index; selectingFunction();
                            }}
                        >{dataChunk.data}</span>
                    );
                }
            })}
        </div>
    );

    return output;
};


export default HighLighter;
