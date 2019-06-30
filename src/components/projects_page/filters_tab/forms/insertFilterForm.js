import React, {useEffect, useContext, useRef} from "react";
import { Formik, Form, Field } from "formik";

import {projectFiltersDao} from 'dao/projectFilters.dao';

import {AppContext} from 'components/providers/appProvider'

/**
 * this is the form for adding a new filter to a project
 */


const InsertFilterForm = function(props){

    const mountRef = useRef(false);

    let yup = require('yup');

    const predicateValidationSchema = yup.object().shape({
        predicate: yup.string().required('please enter a question'),
        inclusion_description: yup.string().required('please enter the positive answer'),
        exclusion_description: yup.string().required('please enter the neagative answer')
    });

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    let output = "";
    output = (
        <div className="right-side-wrapper form-filter-wrapper">
            <Formik
                initialValues={{predicate: '', inclusion_description: '', exclusion_description: ''}}
                validationSchema={predicateValidationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    let bodyData = {project_id: props.project_id, predicate: values.predicate, 
                                    inclusion_description: values.inclusion_description, exclusion_description: values.exclusion_description};

                    //call dao
                    let res = await projectFiltersDao.postFilterIntoProject(bodyData);

                    //error checking
                    if(mountRef.current && res.message){
                        //pass error object to global context
                        appConsumer.setError(res);
                    }else if(mountRef.current && res){
                        console.log(res);
                        props.setFiltersList([res, ...(props.filtersList)])
                    }
                    if(mountRef.current){
                        setSubmitting(false);
                        resetForm({predicate: '', inclusion_description: '', exclusion_description: ''});
                    }
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
                        style={{borderBottom : (errors.inclusion_description && touched.inclusion_description) ? "solid 1px #d81e1e" : ""}}
                        name="inclusion_description"
                        component="textarea"
                        placeholder="Type what the answer should include"/>
                    <Field
                        style={{borderBottom : (errors.exclusion_description && touched.exclusion_description) ? "solid 1px #d81e1e" : ""}}
                        name="exclusion_description"
                        component="textarea"
                        placeholder="Type what the answer should not include"/>
                    <button type="submit" disabled={isSubmitting || 
                        ((errors.predicate && touched.predicate) ||
                        (errors.inclusion_description && touched.inclusion_description)        ||
                        (errors.exclusion_description && touched.exclusion_description))}>Add Filter</button>
                </Form>
            );
            return output;
        }}
        </Formik>

    </div>
    );
    return output;
}

export default InsertFilterForm;
