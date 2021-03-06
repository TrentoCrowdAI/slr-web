import React, {useEffect, useContext, useRef} from "react";
import { Formik, Form, Field } from "formik";

import {projectsDao} from 'dao/projects.dao'

import CloseButton from 'components/svg/closeButton';

import { AppContext } from 'components/providers/appProvider'

/**
 * this is the form for create or edit the project
 * @param props.project  project object if we want to update a old project
 * @param null if we want to create a new project
 */
function ProjectForm(props) {

    const mountRef = useRef(false);
    
    let yup = require('yup');

    const projectValidationSchema = yup.object().shape({
        name: yup.string().required('please enter a title'),
        description: yup.string().required('please enter a description')
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

    return (
        <>
        <Formik
            initialValues={{ name: '', description:''}}
            validationSchema={projectValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                let bodyData = {name: values.name, description: values.description};
                //call dao
                let res = await projectsDao.postProject(bodyData);

                //error checking
                if(mountRef.current && res.message){
                    //pass error object to global context
                    appConsumer.setError(res);
                }else if(mountRef.current){
                    props.history.push("/projects/" + res.id);
                }
                if(mountRef.current){
                    setSubmitting(false);
                }
            }}
            validateOnBlur={false}
        >
        {function ({ errors, touched, isSubmitting, isValid, setErrors, validateField, handleChange }) {
            let output = "";
            output = (<Form className="modal floating-form add-project" style={{visibility: (!props.visibility) ? 'hidden' : '' }}>
                <button type="button" className="close-btn" onClick={(e) => {
                    props.setVisibility(!props.visibility);
                }}><CloseButton/></button>
                <Field
                    style={{borderBottom : (errors.name && touched.name) ? "solid 1px #d81e1e" : ""}}
                    name="name"
                    type="text" 
                    placeholder="Please enter a project title"
                    onChange={(e) => {handleChange(e); validateField('name')}}/>
                <br/>
                <Field
                    style={{borderBottom : (errors.description && touched.description) ? "solid 1px #d81e1e" : ""}}
                    name="description"
                    component="textarea"
                    placeholder="Please describe the topic and focus of this new project"/>
                <br/>
                <button type="submit" disabled={isSubmitting || !isValid}>Add Project</button>
            </Form>
            );
            return output;
        }}
        </Formik>

       
        </>
    );


}


export default ProjectForm;