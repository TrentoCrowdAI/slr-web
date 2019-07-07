import React, {useState, useEffect, useContext, useRef} from "react";

import {projectFiltersDao} from 'dao/projectFilters.dao';

import {AppContext} from 'components/providers/appProvider';

const Tags = function (props) {

    const mountRef = useRef(false);

    const [tagsList, setTagsList] = useState(["React", "Facebook", "Web"]);

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

    //function for adding tag
    async function addTag(){
        if(!tagsList.includes(input)){
            console.log("adding " + input);

            const callApi = async () => {

                //call the dao for getting collaborators
                //let res = await projectsDao.addProjectCollaborator(project.id, {"email": input});
                let res = "newTag";
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
                }
            }
            callApi();
        }
    }

    return(
        <div className="tags-wrapper">
            {tagsList.map((tag, index)=>(
                <div key={index} className="tag">{tag}</div>
            ))}
            <form className="add-tag" onSubmit={addTag}>
                    <input type="text" id="tag-name" placeholder="add new tag..." value={input}
                        onChange={(e) => {setInput(e.target.value);}}
                    />
                    <button className="add-tag-button" disabled={(!input || input === "")}/>
            </form>
        </div>
    );
}


export default Tags;
