import React, {useEffect, useContext, useRef, useState} from "react";
import { Formik, Form, Field } from "formik";

import {projectsDao} from 'dao/projects.dao';
import {projectScreeningDao} from 'dao/projectScreening.dao';
import {projectFiltersDao} from 'dao/projectFilters.dao';

import RadioBox from "components/forms_elements/radioboxFormik";
import UserCheckbox from 'components/projects_page/screening_tab/backlog_subtab/forms/userCheckboxFormik';

import LoadIcon from 'components/svg/loadIcon';
import CloseButton from 'components/svg/closeButton';

import { AppContext } from 'components/providers/appProvider';

const _array = require('lodash/array');

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

    //screeners ref
    const screeners = useRef([])

    //bool for multi predicate option availability
    const [isMpAvailable, setIsMpAvailable] = useState(false);

    useEffect(() => {
        mountRef.current = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //call the dao for getting collaborators
            let res = await projectsDao.getProjectCollaborators(props.project_id);

            //error checking
            //if the component is still mounted and there is some other errors
            if (mountRef.current && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mountRef.current && res) {
                setCollaborators(res);

                //call the dao for getting the filters(this way I know if the user can start multi predicate screening)
                let resx = await projectFiltersDao.getFiltersList({"project_id" : props.project_id});
                //error checking
                //if the component is still mounted and  is 404 error it means that there are no filters
                if (mountRef.current && resx && resx.message === "Not Found") {
                    //so I set multi-predicate option availability to false
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

                let resz = await projectsDao.getProjectScreeners(props.project_id);
                if(mountRef.current && resz && resz.message){
                    //pass error object to global context
                    appConsumer.setError(resz);
                }else{
                    screeners.current = resz.map((user) => user.id);
                }
                //show the list
                setCollaboratorsFetch(false);
            }
        }
            
        fetchData();
        

        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    return (
        <>
        <Formik
            initialValues={{screeners: [], screening_mode: "single-predicate"}}
            onSubmit={async (values, { setSubmitting, resetForm }) => {

                let bodyData = {array_user_ids: values.screeners, manual_screening_type: values.screening_mode};


                if(values.screeners.length > 0){
                    //If the project has not any screnners yet I do the POST
                    let res;
                    if(screeners.current.length === 0){
                        res = await projectsDao.postProjectManualScreeningData(props.project_id, bodyData);
                    }
                    //otherwise I do the update
                    else{
                        res = await projectsDao.putProjectManualScreeningData(props.project_id, bodyData);
                    }

                    //error checking
                    if(mountRef.current && res.message){
                        //pass error object to global context
                        appConsumer.setError(res);
                    }else if(mountRef.current){
                        setSubmitting(false);
                        props.setVisibility(!props.visibility);
                        props.setManualStarted(true);
                        screeners.current = _array.union(values.screeners, screeners.current);
                        resetForm({screeners: [], screening_mode: "-"});
                    }
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
                    <p className="tip">{(screeners.current.length === 0) ? "Is a good practice to select at least two people for screening" : ""}</p>
                    <div className="users-list">
                        <Field
                            name="screeners"
                            render={({ field, form }) => (
                                <>
                                    {collaborators.map(function (user) {
                                        if(user.data.name !== ""){
                                            return (
                                                <div key={user.id}>
                                                    <UserCheckbox user={user} alreadyScreeners={screeners} {...field} form={form}/>
                                                </div>
                                            );
                                        }
                                    })}
                                </>
                            )}
                        />
                    </div>
                    <div className={(screeners.current.length !== 0) ? "screening-type disabled" : "screening-type"} 
                        style={{height: (screeners.current.length !== 0) ? "0px" : "", overflow: (screeners.current.length !== 0) ? "hidden" : ""}}>
                        <label>Screening mode : </label>
                        <Field
                            name="screening_mode"
                            render={({ field, form }) => (
                                <>
                                    <RadioBox label={"single-predicate"} {...field} val={"single-predicate"} form={form}
                                            isChecked={(values.screening_mode === "single-predicate")} 
                                            disabled={(screeners.current.length !== 0)}/>
                                    <RadioBox className={(isMpAvailable) ? "" : "disabled"} label={"multi-predicate"} {...field} val={"multi-predicate"} form={form}
                                            isChecked={(values.screening_mode === "multi-predicate")}
                                            disabled={(screeners.current.length !== 0)}/>
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
                <button className="start-btn" type="submit" style={{visibility: (collaboratorsFetch) ? 'hidden' : '' }} disabled={(values.screeners.length === 0 || isSubmitting)}>
                    {(screeners.current.length === 0) ? "Start Manual-screening" : "Add extra screeners"}
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