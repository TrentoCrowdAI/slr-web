import React, {useState} from "react";
import NoImage from "components/svg/noImage";

/*
* image component which deals with fetching error
* */
const Image = function({className, alt, src, style}){

    //profile image fetch error
    const [fetchError, setFetchError] = useState(false);


    let img = <></>;

    if(fetchError){
        img = <div className={className} alt="error loading image" style={style}><NoImage/></div>
    }else{
        img = <img className={className} alt={alt} src={src} onError={() => {setFetchError(true)}} style={style}/>
    }

    return img;

};

export  default  Image;