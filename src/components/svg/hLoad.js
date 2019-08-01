import React from "react";

/**
 * component svg
 */
const HLoad = function (props) {
    return(
        <svg version="1.1" id="h-load" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 600 200">
                <g className={(props.className) ? "st0-h-load-wrap "+props.className : "st0-h-load-wrap"}>
                    <circle className="st0-h-load" cx="125" cy="100" r="40">
                        <animate id="one" begin="0s; three.end-0.3s" repeatCount="1" attributeType="XML" attributeName="r"
                        from="40" to="40"
                    dur="0.8s"
                    calcMode="spline"
                        values="40; 60; 40"
                        keySplines="0.31896551724137934 0.05142857142857143 0.47413793103448276 0.9628571428571429;0.31896551724137934 0.05142857142857143 0.47413793103448276 0.9628571428571429"
                        fill="freeze"/>
                    </circle>
                    <circle className="st0-h-load" cx="300" cy="100" r="40">
                        <animate id="two" begin="one.end-0.3s" repeatCount="1" attributeType="XML" attributeName="r"
                        from="40" to="40"
                    dur="0.8s"
                    calcMode="spline"
                        values="40; 60; 40"
                        keySplines="0.31896551724137934 0.05142857142857143 0.47413793103448276 0.9628571428571429;0.31896551724137934 0.05142857142857143 0.47413793103448276 0.9628571428571429"
                        fill="freeze"/>
                    </circle>
                    <circle className="st0-h-load" cx="475" cy="100" r="40">
                        <animate id="three" begin="two.end-0.3s" repeatCount="1" attributeType="XML" attributeName="r"
                        from="40" to="40"
                    dur="0.8s"
                    calcMode="spline"
                        values="40; 60; 40"
                        keySplines="0.31896551724137934 0.05142857142857143 0.47413793103448276 0.9628571428571429;0.31896551724137934 0.05142857142857143 0.47413793103448276 0.9628571428571429"
                        fill="freeze"/>
                    </circle>
                </g>
        </svg>
    );
}

export default HLoad;