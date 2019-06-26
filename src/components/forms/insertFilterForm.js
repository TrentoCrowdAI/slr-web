import React, {useState, useContext, useEffect} from "react";
import { Formik, Form, Field } from "formik";

import {projectsDao} from 'dao/projects.dao';
import {AppContext} from 'components/providers/appProvider'


/**
 * this is the description component for the project page
 */


const InsertFilterForm = function(props){

    //boolean flag for handling hooks
    let mounted = true;

    let yup = require('yup');

    const predicateValidationSchema = yup.object().shape({
        predicate: yup.string().required('please enter a question'),
        should: yup.string().required('please enter the positive answer'),
        shouldNot: yup.string().required('please enter the neagative answer')
    });

    useEffect(() => {
        return () => {
            mounted = false;
        };
    }, [])

    return (
        <div className="right-side-wrapper form-filter-wrapper">
             <Formik
                    initialValues={{predicate: '', should: '', shouldNot: ''}}
                    validationSchema={predicateValidationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        let bodyData = {predicate: values.predicate, should: values.should, shouldNot: values.shouldNot};
                        if(props.start === 0){
                            let newList = [{id:"-1", ...bodyData}, ...(props.filtersList)];
                            props.setFiltersList(newList);
                        }
                        
                        //call dao
                        //let res = await projectsDao.postProject(bodyData);
                        /*
                        //error checking
                        if(mounted && res.message){
                            //pass error object to global context
                            appConsumer.setError(res);
                        }else if(mounted){
                            props.history.push("/projects/" + res.id);
                        }
                        */
                        setSubmitting(false);
                    }}
                    validateOnBlur={false}
                >
                {function ({ errors, touched, isSubmitting, setErrors, validateField, handleChange }) {
                    let output = "";
                    output = (
                    <Form className="add-filter">
                        <Field
                            style={{borderBottom : (errors.predicate && touched.predicate) ? "solid 1px #d81e1e" : ""}}
                            name="predicate"
                            type="text" 
                            placeholder="Type a question, predicate, ..."
                            onChange={(e) => {handleChange(e); validateField('predicate')}}/>
                        <Field
                            style={{borderBottom : (errors.should && touched.should) ? "solid 1px #d81e1e" : ""}}
                            name="should"
                            component="textarea"
                            placeholder="Type what the answer should include"/>
                        <Field
                            style={{borderBottom : (errors.shouldNot && touched.shouldNot) ? "solid 1px #d81e1e" : ""}}
                            name="shouldNot"
                            component="textarea"
                            placeholder="Type what the answer should not include"/>
                        <button type="submit" disabled={isSubmitting || 
                            ((errors.predicate && touched.predicate) ||
                            (errors.should && touched.should)        ||
                            (errors.shouldNot && touched.shouldNot))}>Add Filter</button>
                    </Form>
                );
                return output;
            }}
            </Formik>

        </div>
    );
}

export default InsertFilterForm;