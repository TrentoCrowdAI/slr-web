import React, {useEffect, useContext, useRef, useState} from "react";
import { Formik, Form, Field } from "formik";

import {projectsDao} from 'dao/projects.dao'
import {projectFiltersDao} from 'dao/projectFilters.dao'

import RadioBox from "components/forms_elements/radioboxFormik";
import UserCheckbox from 'components/projects_page/screening_tab/backlog_subtab/forms/userCheckboxFormik';

import LoadIcon from 'components/svg/loadIcon';
import CloseButton from 'components/svg/closeButton';

import { AppContext } from 'components/providers/appProvider'

/**
 * this is the form for starting the manual screening
 */
function ManualScreeningForm(props) {

    const mountRef = useRef(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //collaborators fetch state
    const [collaboratorsFetch, setCollaboratorsFetch] = useState(true);

    //collaborators list
    const [collaborators, setCollaborators] = useState([]);

    //bool for multi predicate option availability
    const [isMpAvailable, setIsMpAvailable] = useState(false);

    useEffect(() => {
        mountRef.current = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //call the dao for getting collaborators
            let res = await projectsDao.getProjectCollaborators(props.project_id);
            console.log(res);
            //error checking
            //if the component is still mounted and there is some other errors
            if (mountRef.current && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mountRef.current && res) {
                //setCollaborators(res);
                setCollaborators(res);

                //call the dao for getting the filters(this way I know if the user can start multi predicate screening)
                let resx = await projectFiltersDao.getFiltersList({"project_id" : props.project_id});
                //error checking
                //if the component is still mounted and  is 404 error
                if (mountRef.current && resx && resx.message === "Not Found") {
                    setIsMpAvailable(false);
                }
                //if the component is still mounted and  there are some other errors
                else if (mountRef.current && resx && resx.message) {
                    //pass error object to global context
                    appConsumer.setError(resx);
                }
                //if the component is still mounted and  res isn't null
                else if (mountRef.current && resx) {
                    //update state
                    setIsMpAvailable(true);
                }
                //show the list
                setCollaboratorsFetch(false);
            }
        }
        setTimeout(() => {
            fetchData();
        }, 3000);
        

        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    return (
        <>
        <Formik
            initialValues={{screeners: [], screening_mode: "single-predicate"}}
            onSubmit={async (values, { setSubmitting }) => {
                let bodyData = {project_id: props.project_id, screeners: values.screeners, screening_mode: values.screening_mode};
                console.log(bodyData);
                if(values.screeners.length > 0){
                    console.log("can submit")
                }
                /*
                //call dao
                let res = await projectsDao.postProject(bodyData);

                //error checking
                if(mountRef.current && res.message){
                    //pass error object to global context
                    appConsumer.setError(res);
                }else 
                */
                if(mountRef.current){
                    setSubmitting(false);
                }
            }}
            validateOnBlur={false}
        >
        {function ({ errors, touched, isSubmitting, isValid, setErrors, validateField, handleChange, values }) {
            let output = "";
            let result = "";
            if(collaboratorsFetch){
                result = <LoadIcon class="small" />;
            }else{
                result = (
                    <>
                    <p className="tip">Is a good practice to select at least two people for screening</p>
                    <div className="users-list">
                        <Field
                            name="screeners"
                            render={({ field, form }) => (
                                <>
                                    <div>
                                        <UserCheckbox selected={values.screeners.includes(-1)} 
                                            user={{id: -1, ...(appConsumer.user), name:"you", surname: ""}} {...field} form={form}/>
                                    </div>
                                    {collaborators.map(function (user) {
                                        if(user.data.name !== ""){
                                            return (
                                                <div key={user.id}>
                                                    <UserCheckbox user={user.data} {...field} form={form}/>
                                                </div>
                                            );
                                        }
                                    })}
                                </>
                            )}
                        />
                    </div>
                    <div className="screening-type">
                        <label>Screening mode : </label>
                        <Field
                            name="screening_mode"
                            render={({ field, form }) => (
                                <>
                                    <RadioBox label={"single-predicate"} {...field} val={"single-predicate"} form={form}
                                            isChecked={(values.screening_mode === "single-predicate")} />
                                    <RadioBox className={(isMpAvailable) ? "" : "disabled"} label={"multi-predicate"} {...field} val={"multi-predicate"} form={form}
                                            isChecked={(values.screening_mode === "multi-predicate")}/>
                                </>
                            )}
                        />
                    </div>
                    </>
                );
            }
            output = (<Form className="modal floating-form start-manual-screening" style={{visibility: (!props.visibility) ? 'hidden' : '' }}>
                <button type="button" className="close-btn" onClick={(e) => {
                    props.setVisibility(!props.visibility);
                }}><CloseButton/></button>

                <h2>Select screeners</h2>
                {result}
                {/*
                <Field
                    name="threshold"
                    render={({ field, form }) => (
                            <Select options={confidenceValues} {...field} form={form} type={"mini"}/>
                    )}
                />
                */}
                <button className="start-btn" type="submit" style={{visibility: (collaboratorsFetch) ? 'hidden' : '' }} disabled={(values.screeners.length === 0)}>
                    Start Manual-screening
                </button>
            </Form>
            );
            return output;
        }}
        </Formik>

        </>
    );

}


export default ManualScreeningForm;