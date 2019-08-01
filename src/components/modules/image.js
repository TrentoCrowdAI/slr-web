import React, {useState, useEffect} from "react";
import NoImage from "components/svg/noImage";
import NoProfileImage from "components/svg/noProfileImage";

/*
* image component which deals with fetching error
* */
const Image = function({className, alt, src, style, type}){

    //profile image fetch error
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        let mount = true;
        if(mount && !src){
            setFetchError(true);
        }
        return () => {
            mount = false;
        };
    }, [])

    let img = <></>;

    if(fetchError){
        if(type === "profile-pic"){
            img = <div className={className} alt="error loading image" style={style}><NoProfileImage/></div>
        }else{
            img = <div className={className} alt="error loading image" style={style}><NoImage/></div>
        }
    }else{
        img = <img className={className} alt={alt} title={alt} src={src} onError={() => {setFetchError(true)}} style={style}/>
    }

    return img;

};

export  default  Image;