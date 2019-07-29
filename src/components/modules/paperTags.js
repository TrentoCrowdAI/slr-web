import React, {useState, useEffect, useRef} from "react";

import RemoveButton from "components/svg/removeButton";

const Tags = function ({className, display, selectedTags, setSelectedTags, availableTags}) {

    const mountRef = useRef(false);

    const suggestionTimeout = useRef();

    const [tagSuggestions, setTagSuggestions] = useState([]);

    const [input, setInput] = useState("");


    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    //function for adding tag
    async function addTag(tag){
        if(!selectedTags.includes(tag)){
            console.log("adding " + tag);

            setInput("");
            setSelectedTags([...selectedTags, tag]);
            availableTags.current = availableTags.current.filter((tagx) => tagx !== tag);
            setTagSuggestions([]);
        }
    }

    async function removeTag(tag){

        console.log("deleting " + tag);

        setSelectedTags(selectedTags.filter((tagx)=>tagx !== tag));
        availableTags.current = [...availableTags.current, tag];
    }

    function handleInputChange(e){
        clearTimeout(suggestionTimeout.current);
        setInput(e.target.value);
        var localInput = e.target.value.toLowerCase();
        if(localInput){
            suggestionTimeout.current = setTimeout(() => {
                setTagSuggestions(availableTags.current.map((tagx) => {
                    console.log("checking '" + tagx + "'");
                    let index = tagx.toLowerCase().indexOf(localInput);
                    if(index !== -1){
                        return {content: tagx, index: index, selectionLength: localInput.length};
                    }else{
                        return -1;
                    }
                }).filter((tog) => tog !== -1));
            }, 500);
        }else{
            setTagSuggestions([]);
        }
    }

    let output = <></>;
    output = (
        <>
            <div className={(className === "right") ? "tags-wrapper to-right" : "tags-wrapper"}
                style={{opacity: (display) ? "1.0" : "0.0"}}
            >
                {selectedTags.map((tag, index)=>(
                    <div key={index} className="tag">
                        {tag}
                        <button type="button" className="delete-tag"
                            onClick={() => {removeTag(tag)}}
                        >
                            <RemoveButton/>
                        </button>
                    </div>
                ))}
                <form className="add-tag" onSubmit={() => {addTag(input)}}>
                    <input type="text" id="tag-name" placeholder="add new tag..." value={input}
                        onChange={(e) => {handleInputChange(e)}}
                    />
                    <button className="add-tag-button" disabled={(!input || input === "")}/>
                    <div className="tag-suggestions" style={{display: (tagSuggestions.length === 0) ? "none" : ""}}>
                        {tagSuggestions.map((tag, index)=>(
                            <button key={index} type="button" className="tag-suggestion"
                                    onClick={() => {addTag(tag.content)}}
                            >
                                {tag.content.substring(0,tag.index)}
                                <span className="match">{tag.content.substring(tag.index, tag.index+tag.selectionLength)}</span>
                                {tag.content.substring(tag.index+tag.selectionLength, tag.content.length)}
                            </button>
                        ))}
                    </div>
                </form>
            </div>
        </>
    );
    return output;
}


export default Tags;
