import React, {useContext, useState, useEffect} from "react";
import { Formik, Form, Field } from "formik";

import SideOptions from 'components/modules/sideOptions';
import CloseButton from 'components/svg/closeButton';
import {AppContext} from 'components/providers/appProvider';


const FilterCard = function ({filter, yup}) {


    let mounted = true;

    //bool to display the card and remove it in case of successful delete
    const [display, setDisplay] = useState(true);

    //bool to display the edit form
    const [editing, setEditing] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //side options
    let sideOptions= ["delete", "update"];

    useEffect(() => {
        return () => {
            mounted = false;
        };
    }, [])

    //handle for the side options
    async function handleSideOptions(id, name){
        if(name === "delete"){
            console.log("deleting " + id);
            //call the dao
            //let res = await projectPapersDao.deletePaper(id);

            /*
            //error checking
            //if is other error
            if (mounted && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if res isn't null
            else if (mounted && res !== null) {

                appConsumer.setNotificationMessage("Successfully deleted");
                let newFiltersList = filtersList.filter((filter)=>filter.id !== id);
                setFiltersList(newFiltersList);
            }
            */
           setDisplay(false);
        }
        else if(name === "update"){
            setEditing(true);
        }
    }

    let output;
    if(display && editing){

        const predicateValidationSchema = yup.object().shape({
            predicate: yup.string().required('please enter a question'),
            should: yup.string().required('please enter the positive answer'),
            shouldNot: yup.string().required('please enter the neagative answer')
        });

        output = (
            <Formik
                initialValues={{predicate: filter.predicate, should: filter.should, shouldNot: filter.shouldNot}}
                validationSchema={predicateValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    let bodyData = {predicate: values.predicate, should: values.should, shouldNot: values.shouldNot};
                    console.log("submited")
                    
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
                    setEditing(false);
                }}
                validateOnBlur={false}
            >
            {function ({ errors, touched, isSubmitting, setErrors, validateField, handleChange }) {
                let output = "";
                output = (
                <Form className="update-filter-card">
                    <button type="button" className="close-btn" onClick={(e) => {
                        setEditing(false);
                    }}><CloseButton/></button>
                    <Field
                        style={{borderBottom : (errors.predicate && touched.predicate) ? "solid 1px #d81e1e" : ""}}
                        name="predicate"
                        type="text" 
                        placeholder="Type a question, predicate, ..."
                        onChange={(e) => {handleChange(e); validateField('predicate')}}/>
                    <div className="textareas-description-wrapper">
                        <div>
                            Positive answer
                        </div>
                        <div>
                            Negative answer
                        </div>
                    </div>
                    <div className="textareas-wrapper">
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
                    </div>
                    <button type="submit" disabled={isSubmitting || 
                        ((errors.predicate && touched.predicate) ||
                        (errors.should && touched.should)        ||
                        (errors.shouldNot && touched.shouldNot))}>Update Filter</button>
                </Form>
            );
            return output;
            }}
            </Formik>
        );
    }
    else if(display){
        output = (
            <>
                <SideOptions options={sideOptions} handler={handleSideOptions} target={filter.id} cls="card-options"/>
                <h3>{filter.id}) {filter.predicate}</h3>
                <div className="answer"><p><span><span>Include</span><span>:</span></span> {filter.should}</p></div>
                <div className="answer"><p><span><span>Exclude</span><span>:</span></span> {filter.shouldNot}</p></div>
            </>
        );
    }else{
        output = <></>;
    }
    return output;


};

export default FilterCard;