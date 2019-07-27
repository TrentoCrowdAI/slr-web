import React, {useEffect, useContext, useRef} from "react";
import { Formik, Form, Field } from "formik";

import Select from 'components/forms_elements/selectformik';

import CloseButton from 'components/svg/closeButton';

import {projectScreeningDao} from 'dao/projectScreening.dao';

import { AppContext } from 'components/providers/appProvider'

//confidence value array
const confidenceValues = [
    {label : "0.90", value: 0.9},
    {label : "0.80", value: 0.8},
    {label : "0.70", value: 0.7},
    {label : "0.60", value: 0.6},
    {label : "0.50", value: 0.5},
    {label : "0.40", value: 0.4},
    {label : "0.30", value: 0.3},
    {label : "0.20", value: 0.2},
    {label : "0.10", value: 0.1},
];

/**
 * this is the form for starting the auto screening
 */
function AutoScreeningForm(props) {

    const mountRef = useRef(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    return (
        <>
        <Formik
            initialValues={{threshold: 0.9}}
            onSubmit={async (values, { setSubmitting }) => {
                let bodyData = {project_id: props.project_id, threshold: values.threshold};

                //call dao
                let res = await projectScreeningDao.startAutoScreening(bodyData);

                //error checking
                if(mountRef.current && res.message){
                    //pass error object to global context
                    appConsumer.setError(res);
                }else 
                if(mountRef.current){
                    setSubmitting(false);
                    props.setVisibility(!props.visibility);
                    props.setAutoScreeningFlag(true);
                }
            }}
            validateOnBlur={false}
        >
        {function ({ errors, touched, isSubmitting, isValid, setErrors, validateField, handleChange }) {
            let output = "";
            output = (<Form className="modal floating-form start-auto-screening" style={{visibility: (!props.visibility) ? 'hidden' : '' }}>
                <button type="button" className="close-btn" onClick={(e) => {
                    props.setVisibility(!props.visibility);
                }}><CloseButton/></button>

                <h2>Start automated screening?</h2>

                <p>
                    The process will analyze the papers in the backlog and will
                    assing a confidence score to each one, this may take a while.
                    You can select a confidence threshold and, as the process is
                    proceeding, all papers with a resulting confidence level above
                    the threshold will be automatically set as screened (in). The
                    remaining ones will be here in the backlog.
                </p>

                <Field
                    name="threshold"
                    render={({ field, form }) => (
                            <Select options={confidenceValues} {...field} form={form} type={"mini"}/>
                    )}
                />

                <button className="start-btn" type="submit">Start Auto-screening</button>
            </Form>
            );
            return output;
        }}
        </Formik>

       
        </>
    );


}


export default AutoScreeningForm;