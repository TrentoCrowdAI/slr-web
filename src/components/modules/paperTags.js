import React, {useState, useEffect, useContext, useRef} from "react";

import {projectFiltersDao} from 'dao/projectFilters.dao';

import RemoveButton from "components/svg/removeButton";

import {AppContext} from 'components/providers/appProvider';

const Tags = function (props) {

    const mountRef = useRef(false);

    const [tagsList, setTagsList] = useState(["React", "Facebook", "Web"]);
    
    const availableTags = useRef(["older", "younger", "unnecessary", "meaningful", "yanked"]);

    const suggestionTimeout = useRef();

    const [tagSuggestions, setTagSuggestions] = useState([]);

    const [input, setInput] = useState("");

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    useEffect(() => {
        let mnt = true;

        //a wrapper function ask by react hook
        /*
        const fetchData = async () => {

            //call the dao
            let res = await projectFiltersDao.getFiltersList({"project_id" : props.project_id, ...queryData});

            console.log(res);

            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setTagsList([]);
            }
            //if the component is still mounted and  there are some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mnt && res) {
                //update state
                setTagsList(res.results);
            }

        };
        fetchData();
        */

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mnt = false;
        };
    }, []);

    useEffect(() => {props.setTagsData(tagsList)}, [tagsList])

    //function for adding tag
    async function addTag(tag){
        if(!tagsList.includes(tag)){
            console.log("adding " + tag);

            const callApi = async () => {

                //call the dao for getting collaborators
                //let res = await projectsDao.addProjectCollaborator(project.id, {"email": input});
                let res = tag;
                //error checking
                //there is some other errors
                if (mountRef.current && res && res.message) {
                    //pass error object to global context
                    appConsumer.setError(res);
                }
                //didn't get an error
                else if (res) {
                    setInput("");
                    setTagsList([...tagsList, res]);
                    availableTags.current = availableTags.current.filter((tagx) => tagx !== tag);
                    setTagSuggestions([]);
                }
            }
            callApi();
        }
    }

    async function removeTag(tag){

        console.log("deleting " + tag + " from " + props.question_id);

        /*
        //call the dao
        let res = await projectsDao.deleteProject(id);

        //empty string is the response from the dao layer in case of success(rember that empty string is a falsy value)
        if(mountRef.current && res === ""){
            //create a new array without the project deleted
            let newTagsList = tagsList.filter((tag)=>tag.id !== id);
            //update project list state
            setTagsList(newTagsList);

            appConsumer.setNotificationMessage("Successfully deleted");
        }
        //error checking
        //if is other error
        else if (mountRef.current && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);  
        }
        */

        setTagsList(tagsList.filter((tagx)=>tagx !== tag));
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
            <div className={(props.class === "right") ? "tags-wrapper to-right" : "tags-wrapper"}
                style={{opacity: (props.display) ? "1.0" : "0.0"}}
            >
                {tagsList.map((tag, index)=>(
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
